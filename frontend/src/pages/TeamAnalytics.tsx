import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Zap, AlertTriangle, TrendingUp, Activity, CheckCircle2, CircleDashed, Clock, LineChart as ChartIcon } from "lucide-react";
import { io } from "socket.io-client";

// === KOMPONEN BARU: Tooltip Kustom Agar Mudah Dimengerti Orang Awam ===
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl text-xs min-w-[220px] animate-in zoom-in-95 duration-200">
        <div className="mb-3 border-b border-slate-100 pb-2">
          <p className="font-bold text-slate-800 text-[14px]">{data.namaLengkap}</p>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Clock size={12} /> {data.waktuPenuh}
          </p>
        </div>
        <div className="space-y-2.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <span style={{ color: entry.color }} className="font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                {entry.name}
              </span>
              <span className="font-bold text-slate-800 text-[13px]">
                {entry.value}{entry.name === 'Kecepatan' ? ' pts' : '%'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const TeamAnalytics = () => {
  const [dataGrafik, setDataGrafik] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskSummary, setRiskSummary] = useState({ fatigue: 0, velocity: 0, motivation: 0, hasBlocker: false });
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);

  useEffect(() => {
    const ambilDataLaporan = async () => {
      try {
        const dataWorkspaceRaw = localStorage.getItem('activeWorkspace');
        const workspaceIdAktif = dataWorkspaceRaw ? JSON.parse(dataWorkspaceRaw)._id : null;
        
        if (!workspaceIdAktif) {
          setLoading(false);
          return;
        }

        const url = `http://localhost:5000/api/laporan/${workspaceIdAktif}`;
        const response = await fetch(url, { cache: 'no-store' });
        const hasil = await response.json();

        if (response.ok && hasil.data) {
          if (hasil.data.length > 0) {
            
            // 1. PERBAIKAN FORMAT GRAFIK (NAMA + TANGGAL)
            const formatDataGrafik = hasil.data.map((item: any) => {
              // Olah tanggal agar ramah dibaca
              const tgl = item.tanggalPembuatan ? new Date(item.tanggalPembuatan) : new Date();
              const formatTanggal = tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
              const formatJam = tgl.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
              
              // Ambil nama depan saja untuk sumbu X agar tidak kepanjangan
              const namaDepan = item.nama ? item.nama.split(' ')[0] : 'Tim';

              return {
                labelSumbuX: `${namaDepan} (${formatTanggal})`, // Tampil di grafik: "Wicak (23 Mei)"
                namaLengkap: item.nama || 'Anonim',
                waktuPenuh: `${formatTanggal}, ${formatJam} WITA`, // Tampil di hover box
                velocity: item.hasilAI?.metrics?.velocity || 50,
                fatigue: item.hasilAI?.metrics?.fatigue || 30,
                motivation: item.hasilAI?.metrics?.motivation || 70,
              };
            }).reverse(); // Dibalik agar urut dari waktu terlama (kiri) ke terbaru (kanan)
            
            setDataGrafik(formatDataGrafik);

            // 2. SET KARTU RINGKASAN EVALUASI AI
            const laporanTerakhir = hasil.data[0];
            setRiskSummary({
              fatigue: laporanTerakhir.hasilAI?.metrics?.fatigue || 0,
              velocity: laporanTerakhir.hasilAI?.metrics?.velocity || 0,
              motivation: laporanTerakhir.hasilAI?.metrics?.motivation || 0,
              hasBlocker: laporanTerakhir.hasilAI?.blocker?.hasBlocker || false
            });

            // 3. LOGIKA MAGIC SPRINT BOARD
            const aktif: any[] = [];
            const selesai: any[] = [];

            hasil.data.forEach((item: any) => {
              const ai = item.hasilAI;
              if (!ai) return;

              if (ai.pastProgress?.deskripsi && ai.pastProgress.deskripsi.toLowerCase() !== "tidak ada") {
                selesai.push({
                  id: `${item._id}-done`,
                  nama: item.nama || "Anonim",
                  role: item.role || "developer", 
                  deskripsi: ai.pastProgress.deskripsi,
                  tanggal: item.tanggalPembuatan ? new Date(item.tanggalPembuatan).toLocaleDateString('id-ID') : "Baru saja"
                });
              }

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
          } else {
            // 4. KONDISI KOSONG
            setDataGrafik([]);
            setRiskSummary({ fatigue: 0, velocity: 0, motivation: 0, hasBlocker: false });
            setActiveTasks([]);
            setCompletedTasks([]);
          }
        }
      } catch (error) {
        console.error("Gagal memuat sistem analitik papan:", error);
      } finally {
        setLoading(false);
      }
    };

    ambilDataLaporan();

    const socket = io('http://localhost:5000');
    socket.on('laporan-baru', () => {
      ambilDataLaporan();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">Menghubungkan ke AI Engine Proyek... ⏳</div>;
  }

  const isWorkspaceBaru = dataGrafik.length === 0;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* --- Barisan Kartu Metrik --- */}
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
            <span className={`text-xs font-semibold ${isWorkspaceBaru ? 'text-slate-400' : (riskSummary.fatigue > 60 ? 'text-red-600' : 'text-green-600')}`}>
              {isWorkspaceBaru ? "Belum ada data" : (riskSummary.fatigue > 60 ? "⚠️ Risiko Tinggi" : "✓ Aman")}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-500">Team Velocity</span>
            <div className={`p-2 rounded-lg ${isWorkspaceBaru ? 'bg-slate-50 text-slate-400' : 'bg-cyan-50 text-[#0071E3]'}`}>
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
            <div className={`p-2 rounded-lg ${isWorkspaceBaru ? 'bg-slate-50 text-slate-400' : (riskSummary.hasBlocker ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600')}`}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {isWorkspaceBaru ? "Standby" : (riskSummary.hasBlocker ? "Ada Hambatan" : "Lancar Jaya")}
            </span>
          </div>
        </div>
      </div>

      {/* --- Panel Grafik Tren AI --- */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-xs">
        <div className="mb-8">
          <p className="text-slate-500 text-[20px] mt-1">
            Pelacakan algoritma metrik kelelahan (Fatigue), motivasi, dan kecepatan rilis tim berdasarkan bahasa alami.
          </p>
        </div>
        
        <div className="h-[340px] w-full relative">
          {!isWorkspaceBaru ? (
            <ResponsiveContainer width="100%" height="100%">
              {/* Tambahkan margin khusus agar garis tidak menabrak batas kiri-kanan container */}
              <LineChart data={dataGrafik} margin={{ top: 10, right: 30, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                
                {/* Sumbu X kini menggunakan labelSumbuX (Nama + Tanggal) dengan padding agar ke tengah */}
                <XAxis 
                  dataKey="labelSumbuX" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={600}
                  tickLine={false} 
                  axisLine={false}
                  dy={10} // Jarak teks dengan garis
                  padding={{ left: 40, right: 40 }} 
                />
                
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  fontWeight={500}
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 100]} 
                  dx={-10}
                />
                
                {/* Ganti Tooltip bawaan Recharts dengan CustomTooltip milik kita */}
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }} />
                
                <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#475569' }} />
                
                {/* Pengaturan Line dibuat lebih tebal dan mulus */}
                <Line type="monotone" dataKey="velocity" stroke="#0071E3" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Kecepatan" />
                <Line type="monotone" dataKey="fatigue" stroke="#FF3B30" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Risiko Burnout" />
                <Line type="monotone" dataKey="motivation" stroke="#34C759" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3 }} activeDot={{ r: 5 }} name="Motivasi" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center mb-4">
                <ChartIcon size={28} className="text-[#0071E3]/40" />
              </div>
              <h4 className="text-sm font-bold text-slate-600 mb-1">Visualisasi Belum Tersedia</h4>
              <p className="text-[13px] text-slate-400 max-w-xs text-center leading-relaxed">
                Grafik akan terbentuk secara otomatis untuk memetakan sentimen tim setelah laporan standup pertama dikirim.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- Papan Kanban --- */}
      {/* ... (Sisa kode Kanban tidak berubah, biarkan tetap sama seperti sebelumnya) ... */}
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
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 min-h-[250px]">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
              <CircleDashed size={16} className="text-[#0071E3]" /> Target Hari Ini (Active Sprint)
            </h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {activeTasks.length > 0 ? activeTasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-[#0071E3]/30 transition-colors">
                  <p className="text-sm font-medium text-slate-800 leading-snug">{task.deskripsi}</p>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
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
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <p className="text-xs text-slate-400 font-medium">Belum ada target penugasan aktif.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 min-h-[250px]">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
              <CheckCircle2 size={16} className="text-[#34C759]" /> Selesai Dikerjakan (Done)
            </h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <p className="text-xs text-slate-400 font-medium">Belum ada pencapaian tugas yang terekstraksi.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics;