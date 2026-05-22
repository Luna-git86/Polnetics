require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const Laporan = require('./models/Laporan'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
const simpleGit = require('simple-git'); 

const app = express();
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
        // 1. Terima pesanan dari Ruang Makan (Frontend) - TANGKAP NAMA JUGA
        const { nama, teksLaporan } = req.body;
        console.log(`Menerima laporan dari ${nama}:`, teksLaporan);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        const prompt = `
            Kamu adalah AI Scrum Master dan Technical Agile Coach. Baca laporan harian (daily standup) dari seorang programmer ini: "${teksLaporan}"
            Tugasmu adalah mendekonstruksi teks tersebut ke dalam metrik Agile. Pahami jargon teknis seperti API, Bug, Deploy, PR, dll.
            PENTING: Kamu HANYA boleh membalas dengan format JSON murni persis seperti struktur di bawah ini tanpa teks pengantar:
            {
                "pastProgress": { "status": "done atau in-progress", "deskripsi": "Fitur/kode apa yang dikerjakan sebelumnya" },
                "currentTarget": { "status": "in-progress", "deskripsi": "Fitur/kode apa yang akan dikerjakan hari ini" },
                "blocker": { "hasBlocker": true/false, "to": "Nama role/orang yang ditunggu (misal: DevOps, Zidan, dll)", "reason": "Alasan hambatan teknis" },
                "metrics": {
                    "velocity": angka_1_sampai_100,
                    "fatigue": angka_1_sampai_100,
                    "motivation": angka_1_sampai_100
                }
            }
        `;
        
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const hasilAI = JSON.parse(responseText); 

       // 3. Simpan ke Buku Kasir (MongoDB) - MASUKKAN NAMA
        const laporanBaru = new Laporan({
            nama: nama || "Anonim", // Jika lupa kirim nama, isi dengan "Anonim"
            teksAsli: teksLaporan,
            hasilAI: hasilAI
        });
        await laporanBaru.save();

        res.json({
            status: "sukses",
            pesan: "Laporan berhasil dianalisis!",
            data: laporanBaru
        });

    } catch (error) {
        console.error("Dapur sedang kacau:", error);
        res.status(500).json({ status: "gagal", pesan: "Terjadi kesalahan di server." });
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

        // PENTING: Masukkan data 'role' ke dalam Token JWT agar aman dan tidak bisa dimanipulasi
        const token = jwt.sign(
            { id: user._id, nama: user.nama, role: user.role }, 
            'kunci_rahasia_polnetics', 
            { expiresIn: '1d' }
        );

        res.json({ 
            status: "sukses", 
            pesan: "Login berhasil!", 
            token: token,
            dataUser: { 
                nama: user.nama, 
                email: user.email,
                role: user.role // Berikan data role ke frontend untuk atur tampilan layar
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "gagal", pesan: "Error di server" });
    }
});

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
        await git.push('origin', branchTujuan);

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
    console.log("🔔 Sinyal dari GitHub masuk! Menarik kode terbaru otomatis...");
    try {
        await git.pull();
        console.log("✅ Berhasil memperbarui kode di laptop secara otomatis!");
        res.status(200).send("Webhook berhasil dieksekusi");
    } catch (error) {
        console.error("❌ Gagal pull otomatis:", error);
        res.status(500).send("Gagal eksekusi webhook");
    }
});

// ==========================================
// MENYALAKAN SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});