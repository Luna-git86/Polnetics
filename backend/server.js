require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Tambahkan ini

const app = express();
const PORT = process.env.PORT || 5000;

//Sambungkan ke MongoDB menggunakan Mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('(MongoDB) berhasil tersambung!'))
  .catch((err) => console.log('Gagal menyambung ke MongoDB:', err));

// Middleware (Agar Frontend diizinkan ngobrol dengan Backend)
app.use(cors());
app.use(express.json());

// Rute Uji Coba Dasar
app.get('/', (req, res) => {
    res.send('Dapur Backend Standup Canvas sudah menyala dan siap masak!');
});

// Rute untuk menerima laporan dari Frontend (Nanti disambung ke AI Gemini)
app.post('/api/laporan', (req, res) => {
    const dataLaporan = req.body;
    console.log("Menerima pesanan dari ruang makan (frontend):", dataLaporan);
    
    res.json({ 
        status: "sukses",
        pesan: "Laporan berhasil diterima oleh pelayan (server)!" 
    });
});

// Menyalakan kompor server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});