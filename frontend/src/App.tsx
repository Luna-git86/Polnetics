import { useState } from 'react';

function TesAuth() {
  const [status, setStatus] = useState<string>("Belum ada aktivitas");
  const [token, setToken] = useState<string | null>(localStorage.getItem('token')); // Mengambil token jika sudah login sebelumnya
  
  // Data sementara untuk tes (bisa diganti dengan input form beneran nanti)
  const dataPalsu = {
    nama: "Luna",
    email: "luna.tes@polnetics.com",
    password: "password123",
    role: "backend"
  };

  // 1. Fungsi Tes Sign Up
  const tesDaftar = async () => {
    setStatus("Sedang mendaftarkan akun...");
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataPalsu),
      });
      
      const data = await response.json();
      console.log("📝 BALASAN SIGN UP:", data);
      
      if(response.ok) {
         setStatus(`Berhasil Daftar! ${data.pesan}`);
      } else {
         setStatus(`Gagal Daftar: ${data.pesan}`);
      }
    } catch (error) {
      console.error("Gagal Request:", error);
      setStatus("Error! Cek terminal backend.");
    }
  };

  // 2. Fungsi Tes Login
  const tesLogin = async () => {
    setStatus("Sedang mencoba masuk...");
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: dataPalsu.email,
            password: dataPalsu.password
        }),
      });
      
      const data = await response.json();
      console.log("🔐 BALASAN LOGIN:", data);
      
      if(response.ok) {
        // SIMPAN TIKET MASUK (TOKEN) KE BROWSER!
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setStatus(`Berhasil Login! Halo ${data.dataUser.nama} (${data.dataUser.role})`);
      } else {
        setStatus(`Gagal Login: ${data.pesan}`);
      }
    } catch (error) {
      console.error("Gagal Request:", error);
      setStatus("Error! Cek terminal backend.");
    }
  };

  // 3. Fungsi Logout (Keluar)
  const tesLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setStatus("Berhasil Logout. Token dihapus.");
  }

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", border: "2px solid #333", margin: "20px" }}>
      <h2>Tes Keamanan (Auth) 🛡️</h2>
      
      <div style={{ marginBottom: "15px" }}>
         <p style={{ margin: "5px 0", fontSize: "14px", color: "gray"}}>*Mendaftar menggunakan akun: {dataPalsu.email}</p>
        <button onClick={tesDaftar} style={{ padding: "8px", marginRight: "10px", cursor: "pointer" }}>
          1. Tes Sign Up
        </button>
        <button onClick={tesLogin} style={{ padding: "8px", marginRight: "10px", cursor: "pointer" }}>
          2. Tes Login
        </button>
        <button onClick={tesLogout} style={{ padding: "8px", cursor: "pointer", background: "#ff4d4d", color: "white" }}>
          3. Logout
        </button>
      </div>
      
      <div style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Status Login:</strong> {token ? "✅ Sedang Login" : "❌ Belum Login"}</p>
      </div>
    </div>
  );
}

export default TesAuth;