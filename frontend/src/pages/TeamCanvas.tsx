import { useState } from 'react';
import { Mic, Sparkles, Video, MoreHorizontal, Calendar, MessageSquare, CheckCircle2, CircleDashed, AlertTriangle } from 'lucide-react';

interface TeamCanvasProps {
  onJoinMeeting: () => void;
}

const TeamCanvas = ({ onJoinMeeting }: TeamCanvasProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex h-full gap-8 animate-in fade-in duration-500 font-sans text-slate-900">
      
      {/* === MAIN CANVAS AREA === */}
      <div className="flex-1 bg-white rounded-[32px] border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative flex flex-col overflow-hidden p-8">
        
        <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(#000000 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>

        {/* TOP SECTION: HEADER */}
        <div className="relative z-20 w-full mb-12">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daily Standup</h1>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34C759]/10 text-[#34C759] text-[12px] font-bold tracking-wide uppercase shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span> Live
              </span>
            </div>
            
            <div className="flex items-center gap-2 relative">
              {/* Tombol Video */}
              <button onClick={onJoinMeeting} className="p-2.5 rounded-full bg-[#F5F5F7] text-slate-600 hover:bg-slate-200 transition-all active:scale-90">
                <Video size={18} />
              </button>
              
              {/* Tombol Titik Tiga (Dropdown) */}
              <button onClick={() => setShowMenu(!showMenu)} className="p-2.5 rounded-full bg-[#F5F5F7] text-slate-600 hover:bg-slate-200 transition-all active:scale-90">
                <MoreHorizontal size={18} />
              </button>

              {/* Dropdown GitHub Melayang */}
              {showMenu && (
                <div className="absolute top-12 right-0 w-56 bg-white/95 backdrop-blur-xl border border-black/[0.04] rounded-[16px] shadow-[0_12px_40px_rgb(0,0,0,0.12)] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <button className="w-full flex items-center gap-3 p-2.5 hover:bg-[#F5F5F7] rounded-[10px] transition-colors text-left group">
        
                    <span className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">Integrasi ke GitHub Repo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-[15px] text-slate-500 font-medium mb-4">CodeWorkZ AI is listening for your updates.</p>
          <div className="flex items-center gap-2 text-[#0071E3] text-[13px] font-semibold">
            <Sparkles size={16} /> AI Auto-tagging Active
          </div>
        </div>

        {/* MIDDLE SECTION: AVATAR NODES */}
        <div className="flex-1 relative z-10 w-full h-full min-h-[300px]">
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 30 50 Q 40 35 50 50" fill="none" stroke="#34C759" strokeWidth="0.5" strokeDasharray="1 1" className="opacity-60" />
            <path d="M 50 50 Q 60 60 70 50" fill="none" stroke="#FF3B30" strokeWidth="0.5" className="opacity-40" />
          </svg>

          {/* Node: Ambas */}
          <div className="absolute top-[50%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10">
            <div className="absolute bottom-full mb-4 w-56 bg-white/90 backdrop-blur-md rounded-[20px] p-4 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-black/[0.04] opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none">
              <p className="text-[12px] font-medium text-slate-600 leading-relaxed">API Slicing sudah selesai, butuh review untuk payload JWT-nya.</p>
            </div>
            <div className="relative w-16 h-16 rounded-full bg-white border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center justify-center ring-4 ring-[#34C759]/30 hover:scale-105 transition-transform cursor-pointer">
              <div className="w-full h-full rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center font-bold text-xl tracking-tight">AM</div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                <CheckCircle2 size={14} className="text-[#34C759]" />
              </div>
            </div>
            <h4 className="mt-4 text-[15px] font-bold text-slate-900 tracking-tight">Ambas</h4>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Frontend</p>
          </div>

          {/* Node: Juliper */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10">
             <div className="absolute bottom-full mb-4 w-56 bg-white/90 backdrop-blur-md rounded-[20px] p-4 shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-black/[0.04] opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none">
              <p className="text-[12px] font-medium text-slate-600 leading-relaxed">Sedang mengintegrasikan database dengan service Auth yang baru.</p>
            </div>
            <div className="relative w-16 h-16 rounded-full bg-white border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center justify-center ring-4 ring-[#0071E3]/30 hover:scale-105 transition-transform cursor-pointer">
              <div className="w-full h-full rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-xl tracking-tight">JS</div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                <CircleDashed size={14} className="text-[#0071E3] animate-spin-slow" />
              </div>
            </div>
            <h4 className="mt-4 text-[15px] font-bold text-slate-900 tracking-tight">Juliper</h4>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Backend</p>
          </div>

          {/* Node: Dasacak */}
          <div className="absolute top-[50%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10">
            <div className="absolute bottom-full mb-5 whitespace-nowrap bg-[#FF3B30]/5 backdrop-blur-md rounded-full px-4 py-2 shadow-sm border border-[#FF3B30]/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></div>
              <span className="text-[12px] font-bold tracking-wide text-[#FF3B30]">Waiting for Assets</span>
            </div>
            <div className="relative w-16 h-16 rounded-full bg-white border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center justify-center ring-4 ring-[#FF3B30]/30 hover:scale-105 transition-transform cursor-pointer">
              <div className="w-full h-full rounded-full bg-[#FF3B30]/10 text-[#FF3B30] flex items-center justify-center font-bold text-xl tracking-tight">DC</div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                <AlertTriangle size={14} className="text-[#FF3B30]" />
              </div>
            </div>
            <h4 className="mt-4 text-[15px] font-bold text-slate-900 tracking-tight">Dasacak</h4>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Design</p>
          </div>
        </div>

        {/* BOTTOM SECTION: INPUT AI */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-20">
          <div className="w-full bg-white/90 backdrop-blur-xl border border-black/[0.04] p-2 rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.08)] flex items-center gap-3 transition-all hover:bg-white focus-within:bg-white focus-within:shadow-[0_16px_50px_rgb(0,0,0,0.1)] focus-within:border-slate-200">
            <input 
              type="text" 
              placeholder="What's your progress today? Type or hold space to speak..." 
              className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-slate-700 placeholder:text-slate-400 px-4 py-3"
            />
            <button className="p-4 rounded-[18px] bg-[#F5F5F7] text-slate-500 shadow-sm hover:text-[#0071E3] hover:bg-blue-50 transition-all active:scale-90 flex items-center justify-center">
              <Mic size={22} />
            </button>
            <button className="px-5 py-3.5 bg-[#0071E3] text-white rounded-[18px] text-[13px] font-semibold shadow-sm hover:bg-[#005bb5] transition-all active:scale-95 flex items-center gap-2 mr-1">
              <Sparkles size={16} /> AI
            </button>
          </div>
        </div>

      </div>

      {/* === RIGHT SIDEBAR === */}
      <div className="w-80 flex flex-col gap-6 h-full">
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#0071E3]/10 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center gap-3 text-[#0071E3] mb-4">
            <Calendar size={18} /> 
            <span className="text-[13px] font-semibold tracking-wide uppercase">Next Event</span>
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-1">Sprint Review</h3>
          <p className="text-[13px] text-slate-500 font-medium mb-6">Today, 14:00 PM - 15:30 PM</p>
          <button onClick={onJoinMeeting} className="w-full py-3 bg-[#F5F5F7] hover:bg-slate-200 text-slate-900 text-[13px] font-semibold rounded-[16px] transition-all active:scale-95 flex items-center justify-center gap-2">
            Join Meeting Space
          </button>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Recent Updates</h3>
            <button className="p-1.5 rounded-full hover:bg-[#F5F5F7] text-slate-400 transition-all active:scale-90">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                  <span className="font-semibold text-slate-900">Dasacak</span> menyelesaikan modul autentikasi JWT.
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">10 mins ago</span>
              </div>
            </div>
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageSquare size={14} />
              </div>
              <div>
                <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                  <span className="font-semibold text-slate-900">Juliper</span> meninggalkan komentar di <span className="text-[#0071E3] group-hover:underline">Design System</span>.
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCanvas;