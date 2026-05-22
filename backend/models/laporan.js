const mongoose = require('mongoose');

// Ini adalah cetakan bentuk data yang akan disimpan ke database
const laporanSchema = new mongoose.Schema({
    teksAsli: {
        type: String,
        required: true
    },
    hasilAI: {
        type: Object, // AI Gemini nanti akan membalas dengan format JSON (Objek)
        default: {}
    },
    tanggalPembuatan: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Laporan', laporanSchema);