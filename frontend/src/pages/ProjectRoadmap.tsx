import { useEffect, useState } from 'react';
import { AlertTriangle, Calendar, TrendingUp, Zap, Activity } from 'lucide-react';

const ProjectRoadmap = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ progress: 0, delay: 0, activeBlockers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Array angka 1-31 untuk header tanggal kalender
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Palet warna elegan ala Apple untuk balok tugas (dirotasi berdasarkan index)
  const colorPalettes = [
    { bg: 'bg-[#0071E3]/10', border: 'border-[#0071E3]/20', text: 'text-[#0071E3]', hover: 'hover:bg-[#0071E3]/20' },
    { bg: 'bg-[#34C759]/10', border: 'border-[#34C759]/20', text: 'text-[#34C759]', hover: 'hover:bg-[#34C759]/20' },
    { bg: 'bg-[#FF9500]/10', border: 'border-[#FF9500]/20', text: 'text-[#FF9500]', hover: 'hover:bg-[#FF9500]/20' },
    { bg: 'bg-[#AF52DE]/10', border: 'border-[#AF52DE]/20', text: 'text-[#AF52DE]', hover: 'hover:bg-[#AF52DE]/20' },
    { bg: 'bg-[#FF3B30]/10', border: 'border-[#FF3B30]/20', text: 'text-[#FF3B30]', hover: 'hover:bg-[#FF3B30]/20' }
  ];

  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        const dataWorkspace = localStorage.getItem('activeWorkspace');
        const workspaceId = dataWorkspace ? JSON.parse(dataWorkspace)._id : null;

        if (!workspaceId) return;

        const response = await fetch(`http://localhost:5000/api/laporan/${workspaceId}`);
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          const laporan = result.data.reverse(); // Urutkan dari yang terlama ke terbaru
          
          let totalTasks = 0;
          let completedTasks = 0;
          let activeBlockers = 0;

          // Ekstraksi data laporan menjadi format Task untuk Gantt Chart
          const extractedTasks = laporan.map((lap: any, index: number) => {
            const date = new Date(lap.tanggalPembuatan);
            const startDay = date.getDate();
            
            // Ambil nama task dari AI
            const taskName = lap.hasilAI?.currentTarget?.deskripsi || lap.teksAsli.substring(0, 30) + "...";
            const isDone = lap.teksAsli.toLowerCase().match(/selesai|berhasil|done/i);
            const hasBlocker = lap.hasilAI?.blocker?.hasBlocker === true;

            totalTasks++;
            if (isDone) completedTasks++;
            if (hasBlocker) activeBlockers++;

            // Durasi visual simulasi: jika ada blocker, task terlihat lebih panjang (lama)
            const duration = isDone ? 1 : (hasBlocker ? 4 : 3); 

            return {
              id: index,
              name: taskName,
              assignee: lap.nama || "Member",
              startDay: startDay,
              duration: duration,
              hasBlocker: hasBlocker
            };
          }).filter((t: any) => t.name && t.name.length > 5); // Hanya ambil task yang valid

          // Hindari baris terlalu banyak (maksimal 15 task terbaru untuk roadmap)
          setTasks(extractedTasks.slice(-15));

          // Kalkulasi Metrik Kartu
          const calcProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
          setMetrics({
            progress: calcProgress,
            delay: activeBlockers * 1, // Tiap 1 blocker = prediksi delay 1 hari
            activeBlockers: activeBlockers
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data roadmap:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmapData();
  }, []);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 font-sans text-slate-900 pb-8">
      
      {/* Header & Toggle */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Project Roadmap</h1>
        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-black/[0.04] shadow-sm rounded-full">
          <Zap size={16} className="text-[#0071E3] fill-[#0071E3]/20" />
          <span className="text-[13px] font-semibold text-slate-600">AI Predictive Mode</span>
          <div className="w-10 h-6 bg-[#34C759] rounded-full relative ml-2 cursor-pointer shadow-inner">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all"></div>
          </div>
        </div>
      </div>

      {/* Top 3 Cards (Dinamis dari Data AI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#0071E3] mb-3">
            <TrendingUp size={18} /> <span className="text-sm font-semibold tracking-tight">Current Progress</span>
          </div>
          <div>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">{metrics.progress}%</h2>
            <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0071E3] rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${metrics.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#34C759] mb-3">
            <Calendar size={18} /> <span className="text-sm font-semibold tracking-tight">Est. Release Date</span>
          </div>
          <div>
            {/* Dinamis mengambil akhir bulan dari bulan saat ini */}
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-1">
              30 {new Date().toLocaleString('default', { month: 'short' }).toUpperCase()}
            </h2>
            <p className="text-[13px] font-medium text-slate-500">{new Date().getFullYear()}</p>
          </div>
        </div>
        
        <div className={`bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between ${metrics.delay > 0 ? 'bg-red-50/30' : ''}`}>
          <div className={`flex items-center gap-2 mb-3 ${metrics.delay > 0 ? 'text-[#FF3B30]' : 'text-slate-400'}`}>
            <AlertTriangle size={18} /> <span className="text-sm font-semibold tracking-tight">AI Estimated Delay</span>
          </div>
          <div>
            <h2 className={`text-4xl font-semibold tracking-tight mb-1 ${metrics.delay > 0 ? 'text-[#FF3B30]' : 'text-slate-800'}`}>
              {metrics.delay > 0 ? `+${metrics.delay} Days` : 'On Track'}
            </h2>
            <p className="text-[13px] font-medium text-slate-500">
              {metrics.delay > 0 ? `Due to ${metrics.activeBlockers} active blockers` : 'No blockers detected'}
            </p>
          </div>
        </div>
      </div>

      {/* === TIMELINE VIEW (GANTT CHART DINAMIS) === */}
      <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1 overflow-hidden flex flex-col min-h-[400px]">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-6 shrink-0 uppercase">Sprint: {currentMonthName}</h3>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <Activity size={32} className="animate-spin text-[#0071E3] mb-4" />
             <p className="text-sm font-medium">Menyusun Roadmap dari log harian...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <p className="text-sm font-medium">Belum ada aktivitas di Workspace ini.</p>
             <p className="text-xs">Lakukan Daily Standup di Team Canvas untuk memunculkan Roadmap otomatis.</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 custom-scrollbar flex-1 relative">
            <div className="min-w-max pb-8" style={{ display: 'grid', gridTemplateColumns: '220px repeat(31, minmax(40px, 1fr))', gap: '8px' }}>
              
              {/* Header Angka 1-31 */}
              <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-4 sticky left-0 bg-white z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                Target / Assignee
              </div>
              {daysInMonth.map((day) => (
                <div key={day} className="text-[12px] font-semibold text-slate-400 text-center border-b border-slate-100 pb-4">
                  {day}
                </div>
              ))}

              <div className="col-span-[32] h-4"></div>

              {/* Looping Render Tugas dari Database */}
              {tasks.map((task, index) => {
                const color = colorPalettes[index % colorPalettes.length];
                // Keamanan agar bar tidak keluar jalur tanggal 31
                const maxDuration = Math.min(task.duration, 31 - task.startDay + 1); 

                return (
                  <div key={task.id} className="contents group">
                    {/* Kolom Nama Task (Kiri) */}
                    <div className="flex flex-col justify-center sticky left-0 bg-white z-10 py-3 border-r border-slate-100 pr-3 shadow-[2px_0_5px_rgba(0,0,0,0.02)] group-hover:bg-slate-50 transition-colors">
                      <h4 className="text-[13px] font-semibold tracking-tight text-slate-900 line-clamp-1" title={task.name}>
                        {task.name}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{task.assignee}</p>
                    </div>

                    {/* Rentang Tanggal Kosong Sebelum Task Mulai */}
                    <div style={{ gridColumn: `2 / span ${task.startDay - 1}` }} className="border-b border-slate-50/50"></div>
                    
                    {/* Balok Task (Gantt Bar) */}
                    <div 
                      style={{ gridColumn: `${task.startDay + 1} / span ${maxDuration}` }} 
                      className={`h-9 my-auto rounded-xl flex items-center px-3 border shadow-sm transition-all cursor-pointer relative overflow-hidden ${
                        task.hasBlocker ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : `${color.bg} ${color.border} ${color.text} ${color.hover}`
                      }`}
                    >
                      {/* Pola strip-strip kecil untuk task yang kena blocker */}
                      {task.hasBlocker && (
                        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)]"></div>
                      )}
                      
                      <span className="text-[11px] font-bold z-10 truncate relative">
                        {task.startDay} - {task.startDay + maxDuration - 1} {new Date().toLocaleString('default', { month: 'short' })}
                      </span>
                      
                      {task.hasBlocker && <AlertTriangle size={12} className="ml-auto z-10" />}
                    </div>

                    {/* Sisa Ruang Kosong Setelah Task */}
                    <div style={{ gridColumn: `${task.startDay + maxDuration + 1} / span ${31 - (task.startDay + maxDuration - 1)}` }} className="border-b border-slate-50/50"></div>
                  </div>
                );
              })}

            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProjectRoadmap;