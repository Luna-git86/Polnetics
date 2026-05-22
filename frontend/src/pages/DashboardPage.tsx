import { MessageSquare, Bell, Mic, Zap, AlertTriangle, CheckCircle, LayoutGrid, BarChart2, ArrowUpRight } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-white font-sans overflow-hidden">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-[280px] bg-[#111624] border-r border-slate-800/50 flex flex-col z-20">
        
        {/* Profile Area */}
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-4 mt-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              AM
            </div>
            {/* Online Badge */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#111624] rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight tracking-wide">Ambas</h3>
            <p className="text-slate-400 text-xs">Lead Engineer</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 flex flex-col gap-2 mt-4">
          <NavItem icon={<LayoutGrid size={18} />} label="Team Canvas" active />
          <NavItem icon={<BarChart2 size={18} />} label="Analytics" />
          <NavItem icon={<LayoutGrid size={18} />} label="Team Canvas" />
          <NavItem icon={<LayoutGrid size={18} />} label="Team Canvas" />
        </div>
      </div>


      {/* ================= MAIN CONTENT (TENGAH) ================= */}
      <div className="flex-1 relative flex flex-col">
        
        {/* Latar Belakang Garis Kotak-kotak (Grid Pattern) */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>

        <div className="relative z-10 p-10 flex flex-col h-full">
          
          {/* Header */}
          <div className="mb-8 mt-4">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold tracking-wide">Daily Standup</h1>
              <span className="px-3 py-1 bg-slate-800/80 border border-slate-600 rounded-full text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                LIVE
              </span>
            </div>
            <p className="text-slate-400 text-sm">Sync Canva AI is listening for your updates</p>
          </div>

          {/* Search/Voice Input */}
          <div className="relative w-full max-w-3xl mb-4">
            <input 
              type="text" 
              placeholder="What's your progress today? Type or hold space to speak..."
              className="w-full bg-[#181F32] border border-slate-700/50 py-4 pl-6 pr-14 rounded-xl outline-none focus:border-cyan-500/50 text-slate-200 placeholder:text-slate-500 shadow-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#252D43] rounded-lg text-slate-400 hover:text-cyan-400 transition-colors">
              <Mic size={18} />
            </button>
          </div>

          {/* AI Badge */}
          <div className="flex items-center gap-2 text-cyan-400 font-medium mb-24 text-sm">
            <Zap size={16} className="fill-cyan-400" />
            <span>Ai Driven Mas Amba</span>
          </div>

          {/* Canvas Node Graph (Grafik Lingkaran di Tengah) */}
          <div className="flex items-center flex-1 max-w-2xl pl-10">
            <div className="flex items-center w-full justify-start">
              {/* Node 1 */}
              <NodeAvatar img="https://i.pravatar.cc/150?img=11" />
              
              {/* Garis Putus-putus */}
              <div className="h-[2px] w-20 border-b-2 border-dashed border-cyan-700/60 -ml-2 -mr-2 z-0"></div>
              
              {/* Node 2 (Aktif) */}
              <NodeAvatar img="https://i.pravatar.cc/150?img=11" active />
              
              {/* Garis Merah Melengkung */}
              <div className="h-6 w-24 border-b-2 border-red-500/60 rounded-b-full -ml-2 -mr-2 z-0 mt-4 shadow-[0_10px_10px_rgba(239,68,68,0.2)]"></div>
              
              {/* Node 3 */}
              <NodeAvatar img="https://i.pravatar.cc/150?img=11" />
            </div>
          </div>
        </div>
      </div>


      {/* ================= RIGHT SIDEBAR ================= */}
      <div className="w-[340px] bg-[#0B0F19] p-8 flex flex-col z-20">
        
        {/* Top Icons */}
        <div className="flex justify-end gap-6 mb-16 text-slate-300 mt-2">
          <MessageSquare className="cursor-pointer hover:text-white transition" size={22} />
          <Bell className="cursor-pointer hover:text-white transition" size={22} />
        </div>

        {/* Estimate Alert Card */}
        <div className="bg-[#1A0B11] border border-red-900/50 rounded-[2rem] py-10 px-6 flex flex-col items-center justify-center gap-2 mb-12 relative overflow-hidden group">
           {/* Red inner glow */}
          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(220,38,38,0.15)] rounded-[2rem]"></div>
          
          <h3 className="text-slate-200 text-lg z-10">Estimate Day</h3>
          <div className="relative z-10 mt-2 flex flex-col items-center">
            {/* Segitiga Peringatan di Belakang Teks */}
            <AlertTriangle size={80} strokeWidth={1.5} className="text-red-600/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <span className="text-4xl font-bold text-white relative z-10">-1 Day</span>
          </div>
        </div>

        {/* Completed Task Section */}
        <div className="flex items-center gap-3 mb-6 mt-4">
          <CheckCircle size={20} className="text-green-500" />
          <h3 className="text-lg font-medium text-slate-200">Completed Task</h3>
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-4">
          <TaskCard title="BackEnd" />
          <TaskCard title="FrontEnd" />
          <TaskCard title="Design" />
        </div>
      </div>
      
    </div>
  );
};

// --- KOMPONEN KECIL (Ditaruh di file yang sama agar rapi) ---

const NavItem = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-4 p-3.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#1C2333] text-white shadow-md' : 'text-slate-400 hover:bg-[#1C2333]/50 hover:text-slate-200'}`}>
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const NodeAvatar = ({ img, active = false }: any) => (
  <div className={`relative z-10 p-1 rounded-full ${active ? 'bg-linear-to-b from-cyan-400 to-blue-600 shadow-[0_0_25px_rgba(6,182,212,0.5)]' : 'border border-cyan-600/50 bg-[#0B0F19]'}`}>
    <img src={img} alt="Node" className="w-16 h-16 rounded-full object-cover border-[3px] border-[#0B0F19]" />
  </div>
);

const TaskCard = ({ title }: any) => (
  <div className="flex items-center justify-between p-4 rounded-2xl border border-cyan-800/40 bg-[#111726] shadow-[0_0_15px_rgba(6,182,212,0.03)] hover:border-cyan-500/50 transition-colors cursor-pointer group">
    <span className="font-medium text-slate-300 text-sm">{title}</span>
    <span className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-slate-300 border border-slate-600 rounded-full group-hover:border-green-500 group-hover:text-green-400 transition-colors">
      Finish <ArrowUpRight size={12} />
    </span>
  </div>
);

export default DashboardPage;