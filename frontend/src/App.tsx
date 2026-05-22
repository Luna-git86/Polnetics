import { useState } from 'react';

function App() {
  // Menggunakan TypeScript untuk mendefinisikan tipe data state
  const [status, setStatus] = useState<string>("Belum ada aktivitas");

  // 1. Fungsi Tes Sedot Data (GET)
  const tesAmbilData = async () => {
    setStatus("Sedang mengambil data...");
    try {
      const response = await fetch("http://localhost:5000/api/laporan");
      const data = await response.json();
      console.log("📡 DATA DARI BACKEND (GET):", data);
      setStatus("Berhasil GET! Cek Console Browser (F12)");
    } catch (error) {
      console.error("Gagal GET:", error);
      setStatus("Error GET! Server backend mati?");
    }
  };

  // 2. Fungsi Tes Kirim Data (POST)
  const tesKirimData = async () => {
    setStatus("Sedang mengirim ke AI...");
    try {
      const laporanPalsu = {
        teksLaporan: "Hari ini Zidan lagi ngetes fetch pakai TypeScript, butuh bantuan untuk bikin Dependency Map."
      };

      const response = await fetch("http://localhost:5000/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(laporanPalsu),
      });
      
      const data = await response.json();
      console.log("🤖 BALASAN DARI AI (POST):", data);
      setStatus("Berhasil POST! AI sudah menjawab. Cek Console (F12)");
    } catch (error) {
      console.error("Gagal POST:", error);
      setStatus("Error POST! Cek terminal backend.");
    }
  };

  return (
    <div style={{ padding: "50px", fontFamily: "sans-serif" }}>
      <h1>Tes Pipa Data Polnetics (TypeScript) 🚀</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={tesAmbilData} style={{ padding: "10px", marginRight: "10px", cursor: "pointer" }}>
          Tes GET (Ambil Laporan)
        </button>
        <button onClick={tesKirimData} style={{ padding: "10px", cursor: "pointer" }}>
          Tes POST (Kirim Laporan ke AI)
        </button>
      </div>
      <p><strong>Status:</strong> {status}</p>
    </div>
  );
}

export default App;