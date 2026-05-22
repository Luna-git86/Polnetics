import { useState } from 'react';
import { Mail, Lock, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; // Tambah alat navigasi

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // FUNGSI MENGIRIM DATA LOGIN KE BACKEND
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // SIMPAN TOKEN & DATA USER KE BROWSER
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.dataUser));
        
        // Pindah otomatis ke Dashboard
        navigate('/dashboard');
      } else {
        alert(`Gagal Login: ${data.pesan}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghubungi server backend!");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full z-0"></div>

      <div className="flex items-center gap-2 mb-8 z-10">
        <div className="p-2 bg-linear-to-br from-cyan-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <Zap size={24} className="fill-white text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-200 uppercase tracking-widest">
          CodeWorkZ
        </h1>
      </div>

      <div className="w-full max-w-100 p-10 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-[40px] shadow-2xl z-10 relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-slate-100 mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Sign in to continue to your dashboard</p>
        </div>

        {/* TAMBAHKAN onSubmit DI SINI */}
        <form className="space-y-6" onSubmit={handleLogin}>
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full bg-[#0f172a]/80 border border-slate-700 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-slate-200 placeholder:text-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full bg-[#0f172a]/80 border border-slate-700 py-4 pl-12 pr-12 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-slate-200 placeholder:text-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 cursor-pointer hover:text-slate-400" size={18} />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all group cursor-pointer"
          >
            Sign In
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            {/* Ubah <a> menjadi <Link> dari React Router */}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;