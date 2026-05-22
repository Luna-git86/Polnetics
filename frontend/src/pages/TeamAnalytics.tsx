import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Activity, ChevronRight, Zap, Lightbulb, Clock } from 'lucide-react';

const TeamAnalytics = () => {
  // === STATE APLIKASI ===
  const [semuaLaporan, setSemuaLaporan] = useState<any[]>([]);
  const [anggotaKesusahan, setAnggotaKesusahan] = useState<any[]>([]);
  const [anggotaSelesai, setAnggotaSelesai] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // === FUNGSI MENYEDOT DATA DARI SERVER.JS ===
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/laporan');
        const result = await response.json();
        
        if (result.data) {
          const dataAsli = result.data.reverse(); // Yang terbaru di atas
          setSemuaLaporan(dataAsli);

          // === LOGIKA AI SEDERHANA (PENYORTIRAN OTOMATIS) ===
          // Memisahkan siapa yang "Stuck/Kesusahan" dan siapa yang "Aman/Selesai"
          // Berdasarkan kata kunci pada teks laporan atau hasil analisis AI
          const butuhBantuan = dataAsli.filter((lap: any) => 
            lap.teksLaporan.toLowerCase().match(/kendala|error|bug|susah|hambatan|gagal|stuck/i) || 
            (lap.hasilAnalisis && lap.hasilAnalisis.toLowerCase().match(/risiko tinggi|bantu/i))
          );

          const sudahSelesai = dataAsli.filter((lap: any) => 
            lap.teksLaporan.toLowerCase().match(/selesai|berhasil|aman|done|sukses|lancar/i) &&
            !butuhBantuan.includes(lap) // Pastikan tidak masuk daftar kesusahan
          );

          setAnggotaKesusahan(butuhBantuan);
          setAnggotaSelesai(sudahSelesai);
        }
      } catch (error) {
        console.error("Gagal terhubung ke database:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaporan();
  }, []);

  return (
    <div className="animate-in fade-in duration-300 font-sans pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0071E3]">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">AI Team Analytics</h1>
            <p className="text-sm text-slate-500">Live monitoring dari Sync Canva AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 shadow-sm">
          <Clock size={16} className="text-[#0071E3]" />
          Update Real-time
        </div>
      </div>

      {isLoading ? (
        // --- LOADING STATE ---
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Zap className="animate-pulse text-[#0071E3] mb-3" size={32} />
          <p className="text-slate-500 font-medium text-sm">AI sedang membaca database tim...</p>
        </div>
      ) : (
        <>
          {/* --- AI INSIGHT WIDGET (Rekomendasi Cerdas) --- */}
          <div className="bg-gradient-to-r from-[#0071E3] to-[#005bb5] rounded-3xl p-6 mb-8 text-white shadow-lg relative overflow-hidden">
            <Zap className="absolute right-[-20px] top-[-20px] w-48 h-48 text-white opacity-10" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Lightbulb size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">AI Executive Summary</h2>
                <p className="text-blue-100 text-sm leading-relaxed max-w-3xl">
                  {anggotaKesusahan.length > 0 
                    ? `Ada ${anggotaKesusahan.length} anggota tim yang sedang menghadapi hambatan. Segera koordinasikan bantuan untuk menjaga produktivitas Sprint hari ini.` 
                    : `Luar biasa! Tidak ada anggota tim yang melaporkan hambatan kritis hari ini. ${anggotaSelesai.length} tugas berhasil diselesaikan dengan baik.`}
                </p>
              </div>
            </div>
          </div>

          {/* --- GRID HIGHLIGHT (Kesusahan vs Selesai) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* KOTAK MERAH: Butuh Bantuan */}
            <div className="bg-white border border-red-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-red-500" />
                <h2 className="text-base font-bold text-slate-800">Needs Attention (Blocked)</h2>
                <span className="ml-auto bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {anggotaKesusahan.length} Anggota
                </span>
              </div>
              
              <div className="space-y-3">
                {anggotaKesusahan.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Semua anggota aman, tidak ada kendala.</p>
                ) : (
                  anggotaKesusahan.map((lap, i) => (
                    <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {lap.nama?.substring(0,2).toUpperCase() || 'AI'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{lap.nama}</h4>
                        <p className="text-xs text-red-600 mt-0.5 line-clamp-2">{lap.teksLaporan}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* KOTAK HIJAU: Sudah Selesai */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={20} className="text-[#34C759]" />
                <h2 className="text-base font-bold text-slate-800">Completed (On Track)</h2>
                <span className="ml-auto bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {anggotaSelesai.length} Tugas
                </span>
              </div>
              
              <div className="space-y-3">
                {anggotaSelesai.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Belum ada tugas yang dilaporkan selesai.</p>
                ) : (
                  anggotaSelesai.map((lap, i) => (
                    <div key={i} className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                        {lap.nama?.substring(0,2).toUpperCase() || 'AI'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{lap.nama}</h4>
                        <p className="text-xs text-emerald-700 mt-0.5 line-clamp-2">{lap.teksLaporan}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* --- LOG LAPORAN LENGKAP --- */}
          <h2 className="text-lg font-bold text-slate-800 mb-4">Semua Log Laporan Hari Ini</h2>
          <div className="bg-white border border-slate-200 rounded-3xl p-2 shadow-sm">
            {semuaLaporan.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">Data laporan kosong.</div>
            ) : (
              semuaLaporan.map((laporan, index) => (
                <div key={index} className="group flex items-start justify-between p-4 hover:bg-[#F5F5F7] rounded-2xl transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0 mt-1">
                      {laporan.nama ? laporan.nama.substring(0, 2).toUpperCase() : 'AI'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-slate-800">{laporan.nama}</h4>
                        <span className="text-[11px] text-slate-400">
                          {laporan.createdAt ? new Date(laporan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hari ini'}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-600 leading-relaxed max-w-3xl mb-2">{laporan.teksLaporan}</p>
                      
                      {laporan.hasilAnalisis && (
                        <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl inline-block mt-1">
                          <p className="text-[12px] text-slate-700 leading-relaxed flex items-start gap-2">
                            <Zap size={14} className="text-[#0071E3] shrink-0 mt-0.5" />
                            <span><span className="font-bold text-[#0071E3]">Analisis AI:</span> {laporan.hasilAnalisis.replace('(DUMMY MODE)', '').trim()}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#0071E3] mt-2 transition-colors" />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamAnalytics;