import { AlertTriangle, Calendar, TrendingUp, Zap } from 'lucide-react';

const ProjectRoadmap = () => {
  // Bikin array berisi angka 1 sampai 31 untuk header kalender
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 font-sans text-slate-900">
      
      {/* Header & Toggle */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Project Roadmap</h1>
        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-black/[0.04] shadow-sm rounded-full">
          <Zap size={16} className="text-[#0071E3] fill-[#0071E3]/20" />
          <span className="text-[13px] font-semibold text-slate-600">AI Predictive Mode</span>
          <div className="w-10 h-6 bg-[#34C759] rounded-full relative ml-2 cursor-pointer shadow-inner">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Top 3 Cards (Tetap Sama) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-[#0071E3] mb-3">
            <TrendingUp size={18} /> <span className="text-sm font-semibold tracking-tight">Current Progress</span>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">62%</h2>
          <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
            <div className="w-[62%] h-full bg-[#0071E3] rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-[#FF9500] mb-3">
            <Calendar size={18} /> <span className="text-sm font-semibold tracking-tight">Release Date</span>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-1">MAY 28</h2>
          <p className="text-[13px] font-medium text-slate-500">2026</p>
        </div>
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-[#FF3B30] mb-3">
            <AlertTriangle size={18} /> <span className="text-sm font-semibold tracking-tight">AI Estimated Delay</span>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-[#FF3B30] mb-1">-1 Day</h2>
          <p className="text-[13px] font-medium text-slate-500">Due to active blockers</p>
        </div>
      </div>

      {/* === TIMELINE VIEW (GANTT CHART 1-31 HARI) === */}
      <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1 overflow-hidden flex flex-col">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-6 shrink-0">Bulan Ini (Mei 2026)</h3>
        
        {/* Area yang bisa di-scroll ke samping */}
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          {/* Kita menggunakan CSS Grid manual: Kolom 1 lebar 200px (untuk judul), sisanya 31 kolom lebar 40px */}
          <div className="min-w-max" style={{ display: 'grid', gridTemplateColumns: '200px repeat(31, minmax(40px, 1fr))', gap: '8px' }}>
            
            {/* Header Angka 1-31 */}
            <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-4 sticky left-0 bg-white z-10">Task Name</div>
            {daysInMonth.map((day) => (
              <div key={day} className="text-[12px] font-semibold text-slate-400 text-center border-b border-slate-100 pb-4">
                {day}
              </div>
            ))}

            {/* Ruang Kosong Pemisah */}
            <div className="col-span-[32] h-4"></div>

            {/* Task 1: API Integration (Mulai tgl 4, Durasi 5 hari) */}
            <div className="flex flex-col justify-center sticky left-0 bg-white z-10 py-2 border-r border-slate-100 pr-2">
              <h4 className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-2">API Integration</h4>
              <p className="text-[11px] font-medium text-slate-500">BackEnd</p>
            </div>
            {/* gridColumn: "Mulai di kolom ke-5 (tanggal 4)" / "Habiskan 5 kolom" */}
            <div style={{ gridColumn: '5 / span 5' }} className="h-8 my-auto bg-[#FF9500]/10 border border-[#FF9500]/20 rounded-full flex items-center justify-center text-[11px] font-semibold text-[#FF9500] hover:bg-[#FF9500]/20 transition-colors cursor-pointer">
              4 Mei - 8 Mei
            </div>
            <div style={{ gridColumn: '10 / span 23' }}></div> {/* Pengisi sisa ruang */}

            {/* Task 2: Dashboard Slicing (Mulai tgl 12, Durasi 5 hari) */}
            <div className="flex flex-col justify-center sticky left-0 bg-white z-10 py-2 border-r border-slate-100 pr-2">
              <h4 className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-2">Dashboard UI</h4>
              <p className="text-[11px] font-medium text-slate-500">FrontEnd</p>
            </div>
            <div style={{ gridColumn: '13 / span 5' }} className="h-8 my-auto bg-[#34C759]/10 border border-[#34C759]/20 rounded-full flex items-center justify-center text-[11px] font-semibold text-[#34C759] hover:bg-[#34C759]/20 transition-colors cursor-pointer">
              12 Mei - 16 Mei
            </div>
            <div style={{ gridColumn: '18 / span 15' }}></div>

            {/* Task 3: User Auth (Mulai tgl 18, Durasi 7 hari) */}
            <div className="flex flex-col justify-center sticky left-0 bg-white z-10 py-2 border-r border-slate-100 pr-2">
              <h4 className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-2">User Auth</h4>
              <p className="text-[11px] font-medium text-slate-500">BackEnd</p>
            </div>
            <div style={{ gridColumn: '19 / span 7' }} className="h-8 my-auto bg-[#0071E3]/10 border border-[#0071E3]/20 rounded-full flex items-center justify-center text-[11px] font-semibold text-[#0071E3] hover:bg-[#0071E3]/20 transition-colors cursor-pointer">
              18 Mei - 24 Mei
            </div>
            <div style={{ gridColumn: '26 / span 7' }}></div>

            {/* Task 4: Design System (Mulai tgl 26, Durasi 6 hari) */}
            <div className="flex flex-col justify-center sticky left-0 bg-white z-10 py-2 border-r border-slate-100 pr-2">
              <h4 className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-2">Design System</h4>
              <p className="text-[11px] font-medium text-slate-500">Design</p>
            </div>
            <div style={{ gridColumn: '27 / span 5' }} className="h-8 my-auto bg-[#AF52DE]/10 border border-[#AF52DE]/20 rounded-full flex items-center justify-center text-[11px] font-semibold text-[#AF52DE] hover:bg-[#AF52DE]/20 transition-colors cursor-pointer">
              26 Mei - 30 Mei
            </div>
            <div style={{ gridColumn: '32 / span 1' }}></div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default ProjectRoadmap;