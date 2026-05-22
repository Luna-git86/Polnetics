import { Mic, Video, MonitorUp, PhoneOff, Users, MessageSquare } from 'lucide-react';

const MeetingSpace = () => {
  return (
    <div className="flex flex-col h-full min-h-[700px] bg-slate-900 rounded-[32px] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.2)] animate-in fade-in duration-500 relative">
      
      {/* Header Info */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-[11px] font-bold tracking-wide uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Rec
          </span>
          <h2 className="text-white font-semibold tracking-tight">Daily Sprint Review</h2>
        </div>
        <div className="text-white/80 font-medium text-sm">00:14:32</div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-6 pt-20 grid grid-cols-2 gap-4">
        {/* Cam 1: Ambas */}
        <div className="relative bg-slate-800 rounded-[24px] overflow-hidden border border-white/10 flex items-center justify-center group shadow-inner">
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-slate-700 to-slate-800 flex items-center justify-center text-4xl font-semibold text-slate-500 border-2 border-slate-600">AM</div>
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[13px] font-medium flex items-center gap-2">
            Ambas (You)
          </div>
        </div>
        
        {/* Cam 2: Juliper */}
        <div className="relative bg-slate-800 rounded-[24px] overflow-hidden border border-[#0071E3]/50 ring-2 ring-[#0071E3]/30 flex items-center justify-center group shadow-inner">
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center text-4xl font-semibold text-blue-500 border-2 border-blue-800">JS</div>
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[13px] font-medium flex items-center gap-2">
            Juliper <Mic size={14} className="text-[#0071E3] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-24 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-8 z-20 shrink-0">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[13px] font-medium">
            <Users size={18} /> 3 Participants
          </button>
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[13px] font-medium">
            <MessageSquare size={18} /> Chat
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-white flex items-center justify-center transition-all active:scale-90">
            <Mic size={20} />
          </button>
          <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-white flex items-center justify-center transition-all active:scale-90">
            <Video size={20} />
          </button>
          <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-[#34C759] flex items-center justify-center transition-all active:scale-90">
            <MonitorUp size={20} />
          </button>
          <button className="w-16 h-12 rounded-[16px] bg-[#FF3B30] hover:bg-red-600 text-white flex items-center justify-center transition-all active:scale-90 shadow-[0_0_15px_rgba(255,59,48,0.4)] ml-2">
            <PhoneOff size={20} />
          </button>
        </div>
        
        <div className="w-32"></div> {/* Spacer to center controls */}
      </div>
    </div>
  );
};

export default MeetingSpace;