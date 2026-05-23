const mongoose = require('mongoose');

const laporanSchema = new mongoose.Schema({
    nama: { type: String, required: true }, 
    teksAsli: { type: String, required: true },
    hasilAI: { type: Object, default: {} },
    // FITUR BARU: Mengikat laporan ke Workspace tertentu
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true }, 
    tanggalPembuatan: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Laporan', laporanSchema);