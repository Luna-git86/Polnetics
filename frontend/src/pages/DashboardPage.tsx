import { useState } from "react"; // Tambahan: Wajib di-import
import {
  MessageSquare,
  Bell,
  Mic,
  Zap,
  AlertTriangle,
  CheckCircle,
  LayoutGrid,
  BarChart2,
  ArrowUpRight,
  Send // Tambahan: Icon untuk tombol kirim
} from "lucide-react";

const DashboardPage = () => {
  // 1. State untuk Laporan dan Status Mikrofon
  const [teksLaporan, setTeksLaporan] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false); // Tambahan: Status loading saat mengirim ke AI

  // 2. Fungsi Sihir Pengenal Suara
  const mulaiRekam = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Maaf, browser kamu belum mendukung fitur Voice-to-Text. Coba pakai Google Chrome Desktop!",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const hasilSuara = event.results[0][0].transcript;
      setTeksLaporan(hasilSuara);
    };

    recognition.onerror = (event: any) => {
      console.error("Error suara:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // 3. FUNGSI BARU: Mengirim Teks ke Backend (Gemini AI)
  const kirimLaporan = async () => {
    if (!teksLaporan) {
      alert("Laporannya masih kosong, bicara atau ketik dulu ya! 🎤");
      return;
    }

    // Ambil nama dari brankas browser (jika tidak ada, pakai default 'Ambas')
    const dataUser = localStorage.getItem('user');
    const namaPengirim = dataUser ? JSON.parse(dataUser).nama : "Ambas";

    try {
      setIsSending(true); // Ubah tombol jadi mode loading
      console.log("🚀 Mengirim laporan ke AI...");

      const response = await fetch("http://localhost:5000/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: namaPengirim,
          teksLaporan: teksLaporan,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("🤖 Balasan dari Gemini:", data);
        alert("Sukses! Laporan berhasil dibedah oleh AI. Cek Terminal/Console.");
        setTeksLaporan(''); // Kosongkan kotak setelah terkirim
      } else {
        alert(`Gagal: ${data.pesan}`);
      }
    } catch (error) {
      console.error("Error Server:", error);
      alert("Gagal menghubungi Backend. Pastikan server port 5000 nyala!");
    } finally {
      setIsSending(false); // Kembalikan tombol seperti semula
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-white font-sans overflow-hidden">
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-[280px] bg-[#111624] border-r border-slate-800/50 flex flex-col z-20">
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-4 mt-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              AM
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#111624] rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight tracking-wide">
              Ambas
            </h3>
            <p className="text-slate-400 text-xs">Lead Engineer</p>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2 mt-4">
          <NavItem icon={<LayoutGrid size={18} />} label="Team Canvas" active />
          <NavItem icon={<BarChart2 size={18} />} label="Analytics" />
          <NavItem icon={<LayoutGrid size={18} />} label="Team Canvas" />
          <NavItem icon={<LayoutGrid size={18} />} label="Team Canvas" />
        </div>
      </div>

      {/* ================= MAIN CONTENT (TENGAH) ================= */}
      <div className="flex-1 relative flex flex-col">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="relative z-10 p-10 flex flex-col h-full">
          <div className="mb-8 mt-4">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold tracking-wide">
                Daily Standup
              </h1>
              <span className="px-3 py-1 bg-slate-800/80 border border-slate-600 rounded-full text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                LIVE
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Sync Canva AI is listening for your updates
            </p>
          </div>

          {/* Search/Voice Input */}
          <div className="w-full max-w-2xl mx-auto p-4 relative flex flex-col gap-4">
            <div className="relative">
              <textarea
                className="w-full h-32 p-4 pr-16 bg-slate-800 text-white rounded-xl border border-slate-600 focus:border-cyan-400 outline-none resize-none"
                placeholder="Ceritakan progres standup-mu hari ini..."
                value={teksLaporan}
                onChange={(e) => setTeksLaporan(e.target.value)}
              />

              <button
                type="button"
                onClick={isListening ? () => setIsListening(false) : mulaiRekam}
                className={`absolute bottom-4 right-4 p-3 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                    : "bg-slate-700 hover:bg-cyan-500"
                }`}
                title="Klik untuk bicara"
              >
                {isListening ? (
                  <span className="text-white text-xs font-bold">🛑</span>
                ) : (
                  <Mic size={18} className="text-white" />
                )}
              </button>
            </div>

            {/* TOMBOL BARU: Mengirim Laporan */}
            <button
              onClick={kirimLaporan}
              disabled={isSending || !teksLaporan}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isSending || !teksLaporan
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white cursor-pointer"
              }`}
            >
              {isSending ? (
                <span>Membedah dengan AI... ⏳</span>
              ) : (
                <>
                  <span>Kirim Laporan ke AI</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-cyan-400 font-medium mb-24 text-sm mt-8">
            <Zap size={16} className="fill-cyan-400" />
            <span>Ai Driven Mas Amba</span>
          </div>

          <div className="flex items-center flex-1 max-w-2xl pl-10">
            <div className="flex items-center w-full justify-start">
              <NodeAvatar img="https://i.pravatar.cc/150?img=11" />
              <div className="h-[2px] w-20 border-b-2 border-dashed border-cyan-700/60 -ml-2 -mr-2 z-0"></div>
              <NodeAvatar img="https://i.pravatar.cc/150?img=11" active />
              <div className="h-6 w-24 border-b-2 border-red-500/60 rounded-b-full -ml-2 -mr-2 z-0 mt-4 shadow-[0_10px_10px_rgba(239,68,68,0.2)]"></div>
              <NodeAvatar img="https://i.pravatar.cc/150?img=11" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDEBAR ================= */}
      <div className="w-[340px] bg-[#0B0F19] p-8 flex flex-col z-20">
        <div className="flex justify-end gap-6 mb-16 text-slate-300 mt-2">
          <MessageSquare className="cursor-pointer hover:text-white transition" size={22} />
          <Bell className="cursor-pointer hover:text-white transition" size={22} />
        </div>

        <div className="bg-[#1A0B11] border border-red-900/50 rounded-[2rem] py-10 px-6 flex flex-col items-center justify-center gap-2 mb-12 relative overflow-hidden group">
          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(220,38,38,0.15)] rounded-[2rem]"></div>
          <h3 className="text-slate-200 text-lg z-10">Estimate Day</h3>
          <div className="relative z-10 mt-2 flex flex-col items-center">
            <AlertTriangle
              size={80}
              strokeWidth={1.5}
              className="text-red-600/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <span className="text-4xl font-bold text-white relative z-10">-1 Day</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6 mt-4">
          <CheckCircle size={20} className="text-green-500" />
          <h3 className="text-lg font-medium text-slate-200">Completed Task</h3>
        </div>

        <div className="flex flex-col gap-4">
          <TaskCard title="BackEnd" />
          <TaskCard title="FrontEnd" />
          <TaskCard title="Design" />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-4 p-3.5 rounded-xl cursor-pointer transition-all ${active ? "bg-[#1C2333] text-white shadow-md" : "text-slate-400 hover:bg-[#1C2333]/50 hover:text-slate-200"}`}>
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const NodeAvatar = ({ img, active = false }: any) => (
  <div className={`relative z-10 p-1 rounded-full ${active ? "bg-gradient-to-b from-cyan-400 to-blue-600 shadow-[0_0_25px_rgba(6,182,212,0.5)]" : "border border-cyan-600/50 bg-[#0B0F19]"}`}>
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