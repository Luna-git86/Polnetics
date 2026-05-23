import { useState, useEffect } from 'react';
import { Mic, Sparkles, Video, MoreHorizontal, CheckCircle2, CircleDashed, AlertTriangle, GitBranch, UserCircle2, Zap } from 'lucide-react';
import { io } from 'socket.io-client';

interface TeamCanvasProps {
  onJoinMeeting?: () => void;
}

const TeamCanvas = ({ onJoinMeeting }: TeamCanvasProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  
  // === STATE LOGIC (DRAFT & VOICE) ===
  const [teksLaporan, setTeksLaporan] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [bahasa, setBahasa] = useState("id-ID"); 
  const [pesanError, setPesanError] = useState("");

  // === STATE LOG AKTIVITAS & LAPORAN ===
  const [aktivitasGit, setAktivitasGit] = useState<any[]>([]);
  const [laporanTim, setLaporanTim] = useState<any[]>([]);

  // === AMBIL DATA & DENGARKAN PERUBAHAN SECARA REAL-TIME ===
  useEffect(() => {
    const dataWorkspaceRaw = localStorage.getItem('activeWorkspace');
    let workspaceIdAktif = null;

    if (dataWorkspaceRaw) {
      const workspaceObj = JSON.parse(dataWorkspaceRaw);
      workspaceIdAktif = workspaceObj._id; 

      if (workspaceObj.anggota && Array.isArray(workspaceObj.anggota)) {
        setMembers(workspaceObj.anggota);
      }
    }

    const riwayatGitTersimpan = localStorage.getItem('git_history');
    if (riwayatGitTersimpan) {
      setAktivitasGit(JSON.parse(riwayatGitTersimpan));
    }

    const fetchLaporanTim = async () => {
      if (!workspaceIdAktif) return;
      try {
        const response = await fetch(`http://localhost:5000/api/laporan/${workspaceIdAktif}`, { cache: 'no-store' });
        const result = await response.json();
        if (result.status === 'sukses') {
          setLaporanTim(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil histori laporan:", error);
      }
    };

    fetchLaporanTim();

   const socket = io('http://localhost:5000');

    socket.on('workspace-updated', (updatedWorkspace: any) => {
      if (workspaceIdAktif && updatedWorkspace._id === workspaceIdAktif) {
        setMembers(updatedWorkspace.anggota);
        localStorage.setItem('activeWorkspace', JSON.stringify(updatedWorkspace));
      }
    });

    socket.on('git-activity', (aktivitasBaru: any) => {
      setAktivitasGit((prev) => {
        const dataBaru = [aktivitasBaru, ...prev].slice(0, 5); 
        localStorage.setItem('git_history', JSON.stringify(dataBaru));
        return dataBaru;
      });
    });

    socket.on('laporan-baru', () => {
      fetchLaporanTim();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const hitungPosisiNode = (index: number, total: number) => {
    const startX = total === 1 ? 50 : 20;
    const endX = total === 1 ? 50 : 80;
    const step = total > 1 ? (endX - startX) / (total - 1) : 0;
    const x = startX + (step * index);
    
    const y = total === 1 ? 50 : (index % 2 === 0 ? 40 : 60);
    return { x, y };
  };

  const visualStyles = [
    { color: '#34C759', bg: 'bg-[#34C759]/10', text: 'text-[#34C759]', ring: 'ring-[#34C759]/30', icon: <CheckCircle2 size={14} className="text-[#34C759]" /> },
    { color: '#0071E3', bg: 'bg-[#0071E3]/10', text: 'text-[#0071E3]', ring: 'ring-[#0071E3]/30', icon: <CircleDashed size={14} className="text-[#0071E3] animate-spin-slow" /> },
    { color: '#AF52DE', bg: 'bg-[#AF52DE]/10', text: 'text-[#AF52DE]', ring: 'ring-[#AF52DE]/30', icon: <Sparkles size={14} className="text-[#AF52DE]" /> },
    { color: '#FF9500', bg: 'bg-[#FF9500]/10', text: 'text-[#FF9500]', ring: 'ring-[#FF9500]/30', icon: <Zap size={14} className="text-[#FF9500]" /> },
    { color: '#FF3B30', bg: 'bg-[#FF3B30]/10', text: 'text-[#FF3B30]', ring: 'ring-[#FF3B30]/30', icon: <AlertTriangle size={14} className="text-[#FF3B30]" /> }
  ];

  const mulaiRekam = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser belum mendukung Voice-to-Text.");

    const recognition = new SpeechRecognition();
    recognition.lang = bahasa; 
    recognition.continuous = false;
    recognition.interimResults = true;

    const teksSebelumnya = teksLaporan ? teksLaporan + " " : "";

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = (e: any) => { setIsListening(false); console.error(e.error); };
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      setTeksLaporan(teksSebelumnya + event.results[0][0].transcript);
      if (event.results[0].isFinal) setIsListening(false);
    };

    recognition.start();
  };

  const kirimLaporan = async () => {
    if (!teksLaporan) return alert("Laporan kosong!");

    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    const workspaceObj = JSON.parse(localStorage.getItem('activeWorkspace') || '{}');

    if (!workspaceObj._id) return alert("Workspace ID tidak ditemukan!");

    try {
      setIsSending(true);
     const response = await fetch("http://localhost:5000/api/laporan",  {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nama: userObj.nama || "Member", 
          teksLaporan: teksLaporan,
          workspaceId: workspaceObj._id, 
          role: userObj.role || "frontend" 
        }),
      });

      if (response.ok) setTeksLaporan(''); 
      else setPesanError((await response.json()).pesan || "Gagal memproses AI");
    } catch (error) {
      setPesanError("Gagal menghubungi Backend.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full gap-8 animate-in fade-in duration-500 font-sans text-slate-900">
      {/* KANVAS UTAMA */}
      <div className="flex-1 bg-white rounded-[32px] border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative flex flex-col overflow-hidden p-8">
        <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(#000000 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>

        <div className="relative z-20 w-full mb-12">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daily Standup</h1>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34C759]/10 text-[#34C759] text-[12px] font-bold tracking-wide uppercase shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span> Live
              </span>
            </div>
            
            <div className="flex items-center gap-2 relative">
              <button onClick={onJoinMeeting} className="p-2.5 rounded-full bg-[#F5F5F7] text-slate-600 hover:bg-slate-200 transition-all active:scale-90"><Video size={18} /></button>
              <button onClick={() => setShowMenu(!showMenu)} className="p-2.5 rounded-full bg-[#F5F5F7] text-slate-600 hover:bg-slate-200 transition-all active:scale-90"><MoreHorizontal size={18} /></button>
            </div>
          </div>
          {pesanError && <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">{pesanError}</div>}
        </div>

        <div className="flex-1 relative z-10 w-full h-full min-h-[300px]">
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            {members.map((_, i) => {
              if (i === members.length - 1) return null; 
              const pos1 = hitungPosisiNode(i, members.length);
              const pos2 = hitungPosisiNode(i + 1, members.length);
              const style = visualStyles[i % visualStyles.length];
              return <path key={`line-${i}`} d={`M ${pos1.x} ${pos1.y} Q ${(pos1.x + pos2.x) / 2} 50 ${pos2.x} ${pos2.y}`} fill="none" stroke={style.color} strokeWidth="0.3" strokeDasharray="1 1" className="opacity-50" />;
            })}
          </svg>

          {members.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-sm">Sedang memuat data tim...</div>
          ) : (
            members.map((member, i) => {
              const pos = hitungPosisiNode(i, members.length);
              const style = visualStyles[i % visualStyles.length];
              
              const historiUser = laporanTim.find(lap => lap.nama === member.nama);
              
              return (
                <div key={`node-${i}`} className="absolute flex flex-col items-center group z-10" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}>
                  
                  <div className="absolute bottom-full mb-4 w-72 bg-white/95 backdrop-blur-md rounded-[20px] p-5 shadow-[0_16px_50px_rgb(0,0,0,0.12)] border border-black/[0.04] opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none z-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${historiUser ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {historiUser ? 'Status Saat Ini' : 'Standby'}
                        </span>
                      </div>
                      {historiUser && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          {new Date(historiUser.tanggalPembuatan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-medium text-slate-800 leading-relaxed line-clamp-4">
                      {historiUser 
                        ? (historiUser.hasilAI?.currentTarget?.deskripsi || historiUser.teksAsli) 
                        : "Terhubung aktif ke dalam Workspace. Menunggu pembaruan aktivitas..."}
                    </p>
                  </div>
                  
                  <div className={`relative w-16 h-16 rounded-full bg-white border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center justify-center ring-4 ${style.ring} hover:scale-105 transition-transform cursor-pointer`}>
                    <div className={`w-full h-full rounded-full ${style.bg} ${style.text} flex items-center justify-center font-bold text-xl tracking-tight`}>
                      {member.nama ? member.nama.substring(0, 2).toUpperCase() : <UserCircle2 />}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">{style.icon}</div>
                  </div>
                  <h4 className="mt-4 text-[15px] font-bold text-slate-900 tracking-tight capitalize whitespace-nowrap">{member.nama ? member.nama.split(' ')[0] : 'Member'}</h4>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{member.role || 'Member'}</p>
                </div>
              );
            })
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-20">
          <div className="w-full bg-white/90 backdrop-blur-xl border border-black/[0.04] p-2 rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.08)] flex items-center gap-3 transition-all hover:bg-white focus-within:bg-white focus-within:shadow-[0_16px_50px_rgb(0,0,0,0.1)] focus-within:border-slate-200">
            <input type="text" value={teksLaporan} onChange={(e) => setTeksLaporan(e.target.value)} disabled={isSending} placeholder={isListening ? "Sedang mendengarkan..." : "What's your progress today? Type or tap mic..."} className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-slate-700 placeholder:text-slate-400 px-4 py-3 disabled:opacity-60" />
            <button onClick={() => setBahasa(bahasa === "id-ID" ? "en-US" : "id-ID")} disabled={isSending || isListening} className="px-2 py-1 bg-[#F5F5F7] text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-200">{bahasa === "id-ID" ? "ID" : "EN"}</button>
            <button onClick={isListening ? () => setIsListening(false) : mulaiRekam} disabled={isSending} className={`p-4 rounded-[18px] shadow-sm transition-all active:scale-90 flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-[#F5F5F7] text-slate-500 hover:text-[#0071E3] hover:bg-blue-50'}`}><Mic size={22} /></button>
            <button onClick={kirimLaporan} disabled={isSending || !teksLaporan} className="px-5 py-3.5 bg-[#0071E3] text-white rounded-[18px] text-[13px] font-semibold shadow-sm hover:bg-[#005bb5] transition-all active:scale-95 flex items-center gap-2 mr-1 disabled:opacity-50"><Sparkles size={16} /> {isSending ? 'Wait...' : 'AI'}</button>
          </div>
        </div>
      </div>

      {/* SIDEBAR KANAN */}
      <div className="w-80 flex flex-col gap-6 h-full">
        {/* Kotak Sprint Review telah dihapus dari sini */}

        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Git Activities</h3>
            <button className="p-1.5 rounded-full hover:bg-[#F5F5F7] text-slate-400 transition-all active:scale-90"><GitBranch size={16} /></button>
          </div>
          <div className="space-y-6">
            {aktivitasGit.length === 0 ? (
              <p className="text-[12px] text-slate-400 font-medium text-center italic mt-10">Menunggu aktivitas push/commit terbaru...</p>
            ) : (
              aktivitasGit.map((akt, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer animate-in fade-in slide-in-from-top-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${akt.isWebhook ? 'bg-[#000]/10 text-black' : 'bg-[#0071E3]/10 text-[#0071E3]'}`}>
                    {akt.action === 'GitHub Push' ? <GitBranch size={14} /> : <CheckCircle2 size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-slate-700 font-medium leading-relaxed"><span className="font-semibold text-slate-900">{akt?.user || 'Sistem'}</span> melakukan {akt?.action || 'Pembaruan'}.</p>
                    {akt.pesan && <div className="mt-1.5 p-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] text-slate-600 italic border-l-2 border-l-slate-300">"{akt.pesan}"</div>}
                    <span className="text-[10px] text-slate-400 mt-1.5 block font-semibold uppercase tracking-wider">{akt.waktu ? new Date(akt.waktu).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCanvas;