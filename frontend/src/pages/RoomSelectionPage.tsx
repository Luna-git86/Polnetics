import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, LogOut, Zap, X, Activity } from 'lucide-react';

const RoomSelectionPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  
  // State untuk mengontrol tampilan Form (Modal)
  const [activeModal, setActiveModal] = useState<'none' | 'create' | 'join'>('none');
  
  // State untuk inputan user
  const [namaWorkspace, setNamaWorkspace] = useState('');
  const [kodeJoin, setKodeJoin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pesan, setPesan] = useState('');

  // Ambil data user dari brankas browser saat halaman dimuat
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      // Jika tidak ada data user, usir kembali ke login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- FUNGSI MEMBUAT WORKSPACE BARU ---
  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaWorkspace) return setPesan('Nama Workspace wajib diisi!');

    try {
      setIsLoading(true);
      setPesan('');
      
      const response = await fetch('http://localhost:5000/api/workspace/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          namaWorkspace, 
          userId: userData._id || userData.id, // Ambil ID dari token/storage
          namaUser: userData.nama 
        })
      });

      const data = await response.json();

      if (response.ok || data.status === 'sukses') {
        // Simpan data workspace yang sedang aktif agar bisa dibaca oleh Dashboard
        localStorage.setItem('activeWorkspace', JSON.stringify(data.data));
        navigate('/dashboard');
      } else {
        setPesan(data.pesan || 'Gagal membuat workspace.');
      }
    } catch (error) {
      setPesan('Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNGSI BERGABUNG KE WORKSPACE ---
  const handleJoinWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeJoin) return setPesan('Kode undangan wajib diisi!');

    try {
      setIsLoading(true);
      setPesan('');
      
      const response = await fetch('http://localhost:5000/api/workspace/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          kodeJoin: kodeJoin.toUpperCase(), 
          userId: userData._id || userData.id, 
          namaUser: userData.nama 
        })
      });

      const data = await response.json();

      if (response.ok || data.status === 'sukses') {
        localStorage.setItem('activeWorkspace', JSON.stringify(data.data));
        navigate('/dashboard');
      } else {
        setPesan(data.pesan || 'Kode tidak valid atau kamu sudah bergabung.');
      }
    } catch (error) {
      setPesan('Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F5F5F7] text-slate-900 font-sans relative">
      
      {/* Header Info */}
      <div className="absolute top-0 w-full px-8 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-b from-[#0071E3] to-[#005bb5] rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={16} className="text-white fill-white/20" />
          </div>
          <span className="font-semibold tracking-tight text-slate-900 text-lg">CodeWorkZ</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white border border-black/[0.04] rounded-full text-[13px] font-semibold text-slate-600 hover:text-red-500 hover:bg-red-50 shadow-sm transition-all">
          <LogOut size={16} /> Keluar
        </button>
      </div>

      <div className="w-full max-w-3xl px-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
        
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/60 shadow-sm flex items-center justify-center text-2xl font-semibold text-slate-600 mb-6">
            {userData?.nama ? userData.nama.substring(0,2).toUpperCase() : 'AI'}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">Selamat datang, {userData?.nama?.split(' ')[0] || 'Engineer'}</h1>
          <p className="text-[15px] text-slate-500 font-medium">Pilih workspace atau buat ruang kerja baru untuk tim Anda.</p>
        </div>

        {/* Jika Modal Tidak Aktif, Tampilkan 2 Pilihan Utama */}
        {activeModal === 'none' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => setActiveModal('create')} className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Plus size={32} />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">Buat Workspace</h2>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                Buat ruang kerja baru, undang anggota tim, dan mulai proyek dari nol.
              </p>
            </button>

            <button onClick={() => setActiveModal('join')} className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-[#34C759]/10 text-[#34C759] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users size={32} />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">Gabung Workspace</h2>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                Masukkan kode undangan yang diberikan oleh manajer atau rekan tim Anda.
              </p>
            </button>
          </div>
        )}

        {/* --- KOTAK FORM: BUAT WORKSPACE --- */}
        {activeModal === 'create' && (
          <div className="max-w-md mx-auto bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-lg animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Buat Workspace Baru</h2>
              <button onClick={() => setActiveModal('none')} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            
            {pesan && <p className="text-sm text-red-500 mb-4 bg-red-50 p-2 rounded-lg">{pesan}</p>}

            <form onSubmit={handleCreateWorkspace}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Nama Proyek / Tim</label>
              <input 
                type="text"
                value={namaWorkspace}
                onChange={(e) => setNamaWorkspace(e.target.value)}
                placeholder="Cth: KMIPN VII Project"
                className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white text-sm rounded-xl py-3 px-4 outline-none transition-all mb-6"
                autoFocus
              />
              <button disabled={isLoading} type="submit" className="w-full bg-[#0071E3] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#005bb5] transition-all disabled:opacity-70">
                {isLoading ? <Activity size={18} className="animate-spin" /> : 'Buat & Lanjutkan'}
              </button>
            </form>
          </div>
        )}

        {/* --- KOTAK FORM: GABUNG WORKSPACE --- */}
        {activeModal === 'join' && (
          <div className="max-w-md mx-auto bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-lg animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Gabung Workspace</h2>
              <button onClick={() => setActiveModal('none')} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            {pesan && <p className="text-sm text-red-500 mb-4 bg-red-50 p-2 rounded-lg">{pesan}</p>}

            <form onSubmit={handleJoinWorkspace}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">Kode Undangan (6 Karakter)</label>
              <input 
                type="text"
                value={kodeJoin}
                onChange={(e) => setKodeJoin(e.target.value.toUpperCase())}
                placeholder="Cth: X9V2KL"
                maxLength={6}
                className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#34C759] focus:bg-white text-sm rounded-xl py-3 px-4 outline-none transition-all mb-6 uppercase tracking-widest text-center font-bold"
                autoFocus
              />
              <button disabled={isLoading} type="submit" className="w-full bg-[#34C759] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#2eb350] transition-all disabled:opacity-70">
                {isLoading ? <Activity size={18} className="animate-spin" /> : 'Verifikasi & Gabung'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default RoomSelectionPage;