const mongoose = require('mongoose');

// Ini adalah cetakan bentuk data yang akan disimpan ke database
const laporanSchema = new mongoose.Schema({
    nama: { type: String, required: true }, // FITUR BARU: Menyimpan identitas pengirim
    teksAsli: { type: String, required: true },
    hasilAI: { type: Object, default: {} },
    tanggalPembuatan: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Laporan', laporanSchema);