import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Zap, Activity, CheckCircle2 } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPesan, setErrorPesan] = useState('');
  const [suksesPesan, setSuksesPesan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorPesan('');
    setSuksesPesan('');

    if (!nama || !email || !password) {
      setErrorPesan('Semua kolom wajib diisi!');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password })
      });

      const data = await response.json();

      if (response.ok || data.status === 'sukses') {
        setSuksesPesan('Akun berhasil dibuat! Mengalihkan ke halaman Login...');
        // Tunggu 2 detik agar user sempat membaca pesan sukses, lalu alihkan
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorPesan(data.pesan || 'Gagal mendaftar. Email mungkin sudah dipakai.');
      }
    } catch (error) {
      setErrorPesan('Gagal terhubung ke server Backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-slate-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-50 text-[#34C759] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={24} className="fill-[#34C759]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Mulai revolusi kerjamu bersama AI</p>
        </div>

        {/* Notifikasi Error & Sukses */}
        {errorPesan && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-red-600 font-medium">{errorPesan}</p>
          </div>
        )}
        {suksesPesan && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="text-[#34C759] shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-emerald-700 font-medium">{suksesPesan}</p>
          </div>
        )}

        {/* Form Register */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                disabled={isLoading}
                placeholder="Cth: Ambas Saracak"
                className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#34C759] focus:bg-white text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all disabled:opacity-60"
              />
            </div>
          </div>

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
                className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#34C759] focus:bg-white text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all disabled:opacity-60"
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
                placeholder="Buat password yang kuat"
                className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#34C759] focus:bg-white text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !!suksesPesan}
            className="w-full bg-[#34C759] hover:bg-[#2eb350] text-white rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70 shadow-sm"
          >
            {isLoading ? <><Activity size={18} className="animate-spin" /> Memproses...</> : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-[#34C759] font-bold hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;