import { useState } from 'react'
import './App.css'

function App() {
  // Tempat menyimpan teks yang diketik user
  const [teksLaporan, setTeksLaporan] = useState('');
  
  // Tempat menyimpan pesan status (Loading/Sukses/Error)
  const [status, setStatus] = useState('');
  
  // Tempat menyimpan balasan dari AI Gemini
  const [hasilAI, setHasilAI] = useState<any>(null);

  // Fungsi untuk mengirim data ke Backend
  const kirimDataKeBackend = async () => {
    if (!teksLaporan) {
      setStatus('Teks laporan tidak boleh kosong!');
      return;
    }

    setStatus('Sedang mengirim ke Koki Gemini (Loading)...');
    setHasilAI(null); // Kosongkan hasil sebelumnya

    try {
      // Menembak rute POST backend milikmu
      const response = await fetch('http://localhost:5000/api/laporan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teksLaporan: teksLaporan }),
      });

      const data = await response.json();

      if (data.status === 'sukses') {
        setStatus('Berhasil! Koki Gemini sudah membalas.');
        setHasilAI(data.data.hasilAI); // Menyimpan format JSON AI
      } else {
        setStatus('Gagal memproses data: ' + data.pesan);
      }
    } catch (error) {
      console.error('Error jaringan:', error);
      setStatus('Gagal terhubung! Pastikan server Backend menyala.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <h2>Uji Coba Kirim Laporan 🚀</h2>
      
      <textarea
        rows={5}
        placeholder="Ketik keluhan warga di sini..."
        value={teksLaporan}
        onChange={(e) => setTeksLaporan(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', color: 'black' }}
      />

      <button 
        onClick={kirimDataKeBackend}
        style={{ padding: '10px 20px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        Kirim ke AI
      </button>

      <div style={{ marginTop: '15px', fontStyle: 'italic' }}>
        <strong>Status:</strong> {status}
      </div>

      {/* Jika hasil AI sudah didapatkan, tampilkan kotaknya */}
      {hasilAI && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f1f1f1', borderLeft: '5px solid #646cff', color: 'black', borderRadius: '4px' }}>
          <h3 style={{ marginTop: 0 }}>📊 Hasil Analisis AI:</h3>
          <p><strong>Ringkasan:</strong> {hasilAI.ringkasan}</p>
          <p><strong>Sentimen:</strong> {hasilAI.sentimen}</p>
          <p><strong>Skala Urgensi:</strong> {hasilAI.skalaUrgensi} / 5</p>
        </div>
      )}
    </div>
  )
}

export default App