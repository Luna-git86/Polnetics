const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    namaWorkspace: { 
        type: String, 
        required: true 
    },
    kodeJoin: { 
        type: String, 
        required: true, 
        unique: true // Kode unik agar orang bisa bergabung dengan mudah
    },
    // Mencatat siapa yang pertama kali membuat workspace ini
    pembuat: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Daftar anggota dan jabatan mereka
    anggota: [{
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        nama: String, // Simpan nama agar mudah ditampilkan di frontend
        role: { 
            type: String, 
            enum: ['Owner', 'Admin', 'Member'], // Hanya 3 jabatan ini yang diperbolehkan
            default: 'Member' 
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Workspace', workspaceSchema);