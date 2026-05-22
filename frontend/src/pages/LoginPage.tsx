import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Zap, Activity } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPesan, setErrorPesan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman ke-refresh
    setErrorPesan('');

    // Validasi Front-end (Cegah form kosong)
    if (!email || !password) {
      setErrorPesan('Email dan Password wajib diisi!');
      return;
    }

    try {
      setIsLoading(true);
      
      // Menembak Backend
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok || data.status === 'sukses') {
        // Simpan data otentikasi ke penyimpanan browser
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.dataUser || data.user));
        
        // JALUR PENGALIHAN CERDAS (Atasi amnesia state):
        // Cek apakah Backend mengembalikan data workspace yang pernah diikuti user
        if (data.workspaceAktif) {
          localStorage.setItem('activeWorkspace', JSON.stringify(data.workspaceAktif));
          // Jika ada, langsung bawa masuk ke Dashboard
          navigate('/dashboard');
        } else {
          // Jika baru pertama kali / belum punya proyek, arahkan ke Room Selection
          navigate('/room');
        }
      } else {
        setErrorPesan(data.pesan || 'Login gagal. Periksa kembali data Anda.');
      }
    } catch (error) {
      setErrorPesan('Gagal terhubung ke server Backend. Pastikan server nyala.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-50 text-[#0071E3] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={24} className="fill-[#0071E3]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">Masuk ke dalam workspace tim Anda</p>
        </div>

        {/* Notifikasi Error */}
        {errorPesan && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-red-600 font-medium">{errorPesan}</p>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="nama@email.com"
                className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0071E3] hover:bg-[#005bb5] text-white rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70 shadow-sm"
          >
            {isLoading ? <><Activity size={18} className="animate-spin" /> Memeriksa...</> : <><ArrowRight size={18} /> Masuk Sekarang</>}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="text-[#0071E3] font-bold hover:underline">
            Buat Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;