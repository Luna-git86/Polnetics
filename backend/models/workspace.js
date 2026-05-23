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
        nama: String,
        role: { 
            type: String, 
            // Gabungkan hak akses manajemen dan role teknis dari user.js
            enum: ['Owner', 'Admin', 'Member', 'backend', 'frontend', 'lead-engineer', 'ui-ux', 'devops'], 
            default: 'frontend' 
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Workspace', workspaceSchema);