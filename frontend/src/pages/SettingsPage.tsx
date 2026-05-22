import { User, Bell, Shield, Paintbrush, ChevronRight } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="animate-in fade-in duration-500 font-sans text-slate-900 max-w-4xl mx-auto">
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Pengaturan</h2>
        <p className="text-[13px] text-slate-500 font-medium mt-1">Kelola preferensi akun dan workspace Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigasi Kiri (Menu Setting) */}
        <div className="col-span-1 space-y-1">
          <button className="w-full flex items-center justify-between p-3 bg-white border border-black/[0.04] rounded-[16px] shadow-sm text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center"><User size={16} /></div>
              <span className="text-[14px] font-semibold text-slate-900">Profil Akun</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-slate-200/50 rounded-[16px] transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center"><Bell size={16} /></div>
              <span className="text-[14px] font-medium text-slate-600">Notifikasi</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-slate-200/50 rounded-[16px] transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center"><Shield size={16} /></div>
              <span className="text-[14px] font-medium text-slate-600">Keamanan</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-slate-200/50 rounded-[16px] transition-colors text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center"><Paintbrush size={16} /></div>
              <span className="text-[14px] font-medium text-slate-600">Tampilan</span>
            </div>
          </button>
        </div>

        {/* Konten Kanan (Form Profil) */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-6">Informasi Pribadi</h3>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-2xl font-semibold text-slate-400">
                AM
              </div>
              <div>
                <button className="px-4 py-2 bg-[#F5F5F7] text-slate-700 text-[13px] font-semibold rounded-full hover:bg-slate-200 transition-colors mb-2">
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
              <button className="px-6 py-2.5 bg-[#0071E3] text-white rounded-full text-[13px] font-semibold shadow-sm hover:bg-[#005bb5] transition-colors">
                Simpan Perubahan
              </button>
            </div>
          </div>

          {/* Pengaturan Tambahan (Toggle ala iOS) */}
          <div className="bg-white rounded-[24px] p-2 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between p-4 hover:bg-[#F5F5F7] rounded-[16px] transition-colors cursor-pointer">
              <div>
                <h4 className="text-[14px] font-semibold text-slate-900">Status Online</h4>
                <p className="text-[12px] text-slate-500 font-medium">Tampilkan status aktivitas Anda ke tim.</p>
              </div>
              {/* iOS Toggle Switch */}
              <div className="w-12 h-7 bg-[#34C759] rounded-full relative shadow-inner cursor-pointer">
                <div className="absolute right-1.5 top-1.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            
            <div className="h-px bg-slate-100 mx-4"></div>
            
            <div className="flex items-center justify-between p-4 hover:bg-[#F5F5F7] rounded-[16px] transition-colors cursor-pointer">
              <div>
                <h4 className="text-[14px] font-semibold text-slate-900">Sinkronisasi Kalender</h4>
                <p className="text-[12px] text-slate-500 font-medium">Hubungkan jadwal meeting secara otomatis.</p>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SettingsPage;