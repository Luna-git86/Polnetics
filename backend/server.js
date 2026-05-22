require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const Laporan = require('./models/Laporan'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
const simpleGit = require('simple-git'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Mengizinkan semua user web untuk terhubung
        methods: ["GET", "POST"]
    }
});

// Menangkap user yang terhubung ke Workspace
io.on('connection', (socket) => {
    console.log(`🟢 User baru terhubung ke Workspace: ${socket.id}`);
});
const PORT = process.env.PORT || 5000;

// Menunjuk ke folder proyek tempat Git berjalan ('../' artinya naik satu level)
const git = simpleGit('../'); 

// Inisialisasi Koki Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Buku Kasir (MongoDB) berhasil tersambung!'))
  .catch((err) => console.log('Gagal menyambung ke MongoDB:', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Dapur Backend Standup Canvas sudah menyala dan siap masak!');
});

// ==========================================
// FITUR 1: AI GEMINI & LAPORAN
// ==========================================

// Jalur Menerima Laporan & Analisis AI
app.post('/api/laporan', async (req, res) => {
    try {
        // Tangkap workspaceId dari Frontend
        const { nama, teksLaporan, workspaceId } = req.body;
        
        if (!workspaceId) {
            return res.status(400).json({ status: "gagal", pesan: "Workspace ID tidak ditemukan!" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        const prompt = `
            Kamu adalah AI Scrum Master. Baca laporan harian ini: "${teksLaporan}"
            Balas dengan format JSON murni persis seperti ini:
            {
                "pastProgress": { "status": "done", "deskripsi": "..." },
                "currentTarget": { "status": "in-progress", "deskripsi": "..." },
                "blocker": { "hasBlocker": true/false, "to": "...", "reason": "..." },
                "metrics": { "velocity": 80, "fatigue": 20, "motivation": 90 }
            }
        `;
        
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const hasilAI = JSON.parse(responseText); 

        const laporanBaru = new Laporan({
            nama: nama || "Anonim",
            teksAsli: teksLaporan,
            hasilAI: hasilAI,
            workspaceId: workspaceId // Simpan ke proyek spesifik
        });
        await laporanBaru.save();

        io.emit('laporan-baru', laporanBaru);

        res.json({ status: "sukses", pesan: "Laporan berhasil dianalisis!", data: laporanBaru });
    } catch (error) {
        console.error("Dapur sedang kacau:", error);
        res.status(500).json({ status: "gagal", pesan: "Terjadi kesalahan di server." });
    }
});

// JALUR GET: Mengambil Laporan berdasarkan Workspace ID
app.get('/api/laporan/:workspaceId', async (req, res) => {
    try {
        const { workspaceId } = req.params;
        // Hanya cari laporan yang cocok dengan ID proyek
        const semuaLaporan = await Laporan.find({ workspaceId: workspaceId }).sort({ tanggalPembuatan: -1 });
        
        res.json({ status: "sukses", data: semuaLaporan });
    } catch (error) {
        res.status(500).json({ status: "gagal", pesan: "Terjadi kesalahan saat mengambil data." });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        // Tangkap data role dari frontend
        const { nama, email, password, role } = req.body;

        const userLama = await User.findOne({ email });
        if (userLama) return res.status(400).json({ status: "gagal", pesan: "Email sudah terdaftar!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan user baru lengkap dengan perannya
        const userBaru = new User({ 
            nama, 
            email, 
            password: hashedPassword,
            role: role // Menyimpan role seperti 'backend', 'lead-engineer', dll.
        });
        await userBaru.save();

        res.json({ status: "sukses", pesan: "Akun berhasil dibuat! Silakan login." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "gagal", pesan: "Error di server" });
    }
});

// 2. LOGIN (Menyelipkan Peran ke Tiket JWT)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ status: "gagal", pesan: "Email tidak ditemukan!" });

        const passwordCocok = await bcrypt.compare(password, user.password);
        if (!passwordCocok) return res.status(400).json({ status: "gagal", pesan: "Password salah!" });

        const token = jwt.sign(
            { id: user._id, nama: user.nama, role: user.role }, 
            'kunci_rahasia_polnetics', 
            { expiresIn: '1d' }
        );

        // --- TAMBAHAN LOGIKA: CARI WORKSPACE USER ---
        const Workspace = require('./models/Workspace'); // Pastikan model dipanggil
        // Cari workspace pertama di mana user ini terdaftar sebagai anggota
        const workspaceUser = await Workspace.findOne({ "anggota.user": user._id });

        res.json({ 
            status: "sukses", 
            pesan: "Login berhasil!", 
            token: token,
            dataUser: { 
                _id: user._id, 
                nama: user.nama, 
                email: user.email,
                role: user.role 
            },
            // Kirim data workspace ke frontend (akan null jika belum punya)
            workspaceAktif: workspaceUser 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "gagal", pesan: "Error di server" });
    }
});

const Workspace = require('./models/Workspace');    

// Jalur untuk Mengambil Semua Laporan (Untuk Dashboard Frontend)
// Jalur Mengambil Semua Laporan
app.get('/api/laporan', async (req, res) => {
    try {
        const semuaLaporan = await Laporan.find().sort({ tanggalPembuatan: -1 });
        
        res.json({
            status: "sukses",
            pesan: "Berhasil mengambil data laporan",
            data: semuaLaporan
        });
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        res.status(500).json({ status: "gagal", pesan: "Terjadi kesalahan saat mengambil data." });
    }
}); // <-- TITIK KRUSIAL: Ini adalah penutup yang benar untuk app.get


// ==========================================
// FITUR 2: INTEGRASI GIT OTOMATIS
// ==========================================

// RUTE UNTUK COMMIT
app.post('/api/git/commit', async (req, res) => {
    try {
        const { pesanCommit } = req.body;
        
        if (!pesanCommit) {
            return res.status(400).json({ status: "gagal", pesan: "Pesan commit tidak boleh kosong" });
        }

        console.log("Menjalankan git add dan commit...");
        await git.add('./*'); 
        const hasilCommit = await git.commit(pesanCommit);

    // INI PENGERAS SUARANYA:
    io.emit('notif-workspace', {
        judul: "Pembaruan Disimpan! 📝",
        pesan: `Ada yang baru saja melakukan Commit: "${pesanCommit}"`
    });

        res.json({
            status: "sukses",
            pesan: "Berhasil melakukan commit dari aplikasi!",
            detail: hasilCommit
        });
    } catch (error) {
        console.error("Gagal commit:", error);
        res.status(500).json({ status: "gagal", pesan: error.message });
    }
});

// RUTE UNTUK PUSH
app.post('/api/git/push', async (req, res) => {
    try {
        const { branch } = req.body; 
        const branchTujuan = branch || 'main';

        console.log(`Menjalankan git push ke branch ${branchTujuan}...`);
        // ... kode git.push
await git.push('origin', branchTujuan);

// INI PENGERAS SUARANYA:
io.emit('notif-workspace', {
    judul: "Kode Mengudara! 🚀",
    pesan: `Kode terbaru telah di-push ke GitHub (Branch: ${branchTujuan})`
});

        res.json({
            status: "sukses",
            pesan: `Berhasil push ke GitHub pada branch ${branchTujuan}!`
        });
    } catch (error) {
        console.error("Gagal push:", error);
        res.status(500).json({ status: "gagal", pesan: "Gagal push: " + error.message });
    }
});

// RUTE UNTUK PULL
app.post('/api/git/pull', async (req, res) => {
    try {
        console.log("Menjalankan git pull...");
        const hasilPull = await git.pull();

        // INI PENGERAS SUARANYA:
        io.emit('notif-workspace', {
            judul: "Sinkronisasi Berhasil! 🔄",
            pesan: "Data terbaru telah ditarik (pull) ke dalam Workspace."
        });

        res.json({
            status: "sukses",
            pesan: "Berhasil menarik data terbaru (pull) dari GitHub!",
            detail: hasilPull
        });
    } catch (error) {
        console.error("Gagal pull:", error);
        res.status(500).json({ status: "gagal", pesan: "Gagal pull: " + error.message });
    }
});


// ==========================================
// FITUR 3: WEBHOOK (OTOMATISASI GITHUB)
// ==========================================
app.post('/api/webhook', async (req, res) => {
    console.log("🔔 Sinyal dari GitHub masuk!");
    try {
        await git.pull();
        // INI PENGERAS SUARANYA:
        io.emit('notif-workspace', { 
            judul: "Pembaruan Git 🚀", 
            pesan: "Ada pembaruan kode terbaru yang baru saja ditarik!" 
        });
        
        console.log("✅ Berhasil pull dan sebar notif!");
        res.status(200).send("Webhook berhasil dieksekusi");
    } catch (error) {
        res.status(500).send("Gagal eksekusi webhook");
    }
});

// 1. BUAT WORKSPACE BARU (Otomatis jadi 'Owner')
app.post('/api/workspace/create', async (req, res) => {
    try {
        const { namaWorkspace, userId, namaUser } = req.body;
        
        // Buat kode unik 6 huruf acak untuk invite member
        const kodeJoin = Math.random().toString(36).substring(2, 8).toUpperCase();

        const workspaceBaru = new Workspace({
            namaWorkspace,
            kodeJoin,
            pembuat: userId,
            anggota: [{ user: userId, nama: namaUser, role: 'Owner' }] // Pembuat otomatis jadi bos
        });

        await workspaceBaru.save();
        res.json({ status: "sukses", pesan: "Workspace berhasil dibuat!", data: workspaceBaru });
    } catch (error) {
        res.status(500).json({ status: "gagal", pesan: error.message });
    }
});

// 2. GABUNG WORKSPACE (Otomatis jadi 'Member')
app.post('/api/workspace/join', async (req, res) => {
    try {
        const { kodeJoin, userId, namaUser } = req.body;

        const workspace = await Workspace.findOne({ kodeJoin });
        if (!workspace) return res.status(404).json({ status: "gagal", pesan: "Kode Workspace tidak ditemukan!" });

        // Cek apakah user sudah ada di dalam workspace
        const sudahGabung = workspace.anggota.find(m => m.user.toString() === userId);
        if (sudahGabung) return res.status(400).json({ status: "gagal", pesan: "Kamu sudah berada di Workspace ini." });

        // Masukkan user baru sebagai 'Member'
        workspace.anggota.push({ user: userId, nama: namaUser, role: 'Member' });
        await workspace.save();

        res.json({ status: "sukses", pesan: `Berhasil bergabung ke ${workspace.namaWorkspace}`, data: workspace });
    } catch (error) {
        res.status(500).json({ status: "gagal", pesan: error.message });
    }
});

// 3. UBAH ROLE MEMBER (Hanya bisa dilakukan oleh Owner/Admin)
app.put('/api/workspace/role', async (req, res) => {
    try {
        const { workspaceId, requesterId, targetUserId, roleBaru } = req.body;

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ status: "gagal", pesan: "Workspace tidak ditemukan!" });

        // Cari siapa yang me-request perubahan ini (Apakah dia Owner/Admin?)
        const requester = workspace.anggota.find(m => m.user.toString() === requesterId);
        if (!requester || (requester.role !== 'Owner' && requester.role !== 'Admin')) {
            return res.status(403).json({ status: "gagal", pesan: "Akses Ditolak! Hanya Owner atau Admin yang bisa mengubah Role." });
        }

        // Cari member yang rolenya mau diubah
        const targetUser = workspace.anggota.find(m => m.user.toString() === targetUserId);
        if (!targetUser) return res.status(404).json({ status: "gagal", pesan: "Member tidak ditemukan di Workspace ini." });

        // Cegah Admin mengubah role Owner
        if (targetUser.role === 'Owner' && requester.role === 'Admin') {
            return res.status(403).json({ status: "gagal", pesan: "Admin tidak bisa mengubah jabatan Owner!" });
        }

        // Ubah rolenya dan simpan
        targetUser.role = roleBaru;
        await workspace.save();

        res.json({ status: "sukses", pesan: `Role ${targetUser.nama} berhasil diubah menjadi ${roleBaru}!`, data: workspace });
    } catch (error) {
        res.status(500).json({ status: "gagal", pesan: error.message });
    }
});

// ==========================================
// MENYALAKAN SERVER
// ==========================================
server.listen(PORT, () => {
    console.log(`Server & WebSockets berjalan di http://localhost:${PORT}`);
});