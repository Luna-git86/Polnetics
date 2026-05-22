import { useState } from 'react';
import { User, Shield, Paintbrush, ChevronRight } from 'lucide-react';

const SettingsPage = () => {
  const [activeMenu, setActiveMenu] = useState('Profil');

  return (
    <div className="animate-in fade-in duration-500 font-sans text-slate-900 max-w-4xl mx-auto h-full flex flex-col">
      
      <div className="mb-8 shrink-0">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Pengaturan</h2>
        <p className="text-[13px] text-slate-500 font-medium mt-1">Kelola preferensi akun dan workspace Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
        
        {/* Navigasi Kiri */}
        <div className="col-span-1 space-y-1">
          <button onClick={() => setActiveMenu('Profil')} className={`w-full flex items-center gap-3 p-3 rounded-[16px] transition-colors text-left ${activeMenu === 'Profil' ? 'bg-white border border-black/[0.04] shadow-sm' : 'hover:bg-slate-200/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeMenu === 'Profil' ? 'bg-[#0071E3]/10 text-[#0071E3]' : 'bg-slate-200 text-slate-600'}`}><User size={16} /></div>
            <span className={`text-[14px] ${activeMenu === 'Profil' ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'}`}>Profil Akun</span>
          </button>
          
          <button onClick={() => setActiveMenu('Keamanan')} className={`w-full flex items-center gap-3 p-3 rounded-[16px] transition-colors text-left ${activeMenu === 'Keamanan' ? 'bg-white border border-black/[0.04] shadow-sm' : 'hover:bg-slate-200/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeMenu === 'Keamanan' ? 'bg-[#0071E3]/10 text-[#0071E3]' : 'bg-slate-200 text-slate-600'}`}><Shield size={16} /></div>
            <span className={`text-[14px] ${activeMenu === 'Keamanan' ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'}`}>Keamanan</span>
          </button>
          
          <button onClick={() => setActiveMenu('Tampilan')} className={`w-full flex items-center gap-3 p-3 rounded-[16px] transition-colors text-left ${activeMenu === 'Tampilan' ? 'bg-white border border-black/[0.04] shadow-sm' : 'hover:bg-slate-200/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeMenu === 'Tampilan' ? 'bg-[#0071E3]/10 text-[#0071E3]' : 'bg-slate-200 text-slate-600'}`}><Paintbrush size={16} /></div>
            <span className={`text-[14px] ${activeMenu === 'Tampilan' ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'}`}>Tampilan</span>
          </button>
        </div>

        {/* Konten Kanan */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* TAB: PROFIL */}
          {activeMenu === 'Profil' && (
            <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-6">Informasi Pribadi</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-2xl font-semibold text-slate-400">
                  AM
                </div>
                <div>
                  <button className="px-4 py-2 bg-[#F5F5F7] text-slate-700 text-[13px] font-semibold rounded-full hover:bg-slate-200 transition-all active:scale-95 mb-2">
                    Ubah Foto
                  </button>
                  <p className="text-[12px] text-slate-400 font-medium">JPG, GIF atau PNG. Maksimal 2MB.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 ml-1">Nama Depan</label>
                    <input type="text" defaultValue="Ambas" className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3 px-4 rounded-[12px] outline-none transition-all text-[14px] font-medium text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 ml-1">Nama Belakang</label>
                    <input type="text" defaultValue="Engineer" className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3 px-4 rounded-[12px] outline-none transition-all text-[14px] font-medium text-slate-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 ml-1">Alamat Email</label>
                  <input type="email" defaultValue="ambas@codeworkz.inc" className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3 px-4 rounded-[12px] outline-none transition-all text-[14px] font-medium text-slate-900" />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button className="px-6 py-2.5 bg-[#0071E3] text-white rounded-full text-[13px] font-semibold shadow-sm hover:bg-[#005bb5] transition-all active:scale-95">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* TAB: KEAMANAN */}
          {activeMenu === 'Keamanan' && (
            <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-6">Keamanan Akun</h3>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 ml-1">Kata Sandi Saat Ini</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3 px-4 rounded-[12px] outline-none transition-all text-[14px]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 ml-1">Kata Sandi Baru</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3 px-4 rounded-[12px] outline-none transition-all text-[14px]" />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="px-6 py-2.5 bg-[#0071E3] text-white rounded-full text-[13px] font-semibold shadow-sm hover:bg-[#005bb5] transition-all active:scale-95">
                  Perbarui Sandi
                </button>
              </div>
            </div>
          )}

          {/* TAB: TAMPILAN */}
          {activeMenu === 'Tampilan' && (
            <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-6">Tema Aplikasi</h3>
              <div className="flex gap-6 mb-8">
                <div className="cursor-pointer group">
                  <div className="w-32 h-24 bg-[#F5F5F7] border-2 border-[#0071E3] rounded-[16px] mb-3 p-2 shadow-sm transition-transform active:scale-95">
                    <div className="w-full h-4 bg-white rounded flex items-center px-1 mb-1"><div className="w-2 h-2 bg-slate-200 rounded-full"></div></div>
                    <div className="w-full h-full bg-white rounded border border-slate-100"></div>
                  </div>
                  <p className="text-[13px] font-semibold text-center text-[#0071E3]">Terang (Aktif)</p>
                </div>
                <div className="cursor-pointer group opacity-60 hover:opacity-100 transition-all">
                  <div className="w-32 h-24 bg-slate-900 border-2 border-transparent group-hover:border-slate-500 rounded-[16px] mb-3 p-2 shadow-sm transition-transform active:scale-95">
                    <div className="w-full h-4 bg-slate-800 rounded flex items-center px-1 mb-1"><div className="w-2 h-2 bg-slate-600 rounded-full"></div></div>
                    <div className="w-full h-full bg-slate-800 rounded"></div>
                  </div>
                  <p className="text-[13px] font-semibold text-center text-slate-500">Gelap</p>
                </div>
              </div>
              <div className="h-px bg-slate-100 mb-6"></div>
              <div className="flex items-center justify-between p-4 hover:bg-[#F5F5F7] rounded-[16px] transition-colors cursor-pointer active:scale-[0.99]">
                <div>
                  <h4 className="text-[14px] font-semibold text-slate-900">Sinkronisasi Kalender</h4>
                  <p className="text-[12px] text-slate-500 font-medium">Hubungkan jadwal meeting secara otomatis.</p>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;