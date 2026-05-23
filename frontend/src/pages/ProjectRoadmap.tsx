import { useEffect, useState } from 'react';
import { AlertTriangle, Calendar, TrendingUp, Zap, Activity } from 'lucide-react';

const ProjectRoadmap = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ progress: 0, delay: 0, activeBlockers: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const [timelineDates, setTimelineDates] = useState<Date[]>([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

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
          const laporan = result.data.reverse(); 
          
          let totalTasks = 0;
          let completedTasks = 0;
          let activeBlockers = 0;

          let minDate = new Date(today);
          let maxDate = new Date(today);
          maxDate.setDate(maxDate.getDate() + 30); 

          const extractedTasks = laporan.map((lap: any, index: number) => {
            const taskName = lap.hasilAI?.currentTarget?.deskripsi || lap.teksAsli.substring(0, 30) + "...";
            const hasBlocker = lap.hasilAI?.blocker?.hasBlocker === true;

            // PERBAIKAN LOGIKA TANGGAL & STATUS:
            let startDate = new Date(lap.tanggalPembuatan);
            startDate.setHours(0,0,0,0);
            let endDate = new Date(startDate);
            
            let menggunakanTanggalAI = false;

            // 1. Coba ambil tanggal spesifik dari AI (jika tersedia)
            if (lap.hasilAI?.currentTarget?.tanggalMulai) {
              const aiStart = new Date(lap.hasilAI.currentTarget.tanggalMulai);
              if (!isNaN(aiStart.getTime())) {
                startDate = aiStart;
                startDate.setHours(0,0,0,0);
              }
            }
            
            if (lap.hasilAI?.currentTarget?.tanggalSelesai) {
              const aiEnd = new Date(lap.hasilAI.currentTarget.tanggalSelesai);
              if (!isNaN(aiEnd.getTime())) {
                endDate = aiEnd;
                endDate.setHours(0,0,0,0);
                menggunakanTanggalAI = true; // Tandai bahwa AI sukses menemukan target masa depan
              }
            }

            if (endDate < startDate) endDate = new Date(startDate);

            // 2. Tentukan status selesai yang SEBENARNYA
            const isTextDone = lap.teksAsli.toLowerCase().match(/selesai|berhasil|done/i);
            let isTrueDone = false;

            if (menggunakanTanggalAI) {
                // Jika AI merumuskan "tanggalSelesai", berarti ini target masa depan, JANGAN dipotong!
                isTrueDone = false;
            } else {
                // Jika tidak ada tanggal target, baru kita cek apakah teksnya mengindikasikan sudah selesai
                if (isTextDone) {
                    isTrueDone = true;
                    endDate = new Date(startDate); // Tugas selesai dirender 1 hari saja
                } else {
                    // Tebakan default untuk tugas reguler
                    endDate.setDate(endDate.getDate() + (hasBlocker ? 4 : 2)); 
                }
            }

            // 3. Perbarui Batas Kalender Global
            if (startDate < minDate) minDate = new Date(startDate);
            if (endDate > maxDate) maxDate = new Date(endDate);

            // 4. Perbarui Metrik Dasbor
            totalTasks++;
            if (isTrueDone) completedTasks++;
            if (hasBlocker) activeBlockers++;

            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            return {
              id: index,
              name: taskName,
              assignee: lap.nama || "Member",
              startDate: startDate,
              endDate: endDate,
              duration: duration,
              hasBlocker: hasBlocker
            };
          }).filter((t: any) => t.name && t.name.length > 5);

          // Kelonggaran 5 hari di ujung kalender
          maxDate.setDate(maxDate.getDate() + 5);

          const datesArray = [];
          let currDate = new Date(minDate);
          while (currDate <= maxDate) {
              datesArray.push(new Date(currDate));
              currDate.setDate(currDate.getDate() + 1);
          }

          setTimelineDates(datesArray);
          setTasks(extractedTasks.slice(-15));

          const calcProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
          setMetrics({ progress: calcProgress, delay: activeBlockers * 2, activeBlockers: activeBlockers });
          
        } else {
          const datesArray = [];
          let currDate = new Date(today);
          for(let i=0; i<30; i++) {
              datesArray.push(new Date(currDate));
              currDate.setDate(currDate.getDate() + 1);
          }
          setTimelineDates(datesArray);
        }
      } catch (error) {
        console.error("Gagal mengambil data roadmap:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmapData();
  }, []);

  const getTodayIndex = () => {
    return timelineDates.findIndex(d => d.getTime() === today.getTime());
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 font-sans text-slate-900 pb-8">
      
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#0071E3] mb-3">
            <TrendingUp size={18} /> <span className="text-sm font-semibold tracking-tight">Current Progress</span>
          </div>
          <div>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">{metrics.progress}%</h2>
            <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
              <div className="h-full bg-[#0071E3] rounded-full transition-all duration-1000 ease-out" style={{ width: `${metrics.progress}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#34C759] mb-3">
            <Calendar size={18} /> <span className="text-sm font-semibold tracking-tight">Timeline Span</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">
              {timelineDates.length > 0 ? `${timelineDates[0].toLocaleString('id-ID', { month: 'short' })} - ${timelineDates[timelineDates.length-1].toLocaleString('id-ID', { month: 'long', year: 'numeric' })}` : 'Memuat...'}
            </h2>
            <p className="text-[13px] font-medium text-slate-500"> </p>
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

      <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1 overflow-hidden flex flex-col min-h-[400px]">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <Activity size={32} className="animate-spin text-[#0071E3] mb-4" />
             <p className="text-sm font-medium">Menyusun Roadmap lintas bulan...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <p className="text-sm font-medium">Belum ada aktivitas di Workspace ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 custom-scrollbar flex-1 relative">
            <div className="min-w-max pb-8" style={{ display: 'grid', gridTemplateColumns: `220px repeat(${timelineDates.length}, minmax(44px, 1fr))`, gap: '6px' }}>
              
              <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-4 sticky left-0 bg-white z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                Target / Assignee
              </div>
              
              {timelineDates.map((dateObj, i) => {
                const isToday = dateObj.getTime() === today.getTime();
                const dayNum = dateObj.getDate();
                const monthName = dateObj.toLocaleString('id-ID', { month: 'short' });
                
                return (
                  <div key={i} className={`text-[12px] font-semibold text-center border-b border-slate-100 pb-3 flex flex-col items-center justify-end ${isToday ? 'text-[#0071E3]' : 'text-slate-400'}`}>
                    {isToday && <span className="text-[9px] uppercase tracking-widest mb-1 font-bold text-[#0071E3]">Hari Ini</span>}
                    <div className="text-[10px] mb-0.5 opacity-60 uppercase">{monthName}</div>
                    <div className={`${isToday ? 'w-7 h-7 bg-[#0071E3]/10 text-[#0071E3] rounded-full flex items-center justify-center font-bold' : ''}`}>
                      {dayNum}
                    </div>
                  </div>
                );
              })}

              <div className="col-span-full h-4 relative">
                {getTodayIndex() !== -1 && (
                  <div className="absolute top-0 bottom-[-500px] w-px bg-[#0071E3]/30 z-0 border-dashed border-l" 
                       style={{ left: `calc(220px + ${getTodayIndex() * 50}px + 25px)` }}>
                  </div>
                )}
              </div>

              {tasks.map((task, index) => {
                const color = colorPalettes[index % colorPalettes.length];
                
                let startIndex = timelineDates.findIndex(d => d.getTime() === task.startDate.getTime());
                let safeStartIndex = startIndex !== -1 ? startIndex : 0; 

                return (
                  <div key={task.id} className="contents group">
                    <div className="flex flex-col justify-center sticky left-0 bg-white z-10 py-3 border-r border-slate-100 pr-3 shadow-[2px_0_5px_rgba(0,0,0,0.02)] group-hover:bg-slate-50 transition-colors">
                      <h4 className="text-[13px] font-semibold tracking-tight text-slate-900 line-clamp-1" title={task.name}>{task.name}</h4>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{task.assignee}</p>
                    </div>

                    <div style={{ gridColumn: `2 / span ${safeStartIndex}` }} className="border-b border-slate-50/50"></div>
                    
                    <div 
                      style={{ gridColumn: `${safeStartIndex + 2} / span ${task.duration}` }} 
                      className={`h-9 my-auto rounded-xl flex items-center px-3 border shadow-sm transition-all cursor-pointer relative overflow-hidden z-10 ${
                        task.hasBlocker ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : `${color.bg} ${color.border} ${color.text} ${color.hover}`
                      }`}
                    >
                      {task.hasBlocker && <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)]"></div>}
                      <span className="text-[11px] font-bold z-10 truncate relative">
                        {task.startDate.getDate()} {task.startDate.toLocaleString('id-ID', { month: 'short' })} - {task.endDate.getDate()} {task.endDate.toLocaleString('id-ID', { month: 'short' })}
                      </span>
                      {task.hasBlocker && <AlertTriangle size={12} className="ml-auto z-10" />}
                    </div>

                    <div style={{ gridColumn: `${safeStartIndex + 2 + task.duration} / span ${timelineDates.length - (safeStartIndex + task.duration)}` }} className="border-b border-slate-50/50"></div>
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