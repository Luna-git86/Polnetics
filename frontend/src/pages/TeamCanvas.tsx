import { useState } from 'react';
import { Mic, Zap, MessageSquare, Bell, AlertTriangle, Send, ServerCrash, X } from 'lucide-react';

const TeamCanvas = () => {
  // === STATE LOGIC (DRAFT & VOICE) ===
  const [teksLaporan, setTeksLaporan] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [bahasa, setBahasa] = useState("id-ID"); 
  const [pesanError, setPesanError] = useState("");

  // === FUNGSI REKAM SUARA (MODE DRAFT) ===
  const mulaiRekam = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Maaf, browser kamu belum mendukung fitur Voice-to-Text.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = bahasa; 
    recognition.continuous = false;
    recognition.interimResults = true;

    const teksSebelumnya = teksLaporan ? teksLaporan + " " : "";

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const hasilSuara = event.results[0][0].transcript;
      setTeksLaporan(teksSebelumnya + hasilSuara);

      if (event.results[0].isFinal) {
        setIsListening(false);
      }
    };

    recognition.start();
  };

  // === FUNGSI KIRIM LAPORAN (MANUAL) ===
  const kirimLaporan = async () => {
    if (!teksLaporan.trim()) {
      alert("Laporan kosong! Bicara atau ketik dulu.");
      return;
    }

    const dataUser = localStorage.getItem('user');
    const namaPengirim = dataUser ? JSON.parse(dataUser).nama : "Ambas";

    try {
      setIsSending(true);
      setPesanError("");

      const response = await fetch("http://localhost:5000/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: namaPengirim, teksLaporan: teksLaporan }),
      });

      if (response.status === 503 || response.status === 429) {
        setPesanError("Server AI sedang penuh antrean atau limit habis. Coba sesaat lagi.");
        return;
      }

      if (response.ok) {
        alert("Sukses! Laporan telah dikirim ke Tim dan AI.");
        setTeksLaporan(''); 
      } else {
        setPesanError("Gagal mengirim laporan. Cek koneksi.");
      }
    } catch (error) {
      setPesanError("Gagal menghubungi Backend. Pastikan server nyala.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-300 font-sans">
      
      {/* ========================================================= */}
      {/* BAGIAN KIRI: AREA CANVAS & INPUT VOICE (LIGHT MODE)       */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Daily Standup</h1>
            <span className="px-2 py-0.5 rounded-full border border-blue-500/30 text-[10px] text-[#0071E3] flex items-center gap-1 bg-blue-50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse"></span> LIVE
            </span>
          </div>
          <p className="text-slate-500 text-sm">Sync Canva AI is listening for your updates</p>
        </div>

        {/* --- KOTAK NOTIFIKASI ERROR --- */}
        {pesanError && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 shadow-sm animate-in slide-in-from-top-2">
            <ServerCrash className="text-red-500 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-700">Sistem AI Sibuk</h4>
              <p className="text-xs text-red-600 mt-1">{pesanError}</p>
            </div>
            <button onClick={() => setPesanError('')} className="text-red-400 hover:text-red-600 transition-colors">
              <X size={16} />
            </button>
          </div>
        )}

        {/* --- KOTAK INPUT DRAFT (LIGHT MODE) --- */}
        <div className="relative mb-4 z-10 shadow-sm">
          <textarea 
            value={teksLaporan}
            onChange={(e) => setTeksLaporan(e.target.value)}
            disabled={isSending}
            placeholder={isSending ? "Mengirim laporan ke AI..." : "What's your progress today? Type or tap mic to speak..."}
            className="w-full h-32 bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white rounded-2xl p-4 pb-14 text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none transition-all disabled:opacity-60"
          />
          
          {/* Baris Kontrol di dalam Textarea */}
          <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
            {/* Tombol Bahasa */}
            <button
              onClick={() => setBahasa(bahasa === "id-ID" ? "en-US" : "id-ID")}
              disabled={isSending || isListening}
              className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
            >
              {bahasa === "id-ID" ? "🇮🇩 ID" : "🇬🇧 EN"}
            </button>

            {/* Tombol Mic & Kirim */}
            <div className="flex items-center gap-2">
              <button 
                onClick={isListening ? () => setIsListening(false) : mulaiRekam}
                disabled={isSending}
                title="Bicara (Voice to Text)"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-[#0071E3] hover:bg-blue-50'
                }`}
              >
                <Mic size={16} />
              </button>
              
              <button 
                onClick={kirimLaporan}
                disabled={isSending || !teksLaporan}
                className={`h-9 px-4 rounded-xl flex items-center gap-2 text-sm font-medium transition-all shadow-sm ${
                  isSending || !teksLaporan 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-[#0071E3] text-white hover:bg-[#005bb5]'
                }`}
              >
                <Send size={14} /> {isSending ? 'Memproses...' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Indikator AI */}
        <div className="flex items-center gap-2 mb-6 z-10">
          <Zap size={16} className="text-[#0071E3] fill-[#0071E3]" />
          <span className="text-sm font-medium text-slate-500">Ai Driven Mas Amba</span>
        </div>

        {/* --- GRID CANVAS AREA (LIGHT MODE Node Diagram) --- */}
        <div 
          className="flex-1 relative rounded-2xl border border-slate-200 overflow-hidden shadow-inner bg-white"
          style={{
            backgroundImage: "linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        >
          {/* Node 1 */}
          <div className="absolute top-1/4 left-[15%] w-16 h-16 rounded-full border-[3px] border-[#0071E3] overflow-hidden shadow-md z-10 hover:scale-110 transition-transform cursor-pointer bg-white">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Juliper" alt="Avatar" className="w-full h-full" />
          </div>
          {/* Garis Putus-putus */}
          <svg className="absolute top-[28%] left-[20%] w-full h-20 z-0">
             <path d="M 0 10 Q 50 10 80 20" fill="transparent" stroke="#0071E3" strokeWidth="2" strokeDasharray="5,5" className="opacity-40 animate-pulse" />
          </svg>

          {/* Node 2 */}
          <div className="absolute top-[30%] left-[35%] w-16 h-16 rounded-full border-[3px] border-[#0071E3] overflow-hidden shadow-md z-10 hover:scale-110 transition-transform cursor-pointer bg-white">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Saracak" alt="Avatar" className="w-full h-full" />
          </div>
           {/* Garis Solid */}
           <svg className="absolute top-[34%] left-[40%] w-full h-20 z-0">
             <path d="M 0 10 Q 50 20 100 10" fill="transparent" stroke="#f43f5e" strokeWidth="2" className="opacity-40" />
          </svg>

          {/* Node 3 */}
          <div className="absolute top-[30%] left-[60%] w-16 h-16 rounded-full border-[3px] border-[#0071E3] overflow-hidden shadow-md z-10 hover:scale-110 transition-transform cursor-pointer bg-white">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dasacak" alt="Avatar" className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BAGIAN KANAN: STATUS & TASKS (LIGHT MODE)                 */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* BAGIAN KANAN: STATUS & TEAM CHAT WIDGET                   */}
      {/* ========================================================= */}
      <div className="w-72 flex flex-col">
        
        {/* Top Icons */}
        <div className="flex justify-end gap-4 mb-8 text-slate-400">
          <MessageSquare size={20} className="cursor-pointer hover:text-[#0071E3] transition-colors" />
          <Bell size={20} className="cursor-pointer hover:text-[#0071E3] transition-colors" />
        </div>

        {/* Estimate Card */}
        <div className="bg-red-50 border border-red-100 rounded-[24px] p-4 flex flex-col items-center justify-center mb-6 relative overflow-hidden group shadow-sm">
          <h3 className="text-red-800 font-medium mb-1 z-10 text-xs">Estimate Day</h3>
          <h2 className="text-2xl font-bold text-red-600 z-10">-1 Day</h2>
          <AlertTriangle size={40} className="absolute text-red-500/10 top-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
        </div>

        {/* Team Chat Widget (Sesuai Desain Aslimu) */}
        <div className="bg-white rounded-[24px] p-5 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col flex-1 min-h-[300px]">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5 text-[#0071E3]">
              <MessageSquare size={18} /> 
              <span className="text-[13px] font-bold tracking-wide uppercase">Team Chat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]"></span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">3 Online</span>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-hide">
            
            {/* Pesan Orang Lain */}
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">AM</div>
              <div className="bg-[#F5F5F7] px-3.5 py-2.5 rounded-[18px] rounded-tl-sm text-[13px] text-slate-700 leading-relaxed max-w-[85%]">
                Halo tim, update UI hari ini aman ya?
              </div>
            </div>
            
            {/* Pesan Kita Sendiri */}
            <div className="flex gap-2.5 flex-row-reverse">
              <div className="bg-[#0071E3] text-white px-3.5 py-2.5 rounded-[18px] rounded-tr-sm text-[13px] leading-relaxed max-w-[85%] shadow-sm">
                Aman! Sedang dirapikan bagian sidebarnya. 👍
              </div>
            </div>

          </div>

          {/* Chat Input Box (Tambahan kecil agar chat terlihat fungsional) */}
          <div className="relative mt-auto pt-2 border-t border-slate-100/50">
            <input 
              type="text" 
              placeholder="Ketik balasan..." 
              className="w-full bg-[#F5F5F7] text-[12px] px-4 py-2.5 rounded-full outline-none pr-10 text-slate-700 placeholder:text-slate-400" 
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 mt-1 w-7 h-7 bg-[#0071E3] hover:bg-[#005bb5] transition-colors rounded-full flex items-center justify-center text-white shadow-sm">
              <Send size={12} className="-ml-0.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TeamCanvas;