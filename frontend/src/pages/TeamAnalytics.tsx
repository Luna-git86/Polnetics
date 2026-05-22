import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Zap, AlertTriangle, TrendingUp, Activity, CheckCircle2, CircleDashed, Clock} from "lucide-react";

const TeamAnalytics = () => {
  const [dataGrafik, setDataGrafik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskSummary, setRiskSummary] = useState({ fatigue: 0, velocity: 0, motivation: 0, hasBlocker: false });
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);

  useEffect(() => {
    const ambilDataLaporan = async () => {
      try {
        const idWorkspaceAktif = localStorage.getItem('activeWorkspace');
        
        // Saring data laporan murni untuk ruang kerja/workspace yang sedang dibuka saja
        const url = idWorkspaceAktif 
          ? `http://localhost:5000/api/laporan?workspaceId=${idWorkspaceAktif}`
          : "http://localhost:5000/api/laporan";

        const response = await fetch(url);
        const hasil = await response.json();

        if (response.ok && hasil.data && hasil.data.length > 0) {
          // 1. FORMAT DATA GRAFIK ANALISIS RISIKO
          const formatDataGrafik = hasil.data.map((item: any, indeks: number) => ({
            name: item.nama || `Tim ${indeks + 1}`,
            velocity: item.hasilAI?.metrics?.velocity || 50,
            fatigue: item.hasilAI?.metrics?.fatigue || 30,
            motivation: item.hasilAI?.metrics?.motivation || 70,
          })).reverse();
          setDataGrafik(formatDataGrafik);

          // 2. SET KARTU RINGKASAN EVALUASI AI
          const laporanTerakhir = hasil.data[0];
          setRiskSummary({
            fatigue: laporanTerakhir.hasilAI?.metrics?.fatigue || 0,
            velocity: laporanTerakhir.hasilAI?.metrics?.velocity || 0,
            motivation: laporanTerakhir.hasilAI?.metrics?.motivation || 0,
            hasBlocker: laporanTerakhir.hasilAI?.blocker?.hasBlocker || false
          });

          // 3. LOGIKA MAGIC SPRINT BOARD (Intent-Based UI)
          const aktif: any[] = [];
          const selesai: any[] = [];

          hasil.data.forEach((item: any) => {
            const ai = item.hasilAI;
            if (!ai) return;

            // Jika AI mendeteksi ada pekerjaan masa lalu yang berstatus "done"
            if (ai.pastProgress?.deskripsi && ai.pastProgress.deskripsi.toLowerCase() !== "tidak ada") {
              selesai.push({
                id: `${item._id}-done`,
                nama: item.nama || "Anonim",
                role: item.role || "developer", // Menangkap peran divisi seperti backend/frontend
                deskripsi: ai.pastProgress.deskripsi,
                tanggal: item.tanggalPembuatan ? new Date(item.tanggalPembuatan).toLocaleDateString('id-ID') : "Baru saja"
              });
            }

            // Jika AI mendeteksi ada inisiasi tugas baru/target hari ini dari ucapan pemimpin/member
            if (ai.currentTarget?.deskripsi && ai.currentTarget.deskripsi.toLowerCase() !== "tidak ada") {
              aktif.push({
                id: `${item._id}-active`,
                nama: item.nama || "Anonim",
                role: item.role || "developer",
                deskripsi: ai.currentTarget.deskripsi,
                tanggal: item.tanggalPembuatan ? new Date(item.tanggalPembuatan).toLocaleDateString('id-ID') : "Hari ini"
              });
            }
          });

          setActiveTasks(aktif);
          setCompletedTasks(selesai);
        }
      } catch (error) {
        console.error("Gagal memuat sistem analitik papan:", error);
      } finally {
        setLoading(false);
      }
    };

    ambilDataLaporan();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">Menghubungkan ke AI Engine Proyek... ⏳</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Barisan Kartu Metrik Resiko */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Burnout Risk (Fatigue)</span>
            <div className={`p-2 rounded-lg ${riskSummary.fatigue > 60 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
              <Activity size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{riskSummary.fatigue}%</span>
            <span className={`text-xs font-semibold ${riskSummary.fatigue > 60 ? 'text-red-600' : 'text-green-600'}`}>
              {riskSummary.fatigue > 60 ? "⚠️ Risiko Tinggi" : "✓ Aman"}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Team Velocity</span>
            <div className="p-2 rounded-lg bg-cyan-50 text-[#0071E3]">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{riskSummary.velocity} pts</span>
            <span className="text-xs text-slate-500 font-medium">Produktifitas</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Blocker Status</span>
            <div className={`p-2 rounded-lg ${riskSummary.hasBlocker ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {riskSummary.hasBlocker ? "Ada Hambatan" : "Lancar Jaya"}
            </span>
          </div>
        </div>
      </div>

      {/* Panel Grafik Tren */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-xs">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Zap size={18} className="text-[#0071E3] fill-[#0071E3]" />
            AI Agile Risk Analytics
          </h3>
          <p className="text-slate-500 text-xs mt-1">Grafik dekonstruksi metrik kelelahan dan produktifitas tim.</p>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataGrafik} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line type="monotone" dataKey="velocity" stroke="#0071E3" strokeWidth={3} name="Kecepatan" />
              <Line type="monotone" dataKey="fatigue" stroke="#FF3B30" strokeWidth={3} name="Risiko Burnout" />
              <Line type="monotone" dataKey="motivation" stroke="#34C759" strokeWidth={2} strokeDasharray="4 4" name="Motivasi" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Papan Kanban Otomatis Intent-Based UI */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Magic Sprint Board</h3>
            <p className="text-slate-500 text-sm mt-1">Sistem papan manajemen tugas ter-update otomatis murni dari ucapan lisan tim.</p>
          </div>
          <span className="px-3 py-1 bg-[#0071E3]/10 text-[#0071E3] text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
            <Zap size={12} className="fill-[#0071E3]"/> AI Orkestrasi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Kolom 1: Active Tasks (Target Hari Ini) */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
              <CircleDashed size={16} className="text-[#0071E3]" />
              Target Hari Ini (Active Sprint)
            </h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {activeTasks.length > 0 ? activeTasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-[#0071E3]/30 transition-colors">
                  <p className="text-sm font-medium text-slate-800 leading-snug">{task.deskripsi}</p>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      {/* Pelindung Crash Aman: Dipastikan nama aman dari crash charAt */}
                      <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[9px] text-[#0071E3] border border-slate-200 font-bold">
                        {(task.nama || "A").charAt(0).toUpperCase()}
                      </div> 
                      <span className="text-slate-700">{task.nama}</span>
                      <span className="text-slate-400 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono uppercase">({task.role})</span>
                    </span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {task.tanggal}</span>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-slate-400 text-center py-10">Belum ada target penugasan linguistik aktif.</p>
              )}
            </div>
          </div>

          {/* Kolom 2: Completed Tasks (Tugas Selesai) */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
              <CheckCircle2 size={16} className="text-[#34C759]" />
              Selesai Dikerjakan (Done)
            </h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {completedTasks.length > 0 ? completedTasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-xl border border-green-100 shadow-xs relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#34C759]"></div>
                  <p className="text-sm font-medium text-slate-500 leading-snug line-through opacity-70">{task.deskripsi}</p>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center text-[9px] text-[#34C759] border border-green-100 font-bold">
                        {(task.nama || "A").charAt(0).toUpperCase()}
                      </div> 
                      <span className="text-slate-600">{task.nama}</span>
                      <span className="text-slate-400 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono uppercase">({task.role})</span>
                    </span>
                    <span className="flex items-center gap-1 text-[#34C759] bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-bold"><CheckCircle2 size={10} /> Selesai</span>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-slate-400 text-center py-10">Belum ada pencapaian tugas yang terekstraksi.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics;