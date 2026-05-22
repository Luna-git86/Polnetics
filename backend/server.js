require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const Laporan = require('./models/Laporan'); 
const simpleGit = require('simple-git'); // Tambahan: Panggil simple-git di atas

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
        const { teksLaporan } = req.body;
        console.log("Menerima laporan:", teksLaporan);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        const prompt = `
            Kamu adalah asisten analis profesional. Baca laporan ini: "${teksLaporan}"
            Berikan analisis singkat.
            PENTING: Kamu HANYA boleh membalas dengan format JSON murni seperti struktur di bawah ini, tanpa awalan atau akhiran teks lain:
            {
                "ringkasan": "string (maksimal 2 kalimat)",
                "sentimen": "Positif / Negatif / Netral",
                "skalaUrgensi": angka (1 sampai 5)
            }
        `;
        
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const hasilAI = JSON.parse(responseText); 

        const laporanBaru = new Laporan({
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

// ==========================================
// MENYALAKAN SERVER
// ==========================================
server.listen(PORT, () => {
    console.log(`Server & WebSockets berjalan di http://localhost:${PORT}`);
});