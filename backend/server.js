require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Alat pemanggil Gemini
const Laporan = require('./models/Laporan'); // Cetakan Buku Kasir

const app = express();
const PORT = process.env.PORT || 5000;

// Inisialisasi Koki Gemini menggunakan kunci rahasia
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Buku Kasir (MongoDB) berhasil tersambung!'))
  .catch((err) => console.log('Gagal menyambung ke MongoDB:', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Dapur Backend Standup Canvas sudah menyala dan siap masak!');
});

// Jalur Utama Laporan
app.post('/api/laporan', async (req, res) => {
    try {
        // 1. Terima pesanan dari Ruang Makan (Frontend)
        const { teksLaporan } = req.body;
        console.log("Menerima laporan:", teksLaporan);

        // 2. Suruh Koki (Gemini) Menganalisis
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Model yang paling cepat
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
        
        // (Hackathon Trick) Bersihkan teks dari simbol aneh agar bisa dibaca komputer
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const hasilAI = JSON.parse(responseText); 

        // 3. Simpan ke Buku Kasir (MongoDB)
        const laporanBaru = new Laporan({
            teksAsli: teksLaporan,
            hasilAI: hasilAI
        });
        await laporanBaru.save();

        // 4. Kirim makanan (hasil akhir) kembali ke Ruang Makan
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

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});