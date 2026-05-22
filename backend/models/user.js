const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // FITUR BARU: Menyimpan peran anggota di dalam tim
    role: { 
        type: String, 
        required: true, 
        enum: ['backend', 'frontend', 'lead-engineer', 'ui-ux', 'devops'], // Batasi pilihan peran agar rapi
        default: 'frontend' 
    },
    tanggalDaftar: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);