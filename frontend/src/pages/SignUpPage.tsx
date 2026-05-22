import { useState } from 'react';
import { Mail, Lock, EyeOff, ArrowRight, Zap, User } from 'lucide-react'; // Tambah icon User
import { useNavigate } from 'react-router-dom'; // Tambah alat navigasi

const SignUpPage = () => {
  // State untuk menyimpan ketikan user
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // FUNGSI MENGIRIM DATA KE BACKEND
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah web reload saat tombol ditekan
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nama: nama, 
          email: email, 
          password: password, 
          role: 'frontend' // Default role sementara
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Pendaftaran Berhasil! 🎉 Silakan Login.");
        navigate('/login'); // Pindah otomatis ke halaman login
      } else {
        alert(`Gagal Daftar: ${data.pesan}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghubungi server backend!");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full z-0"></div>

      <div className="flex items-center gap-2 mb-8 z-10">
        <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <Zap size={24} className="fill-white text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-200">CodeWorkZ</h1>
      </div>

      <div className="w-full max-w-[400px] p-10 bg-[#0f172a]/90 border border-slate-800 rounded-[30px] shadow-2xl z-10 relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-100 mb-2">Sign Up</h2>
          <p className="text-slate-400 text-sm">Sign up to continue</p>
        </div>

        {/* TAMBAHKAN onSubmit DI SINI */}
        <form className="space-y-4" onSubmit={handleRegister}>
          
          {/* Input Nama Baru */}
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              required
              placeholder="Full Name"
              className="w-full bg-[#111827] border border-slate-700 py-3 pl-12 pr-4 rounded-xl outline-none focus:border-cyan-500/50 transition-all text-sm text-slate-200"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full bg-[#111827] border border-slate-700 py-3 pl-12 pr-4 rounded-xl outline-none focus:border-cyan-500/50 transition-all text-sm text-slate-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              required
              placeholder="Passwords"
              className="w-full bg-[#111827] border border-slate-700 py-3 pl-12 pr-10 rounded-xl outline-none focus:border-cyan-500/50 transition-all text-sm text-slate-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 cursor-pointer" size={16} />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all group cursor-pointer"
          >
            Create account
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;