import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';

interface SignUpPageProps {
  onSignup: () => void;
  onGoToLogin: () => void;
}

const SignUpPage = ({ onSignup, onGoToLogin }: SignUpPageProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(); // Langsung pindah ke halaman Room setelah daftar
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F5F5F7] text-slate-900 font-sans selection:bg-[#0071E3]/20">
      
      <div className="w-full max-w-[420px] p-10 bg-white border border-black/[0.04] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-10 my-8">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/60 rounded-2xl flex items-center justify-center shadow-sm mb-5">
            <Zap size={24} className="text-[#0071E3] fill-[#0071E3]/20" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">Buat Akun Baru</h1>
          <p className="text-[13px] text-slate-500 font-medium">Mulai kolaborasi bersama tim Anda</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <button type="button" className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-slate-200 rounded-[16px] hover:bg-slate-50 transition-colors mb-6 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[14px] font-semibold text-slate-700">Daftar dengan Google</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Atau dengan Email</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Nama Lengkap" className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3.5 pl-11 pr-4 rounded-[16px] outline-none transition-all text-[14px] font-medium text-slate-900" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="email" placeholder="Alamat Email" className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3.5 pl-11 pr-4 rounded-[16px] outline-none transition-all text-[14px] font-medium text-slate-900" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="relative pb-2">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="password" placeholder="Kata Sandi" className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3.5 pl-11 pr-4 rounded-[16px] outline-none transition-all text-[14px] font-medium text-slate-900" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="w-full py-3.5 bg-[#0071E3] text-white rounded-[16px] font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm hover:bg-[#005bb5] transition-all group">
            Buat Akun
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-[13px] font-medium text-slate-500 mt-8">
          Sudah punya akun?{' '}
          <button onClick={onGoToLogin} className="text-[#0071E3] font-semibold hover:underline cursor-pointer">
            Masuk di sini
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;