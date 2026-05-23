import { useState, useEffect } from 'react';
import { User, Shield, Paintbrush, ChevronRight, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

const SettingsPage = () => {
  const [activeMenu, setActiveMenu] = useState('Profil');
  
  // State untuk menampung data user & workspace dari local storage
  const [userData, setUserData] = useState<any>(null);
  const [workspaceData, setWorkspaceData] = useState<any>(null);
  
  // State untuk interaksi UI Manajemen Anggota
  const [isUpdating, setIsUpdating] = useState(false);
  const [notif, setNotif] = useState({ show: false, tipe: '', pesan: '' });

  useEffect(() => {
    // Ambil data terbaru dari brankas browser saat halaman dimuat
    const storedUser = localStorage.getItem('user');
    const storedWorkspace = localStorage.getItem('activeWorkspace');

    if (storedUser) setUserData(JSON.parse(storedUser));
    if (storedWorkspace) setWorkspaceData(JSON.parse(storedWorkspace));
  }, []);

  // Fungsi utilitas untuk memunculkan notifikasi sementara
  const showNotif = (tipe: 'sukses' | 'gagal', pesan: string) => {
    setNotif({ show: true, tipe, pesan });
    setTimeout(() => setNotif({ show: false, tipe: '', pesan: '' }), 3500);
  };

  // Cek jabatan user yang sedang login di workspace ini
  const currentUserWorkspaceRole = workspaceData?.anggota?.find(
    (m: any) => (m.user?._id || m.user || m.id) === (userData?._id || userData?.id)
  )?.role || 'Member';

  // Hanya Owner dan Admin yang punya akses mengubah role
  const hasAccessToManage = currentUserWorkspaceRole === 'Owner' || currentUserWorkspaceRole === 'Admin';

  // --- FUNGSI MENGUBAH ROLE KE BACKEND ---
  const handleUbahRole = async (targetUserId: string, roleBaru: string) => {
    if (!workspaceData || !userData) return;

    try {
      setIsUpdating(true);
      const payload = {
        workspaceId: workspaceData._id,
        requesterId: userData._id || userData.id,
        targetUserId: targetUserId,
        roleBaru: roleBaru
      };

      const response = await fetch('http://localhost:5000/api/workspace/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.status === 'sukses') {
        // Perbarui state lokal dan brankas browser agar UI langsung update tanpa refresh
        setWorkspaceData(result.data);
        localStorage.setItem('activeWorkspace', JSON.stringify(result.data));
        showNotif('sukses', result.pesan);
      } else {
        showNotif('gagal', result.pesan || 'Gagal mengubah role anggota.');
      }
    } catch (error) {
      showNotif('gagal', 'Terjadi kesalahan koneksi ke server.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 font-sans text-slate-900 max-w-4xl mx-auto h-full flex flex-col pb-10">
      
      <div className="mb-8 shrink-0 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Pengaturan</h2>
          <p className="text-[13px] text-slate-500 font-medium mt-1">Kelola preferensi akun dan workspace Anda.</p>
        </div>
        
        {/* Notifikasi Pop-up */}
        {notif.show && (
          <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm animate-in fade-in slide-in-from-top-2 ${
            notif.tipe === 'sukses' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
            {notif.tipe === 'sukses' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {notif.pesan}
          </div>
        )}
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

          {/* TAB BARU: MANAJEMEN ANGGOTA */}
          <div className="pt-2 pb-1 px-2"><div className="h-px bg-slate-200/60 w-full"></div></div>
          <button onClick={() => setActiveMenu('Anggota')} className={`w-full flex items-center gap-3 p-3 rounded-[16px] transition-colors text-left ${activeMenu === 'Anggota' ? 'bg-white border border-black/[0.04] shadow-sm' : 'hover:bg-slate-200/50'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeMenu === 'Anggota' ? 'bg-[#0071E3]/10 text-[#0071E3]' : 'bg-slate-200 text-slate-600'}`}><Users size={16} /></div>
            <span className={`text-[14px] ${activeMenu === 'Anggota' ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'}`}>Manajemen Anggota</span>
          </button>
        </div>

        {/* Konten Kanan */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* TAB: PROFIL (TETAP SAMA) */}
          {activeMenu === 'Profil' && (
            <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-6">Informasi Pribadi</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-2xl font-semibold text-slate-400">
                  {userData?.nama ? userData.nama.substring(0, 2).toUpperCase() : 'UI'}
                </div>
                <div>
                  <button className="px-4 py-2 bg-[#F5F5F7] text-slate-700 text-[13px] font-semibold rounded-full hover:bg-slate-200 transition-all active:scale-95 mb-2">
                    Ubah Foto
                  </button>
                  <p className="text-[12px] text-slate-400 font-medium">JPG, GIF atau PNG. Maksimal 2MB.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 ml-1">Nama Lengkap</label>
                  <input type="text" defaultValue={userData?.nama || ''} className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3 px-4 rounded-[12px] outline-none transition-all text-[14px] font-medium text-slate-900" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 ml-1">Alamat Email</label>
                  <input type="email" defaultValue={userData?.email || ''} className="w-full bg-[#F5F5F7] border border-transparent focus:border-slate-300 focus:bg-white py-3 px-4 rounded-[12px] outline-none transition-all text-[14px] font-medium text-slate-900" disabled />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button className="px-6 py-2.5 bg-[#0071E3] text-white rounded-full text-[13px] font-semibold shadow-sm hover:bg-[#005bb5] transition-all active:scale-95">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* TAB: MANAJEMEN ANGGOTA (FITUR BARU) */}
          {activeMenu === 'Anggota' && (
            <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">Tim Workspace</h3>
                  <p className="text-[12px] text-slate-500 mt-1">Mengatur otorisasi dan peran masing-masing anggota di proyek ini.</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">
                  Role Kamu: <span className="text-[#0071E3]">{currentUserWorkspaceRole}</span>
                </div>
              </div>

              {!hasAccessToManage && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Hanya pengguna dengan jabatan <b>Owner</b> atau <b>Admin</b> yang memiliki wewenang untuk mengubah peran anggota lain.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {workspaceData?.anggota?.map((member: any) => {
                  const targetId = member.user?._id || member.user || member.id;
                  const isSatuOrangSama = targetId === (userData?._id || userData?.id);
                  const isTargetOwner = member.role === 'Owner';
                  const isAdminMencobaUbahOwner = currentUserWorkspaceRole === 'Admin' && isTargetOwner;
                  
                  // Disable dropdown jika: bukan admin/owner, atau sedang mengupdate, atau mencoba mengubah role diri sendiri, atau admin mencoba mengubah role owner
                  const isDisabled = !hasAccessToManage || isUpdating || isSatuOrangSama || isAdminMencobaUbahOwner;

                  return (
                    <div key={targetId} className="flex items-center justify-between p-4 bg-[#F5F5F7]/50 border border-slate-100 rounded-[16px] hover:bg-[#F5F5F7] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[12px] font-bold text-slate-600 shrink-0">
                          {member.nama ? member.nama.substring(0, 2).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-semibold text-slate-900 flex items-center gap-2">
                            {member.nama} 
                            {isSatuOrangSama && <span className="text-[10px] bg-[#0071E3]/10 text-[#0071E3] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Kamu</span>}
                          </h4>
                        </div>
                      </div>

                      {/* Dropdown Role */}
                      <select 
                        value={member.role}
                        onChange={(e) => handleUbahRole(targetId, e.target.value)}
                        disabled={isDisabled}
                        className={`text-[12px] font-bold py-1.5 pl-3 pr-8 rounded-lg border outline-none appearance-none bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:12px] cursor-pointer
                          ${member.role === 'Owner' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                          ${member.role === 'Admin' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${['backend', 'frontend', 'lead-engineer', 'ui-ux', 'devops'].includes(member.role) ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                          ${member.role === 'Member' ? 'bg-slate-100 text-slate-600 border-slate-200' : ''}
                          ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-95 shadow-sm'}
                        `}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}
                      >
                        <optgroup label="Manajemen Akses">
                          <option value="Owner" disabled={currentUserWorkspaceRole !== 'Owner'}>Owner</option>
                          <option value="Admin">Admin</option>
                          <option value="Member">Member Biasa</option>
                        </optgroup>
                        
                        <optgroup label="Role Teknis Tim">
                          <option value="lead-engineer">Lead Engineer</option>
                          <option value="backend">Backend</option>
                          <option value="frontend">Frontend</option>
                          <option value="ui-ux">UI/UX</option>
                          <option value="devops">DevOps</option>
                        </optgroup>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: KEAMANAN (TETAP SAMA) */}
          {activeMenu === 'Keamanan' && (
             // ... [Bisa diisi sisa kode tab keamanan lama] ...
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

          {/* TAB: TAMPILAN (TETAP SAMA) */}
          {activeMenu === 'Tampilan' && (
            // ... [Bisa diisi sisa kode tab tampilan lama] ...
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