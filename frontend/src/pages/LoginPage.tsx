import { useState } from 'react';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';

// 1. Tambahkan "Colokan" (Interface) untuk menerima perintah navigasi
interface LoginPageProps {
  onLogin: () => void;
  onGoToSignup: () => void;
}

const LoginPage = ({ onLogin, onGoToSignup }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi saat tombol Masuk ditekan
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah browser me-refresh halaman
    onLogin(); // Pindah ke halaman Room
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F5F5F7] text-slate-900 font-sans selection:bg-[#0071E3]/20">
      
      <div className="w-full max-w-[420px] p-10 bg-white border border-black/[0.04] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-10">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-12 h-12 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/60 rounded-2xl flex items-center justify-center shadow-sm mb-5">
            <Zap size={24} className="text-[#0071E3] fill-[#0071E3]/20" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">Masuk ke CodeWorkZ</h1>
          <p className="text-[13px] text-slate-500 font-medium">Lanjutkan ke workspace tim Anda</p>
        </div>

        {/* Pasang handleSubmit di form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="email" placeholder="Alamat Email" className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3.5 pl-11 pr-4 rounded-[16px] outline-none transition-all text-[14px] font-medium text-slate-900 placeholder:text-slate-400" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="password" placeholder="Kata Sandi" className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3.5 pl-11 pr-4 rounded-[16px] outline-none transition-all text-[14px] font-medium text-slate-900 placeholder:text-slate-400" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="flex justify-between items-center px-1 pt-2 pb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 text-[#0071E3] focus:ring-[#0071E3]" />
              <span className="text-[13px] font-medium text-slate-500">Ingat saya</span>
            </label>
            <a href="#" className="text-[13px] font-semibold text-[#0071E3] hover:underline">Lupa sandi?</a>
          </div>

          <button type="submit" className="w-full py-3.5 bg-[#0071E3] text-white rounded-[16px] font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:bg-[#005bb5] hover:shadow-md transition-all group">
            Masuk Sekarang
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-[13px] font-medium text-slate-500 mt-8">
          Belum punya akun?{' '}
          {/* Tombol navigasi ke Signup */}
          <button onClick={onGoToSignup} className="text-[#0071E3] font-semibold hover:underline cursor-pointer">
            Daftar gratis
          </button>
        </p>
      </div>
      <p className="mt-10 text-[12px] font-medium text-slate-400">&copy; 2026 CodeWorkZ Inc. All rights reserved.</p>
    </div>
  );
};

export default LoginPage;