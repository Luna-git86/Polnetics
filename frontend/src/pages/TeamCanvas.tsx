import { Mic, Sparkles, Video, MoreHorizontal, Plus, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react';

const TeamCanvas = () => {
  return (
    <div className="flex h-full gap-8 animate-in fade-in duration-500 font-sans text-slate-900">
      
      {/* === MAIN CANVAS AREA (Apple Freeform Style) === */}
      <div className="flex-1 bg-white rounded-[32px] border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative flex flex-col overflow-hidden">
        
        {/* Subtle Dot Pattern Background (Minimalist) */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        ></div>

        {/* Top Header Canvas */}
        <div className="p-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Product Sync</h2>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34C759]/10 text-[#34C759] text-[11px] font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse"></span> Live
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-xs font-semibold text-blue-600 shadow-sm z-30">AM</div>
              <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-xs font-semibold text-emerald-600 shadow-sm z-20">JS</div>
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-slate-500 shadow-sm z-10">DC</div>
            </div>
            <button className="p-2.5 rounded-full bg-[#F5F5F7] text-slate-600 hover:bg-slate-200 transition-colors">
              <Video size={18} />
            </button>
            <button className="p-2.5 rounded-full bg-[#F5F5F7] text-slate-600 hover:bg-slate-200 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Floating Canvas Nodes */}
        <div className="flex-1 relative z-10 w-full h-full">
          
          {/* Node 1 */}
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

          {/* Connection Line (SVG) */}
          <svg className="absolute top-[32%] left-[38%] w-40 h-20 z-0 overflow-visible">
             <path d="M 0 10 C 60 10, 80 60, 150 60" fill="transparent" stroke="#0071E3" strokeWidth="2" strokeDasharray="4 4" className="opacity-30" />
          </svg>

          {/* Node 2 */}
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

        {/* Floating Input Toolbar (Apple Glassmorphism Style) */}
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
        
        {/* Next Meeting Widget */}
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#0071E3]/10 to-transparent rounded-bl-full pointer-events-none"></div>
          
          <div className="flex items-center gap-3 text-[#0071E3] mb-4">
            <Calendar size={18} /> 
            <span className="text-[13px] font-semibold tracking-wide uppercase">Next Event</span>
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-1">Sprint Review</h3>
          <p className="text-[13px] text-slate-500 font-medium mb-6">Today, 14:00 PM - 15:30 PM</p>
          
          <button className="w-full py-2.5 bg-[#F5F5F7] hover:bg-slate-200 text-slate-900 text-[13px] font-semibold rounded-[12px] transition-colors flex items-center justify-center gap-2">
            Join Meeting Space
          </button>
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
            {/* Update Item */}
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

            {/* Update Item */}
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