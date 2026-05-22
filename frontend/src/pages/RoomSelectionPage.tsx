import { Plus, Users, LogOut, Zap } from 'lucide-react';

// Tambahkan Interface
interface RoomSelectionPageProps {
  onSelectRoom: () => void;
}

const RoomSelectionPage = ({ onSelectRoom }: RoomSelectionPageProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F5F5F7] text-slate-900 font-sans selection:bg-[#0071E3]/20">
      
      <div className="absolute top-0 w-full px-8 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-b from-[#0071E3] to-[#005bb5] rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={16} className="text-white fill-white/20" />
          </div>
          <span className="font-semibold tracking-tight text-slate-900 text-lg">CodeWorkZ</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-black/[0.04] rounded-full text-[13px] font-semibold text-slate-600 hover:text-red-500 hover:bg-red-50 shadow-sm transition-all">
          <LogOut size={16} /> Keluar
        </button>
      </div>

      <div className="w-full max-w-3xl px-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
        
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/60 shadow-sm flex items-center justify-center text-2xl font-semibold text-slate-600 mb-6">
            AM
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Selamat datang, Ambas</h1>
          <p className="text-[15px] text-slate-500 font-medium">Pilih workspace atau buat ruang kerja baru untuk tim Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pasang aksi onClick di tombol */}
          <button onClick={onSelectRoom} className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Plus size={32} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">Buat Workspace</h2>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Buat ruang kerja baru, undang anggota tim, dan mulai proyek dari nol.
            </p>
          </button>

          {/* Pasang aksi onClick di tombol */}
          <button onClick={onSelectRoom} className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users size={32} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">Gabung Workspace</h2>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Masukkan kode undangan yang diberikan oleh manajer atau rekan tim Anda.
            </p>
          </button>

        </div>
      </div>
    </div>
  );
};

export default RoomSelectionPage;