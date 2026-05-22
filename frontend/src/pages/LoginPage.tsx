import { useState } from 'react';
import { Mail, Lock, EyeOff, ArrowRight, Zap } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white font-sans selection:bg-cyan-500/30">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-0"></div>

      {/* Logo Area */}
      <div className="flex items-center gap-2 mb-8 z-10">
        <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <Zap size={24} className="fill-white text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-200 uppercase tracking-widest">
          CodeWorkZ
        </h1>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[400px] p-10 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-[40px] shadow-2xl z-10 relative">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-slate-100 mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Sign in to continue to your dashboard</p>
        </div>

        <form className="space-y-6">
          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-[#0f172a]/80 border border-slate-700 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-slate-200 placeholder:text-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#0f172a]/80 border border-slate-700 py-4 pl-12 pr-12 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-slate-200 placeholder:text-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 cursor-pointer hover:text-slate-400" size={18} />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 px-1">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/20 outline-none cursor-pointer"
            />
            <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.98] transition-all group"
          >
            Sign In
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;