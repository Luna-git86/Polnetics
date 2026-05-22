import { CheckCircle2, CircleDashed, AlertTriangle, ChevronRight } from 'lucide-react';

const TeamAnalytics = () => {
  const tasks = [
    { id: 1, initials: 'JS', name: 'Juliper Saracak', time: '1 jam lalu', role: 'Backend', desc: 'Slicing API Authentication', status: 'Completed', detail: 'Auth API', color: 'bg-slate-100 text-slate-700' },
    { id: 2, initials: 'AM', name: 'Ambas', time: '1 jam lalu', role: 'Frontend', desc: 'Design Log Component', status: 'In progress', detail: 'Design Log', color: 'bg-blue-50 text-blue-600' },
    { id: 3, initials: 'DC', name: 'DasaCak', time: '2 jam lalu', role: 'Frontend', desc: 'Menunggu aset UI/UX', status: 'Blocked', detail: 'Design Log', color: 'bg-red-50 text-red-600' },
  ];

  const risks = [
    { id: 1, initials: 'SC', name: 'SaraCak', role: 'Frontend; Design', level: 'Low', badge: 'text-[#34C759] bg-[#34C759]/10' },
    { id: 2, initials: 'JC', name: 'JulCak', role: 'Designer; Web', level: 'Medium', badge: 'text-[#FF9500] bg-[#FF9500]/10' },
    { id: 3, initials: 'DC', name: 'DasaCak', role: 'Backend; API', level: 'High', badge: 'text-[#FF3B30] bg-[#FF3B30]/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans text-slate-900">
      
      {/* GRID KARTU ATAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kartu 1: Sprint Velocity (Apple Style Card) */}
        <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Sprint Velocity</h2>
            <span className="text-xs font-medium text-[#0071E3] bg-[#0071E3]/10 px-3 py-1 rounded-full">
              Siklus Aktif
            </span>
          </div>
          
          <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
            {/* SVG Donut Chart (Tipis & Elegan) */}
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path className="text-slate-100" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
              <path className="text-[#0071E3]" strokeDasharray="68, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-semibold tracking-tight text-slate-900">68%</span>
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Selesai</span>
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-auto">
            <div className="bg-[#F5F5F7] rounded-[16px] p-4 w-full text-center">
              <div className="text-xl font-semibold tracking-tight text-slate-900 mb-0.5">34</div>
              <div className="text-[11px] font-medium text-slate-500">Tugas Selesai</div>
            </div>
            <div className="bg-[#F5F5F7] rounded-[16px] p-4 w-full text-center">
              <div className="text-xl font-semibold tracking-tight text-slate-900 mb-0.5">16</div>
              <div className="text-[11px] font-medium text-slate-500">Tersisa</div>
            </div>
          </div>
        </div>

        {/* Kartu 2: Risk Assessment */}
        <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-6">Penilaian Risiko</h2>
          
          <div className="space-y-3 flex-1">
            {risks.map((risk) => (
              <div key={risk.id} className="flex items-center justify-between p-3 rounded-[16px] hover:bg-[#F5F5F7] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  {/* Avatar Lingkaran Clean */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/60 text-slate-600 shadow-sm">
                    {risk.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold tracking-tight text-slate-900">{risk.name}</h4>
                    <p className="text-[12px] text-slate-500 font-medium">{risk.role}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 text-[11px] font-semibold rounded-full ${risk.badge}`}>
                  {risk.level}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION BAWAH: PROGRESS SUMMARY */}
      <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 mb-6">Aktivitas Tim</h2>
        
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div key={task.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-[16px] hover:bg-[#F5F5F7] transition-colors cursor-pointer group">
                
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-medium text-sm border border-black/[0.05] shadow-sm ${task.color}`}>
                     {task.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-semibold tracking-tight text-slate-900">{task.name}</h4>
                      <span className="text-[11px] text-slate-400 font-medium">{task.time}</span>
                    </div>
                    <p className="text-[13px] text-slate-500">
                      <span className="font-medium text-slate-700">{task.role}</span> &mdash; {task.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full ${
                    task.status === 'Completed' ? 'text-[#34C759] bg-[#34C759]/10' : 
                    task.status === 'In progress' ? 'text-[#0071E3] bg-[#0071E3]/10' : 
                    'text-[#FF3B30] bg-[#FF3B30]/10'
                  }`}>
                    {task.status === 'Completed' && <CheckCircle2 size={14} />}
                    {task.status === 'In progress' && <CircleDashed size={14} className="animate-spin-slow" />}
                    {task.status === 'Blocked' && <AlertTriangle size={14} />}
                    <span>{task.status}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                </div>
                
              </div>
              
              {/* Garis pemisah super tipis khas iOS, tidak ada di elemen terakhir */}
              {index !== tasks.length - 1 && (
                <div className="h-px bg-slate-100 ml-[68px] my-1"></div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TeamAnalytics;