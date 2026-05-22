import { Mic, Sparkles, Video, MoreHorizontal, Plus, MessageSquare, CheckCircle2, Send } from 'lucide-react';

const TeamCanvas = () => {
  // Data array untuk merender avatar member secara dinamis
  const teamMembers = [
    { name: 'Ahmad Muzaki', initial: 'AM', bg: 'bg-blue-100 text-blue-600', status: 'online' },
    { name: 'Juliper Sitorus', initial: 'JS', bg: 'bg-emerald-100 text-emerald-600', status: 'online' },
    { name: 'Dasacak', initial: 'DC', bg: 'bg-purple-100 text-purple-600', status: 'offline' },
    { name: 'Zian', initial: 'ZN', bg: 'bg-amber-100 text-amber-600', status: 'online' },
    { name: 'Rian', initial: 'RN', bg: 'bg-rose-100 text-rose-600', status: 'online' },
  ];

  // Batas maksimal avatar yang ditampilkan sebelum menjadi "+N"
  const maxVisibleAvatars = 4;

  return (
    <div className="flex h-full gap-8 animate-in fade-in duration-500 font-sans text-slate-900">
      
      {/* === MAIN CANVAS AREA (Apple Freeform Style) === */}
      <div className="flex-1 bg-white rounded-[32px] border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative flex flex-col overflow-hidden">
        
        {/* Subtle Dot Pattern Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        ></div>

        {/* Top Header Canvas */}
        <div className="p-6 flex items-center justify-between relative z-10 border-b border-slate-100 bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">Product Sync</h2>
              <span className="flex items-center gap-1.5 mt-1 px-2.5 py-0.5 w-fit rounded-full bg-[#34C759]/10 text-[#34C759] text-[10px] font-semibold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse"></span> Live
              </span>
            </div>
          </div>
          
          {/* PERUBAHAN: Struktur Avatar Stack Baru */}
          <div className="flex items-center gap-5">
            
            {/* Susunan Avatar Melayang */}
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {teamMembers.slice(0, maxVisibleAvatars).map((member, index) => (
                  <div 
                    key={index} 
                    className={`w-9 h-9 rounded-full ${member.bg} ring-2 ring-white flex items-center justify-center text-[12px] font-bold shadow-sm relative group cursor-pointer z-${50 - index}`}
                  >
                    {member.initial}
                    {/* Status Dot */}
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-[#34C759]' : 'bg-slate-400'}`}></span>
                    
                    {/* Tooltip Hover */}
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap shadow-md z-50 pointer-events-none transition-all">
                      {member.name}
                    </div>
                  </div>
                ))}
                
                {/* Indikator +N jika melebihi batas */}
                {teamMembers.length > maxVisibleAvatars && (
                  <div className="w-9 h-9 rounded-full bg-[#F5F5F7] ring-2 ring-white flex items-center justify-center text-[11px] font-bold text-slate-500 shadow-sm relative z-0 cursor-pointer hover:bg-slate-200 transition-colors">
                    +{teamMembers.length - maxVisibleAvatars}
                  </div>
                )}
              </div>
            </div>

            {/* Pemisah dan Tombol Aksi */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-5">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0071E3]/10 text-[#0071E3] hover:bg-[#0071E3]/20 transition-colors text-[13px] font-semibold">
                <Plus size={16} strokeWidth={2.5} /> Invite
              </button>
              <button className="p-2.5 rounded-full bg-[#F5F5F7] text-slate-600 hover:bg-slate-200 transition-colors">
                <Video size={18} />
              </button>
              <button className="p-2.5 rounded-full bg-[#F5F5F7] text-slate-600 hover:bg-slate-200 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

          </div>
        </div>

        {/* Floating Canvas Nodes */}
        <div className="flex-1 relative z-10 w-full h-full">
          
          <div className="absolute top-[20%] left-[15%] w-64 bg-white/80 backdrop-blur-xl border border-black/[0.04] p-5 rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_50px_rgb(0,0,0,0.08)] transition-shadow cursor-grab">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3] font-semibold text-xs">AM</div>
              <div>
                <h4 className="text-[13px] font-semibold tracking-tight text-slate-900">Auth Flow Update</h4>
                <p className="text-[11px] text-slate-500">2 mins ago</p>
              </div>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
              API Slicing sudah selesai, butuh review dari tim frontend untuk payload JWT-nya.
            </p>
          </div>

          <svg className="absolute top-[32%] left-[38%] w-40 h-20 z-0 overflow-visible">
             <path d="M 0 10 C 60 10, 80 60, 150 60" fill="transparent" stroke="#0071E3" strokeWidth="2" strokeDasharray="4 4" className="opacity-30" />
          </svg>

          <div className="absolute top-[40%] left-[45%] w-64 bg-white/80 backdrop-blur-xl border border-black/[0.04] p-5 rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_50px_rgb(0,0,0,0.08)] transition-shadow cursor-grab ring-2 ring-[#0071E3]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-semibold text-xs">JS</div>
              <div>
                <h4 className="text-[13px] font-semibold tracking-tight text-slate-900">Design System</h4>
                <p className="text-[11px] text-slate-500">Active now</p>
              </div>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
              Sedang menyesuaikan komponen Button dan Shadow agar sesuai dengan Cupertino guidelines.
            </p>
          </div>
        </div>

        {/* Floating Input Toolbar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-20">
          <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2 rounded-full flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0071E3] hover:bg-[#0071E3]/10 transition-colors">
              <Plus size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Ketik progres hari ini atau gunakan suara..." 
              className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium text-slate-700 placeholder:text-slate-400 px-2"
            />
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0071E3] hover:bg-[#0071E3]/10 transition-colors">
              <Mic size={18} />
            </button>
            <button className="px-4 py-2 bg-[#0071E3] text-white rounded-full text-[13px] font-semibold shadow-sm hover:bg-[#005bb5] transition-colors flex items-center gap-2">
              <Sparkles size={14} /> AI
            </button>
          </div>
        </div>

      </div>

      {/* === RIGHT SIDEBAR (Widgets) === */}
      <div className="w-80 flex flex-col gap-6">
        
        {/* Team Chat Widget */}
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col h-72">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5 text-[#0071E3]">
              <MessageSquare size={18} /> 
              <span className="text-[13px] font-semibold tracking-wide uppercase">Team Chat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]"></span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">3 Online</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-hide">
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">AM</div>
              <div className="bg-[#F5F5F7] px-3.5 py-2.5 rounded-[18px] rounded-tl-sm text-[13px] text-slate-700 leading-relaxed max-w-[85%]">
                Halo tim, update UI hari ini aman ya?
              </div>
            </div>
            
            <div className="flex gap-2.5 flex-row-reverse">
              <div className="bg-[#0071E3] text-white px-3.5 py-2.5 rounded-[18px] rounded-tr-sm text-[13px] leading-relaxed max-w-[85%] shadow-sm">
                Aman! Sedang dirapikan bagian sidebarnya. 👍
              </div>
            </div>
          </div>
          
          <div className="relative mt-auto">
            <input 
              type="text" 
              placeholder="Tulis pesan..." 
              className="w-full bg-[#F5F5F7] text-[13px] text-slate-700 pl-4 pr-10 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#0071E3]/20 transition-all placeholder:text-slate-400"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0071E3] text-white rounded-full flex items-center justify-center hover:bg-[#005bb5] transition-colors shadow-sm">
              <Send size={14} className="ml-0.5" />
            </button>
          </div>
        </div>

        {/* Team Updates Widget */}
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Recent Updates</h3>
            <button className="p-1.5 rounded-full hover:bg-[#F5F5F7] text-slate-400 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                  <span className="font-semibold text-slate-900">Dasacak</span> menyelesaikan modul autentikasi JWT.
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">10 mins ago</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
                <MessageSquare size={16} />
              </div>
              <div>
                <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                  <span className="font-semibold text-slate-900">Juliper</span> meninggalkan komentar di <span className="text-[#0071E3] cursor-pointer">Design System</span>.
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