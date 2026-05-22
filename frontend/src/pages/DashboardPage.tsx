import { useState, useEffect } from 'react';
import { LayoutGrid, BarChart2, Map, Settings, LogOut, Menu, X, ChevronDown, Bell, MessageCircle, Copy, Check, Video } from 'lucide-react';
import TeamCanvas from './TeamCanvas';
import ProjectRoadmap from './ProjectRoadmap';
import TeamAnalytics from './TeamAnalytics';
import SettingsPage from './SettingsPage';
import MeetingSpace from './MeetingSpace';

interface DashboardProps {
  onLogout: () => void;
}

const DashboardPage = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('Team Canvas');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const [copied, setCopied] = useState(false);

  // State untuk menampung data dinamis dari sesi login/room
  const [user, setUser] = useState<any>(null);
  const [workspace, setWorkspace] = useState<any>(null);

  useEffect(() => {
    // Ambil data dari brankas browser
    const storedUser = localStorage.getItem('user');
    const storedWorkspace = localStorage.getItem('activeWorkspace');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedWorkspace) setWorkspace(JSON.parse(storedWorkspace));
  }, []);

  const handleCopyCode = () => {
    if (workspace?.kodeJoin) {
      navigator.clipboard.writeText(workspace.kodeJoin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Logika untuk menentukan tingkat jabatan user di workspace ini (Owner/Admin/Member)
  const dapatkanRoleWorkspace = () => {
    if (!workspace || !user) return 'Member';
    const userId = user._id || user.id;
    const pencarianAnggota = workspace.anggota?.find((m: any) => {
      const idAnggota = m.user?._id || m.user || m.id;
      return idAnggota === userId;
    });
    return pencarianAnggota?.role || 'Member';
  };

  return (
    <div className="flex h-screen bg-[#F5F5F7] text-slate-900 font-sans selection:bg-[#0071E3]/20 overflow-hidden">
      
      {/* === SIDEBAR === */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out bg-white border-r border-black/[0.04] flex flex-col shrink-0 z-20 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
        
        {/* Identitas Pengguna Logged In */}
        <div className="p-6 border-b border-black/[0.04] flex items-center gap-4 w-64 shrink-0 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#0071E3] to-[#005bb5] flex items-center justify-center font-bold text-sm text-white shadow-sm shrink-0">
            {user?.nama ? user.nama.substring(0, 2).toUpperCase() : 'AM'}
          </div>
          <div className="shrink-0 flex-1 overflow-hidden">
            <h3 className="font-semibold text-sm text-slate-900 tracking-tight truncate">{user?.nama || 'Loading...'}</h3>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{user?.role || 'Engineer'}</p>
          </div>
          <ChevronDown size={16} className="text-slate-400 shrink-0" />
        </div>
        
        {/* Menu Navigasi Utama */}
        <div className="flex-1 overflow-y-auto custom-scrollbar w-64">
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'Team Canvas', icon: <LayoutGrid size={18} /> },
              { id: 'Analytics', icon: <BarChart2 size={18} /> },
              { id: 'Project Roadmap', icon: <Map size={18} /> },
              { id: 'Meeting Space', icon: <Video size={18} /> }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                  activeTab === item.id 
                    ? 'bg-[#0071E3] text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-[#F5F5F7] hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.id}
              </button>
            ))}
          </nav>

          <div className="px-6 py-2"><div className="h-px w-full bg-slate-100"></div></div>

          {/* Info Status Workspace Aktif */}
          <div className="p-4 mx-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Workspace</h4>
            <p className="text-sm font-bold text-slate-800 truncate mb-3">
              {workspace?.namaWorkspace || 'No Active Project'}
            </p>
            
            <div className="h-px bg-slate-200/60 mb-2"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] block font-medium text-slate-400">Your Team Role</span>
                <span className="text-xs font-semibold text-[#0071E3] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 mt-0.5 inline-block">
                  {dapatkanRoleWorkspace()}
                </span>
              </div>
            </div>
          </div>

          {/* Kotak Berbagi Kode Undangan (Sangat penting untuk Demo Juri) */}
          {workspace?.kodeJoin && (
            <div className="mt-4 p-4 mx-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col gap-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Invite Code Team</span>
              <div className="flex items-center justify-between bg-white px-3 py-2 border border-emerald-200 rounded-xl">
                <span className="font-mono font-bold text-slate-800 tracking-widest text-sm">{workspace.kodeJoin}</span>
                <button 
                  onClick={handleCopyCode} 
                  className="text-emerald-600 hover:text-emerald-800 p-1 rounded-md hover:bg-slate-50 transition-colors"
                  title="Salin Kode"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Keluar Sesi */}
        <div className="p-4 border-t border-black/[0.04] w-64 shrink-0 bg-white">
          <button onClick={onLogout} className="w-full py-2.5 bg-[#F5F5F7] text-slate-600 hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-[12px] text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      {/* === KONTEN UTAMA === */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="h-16 border-b border-black/[0.04] bg-white/60 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 rounded-full hover:bg-black/[0.04] text-slate-600 transition-all active:scale-90 focus:outline-none">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                {workspace?.namaWorkspace || 'Workspace'}
              </h1>
              <span className="text-slate-300">/</span>
              <h1 className="text-[13px] font-bold text-[#0071E3] uppercase tracking-wider">{activeTab}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative">
            {/* Tombol Pesan Melayang */}
            <button onClick={() => setShowMessages(!showMessages)} className="p-2 rounded-full transition-all active:scale-90 text-slate-600 hover:bg-black/[0.04] relative">
              <MessageCircle size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F5F5F7]"></span>
            </button>

            {showMessages && (
              <div className="absolute top-12 right-12 w-80 bg-white/95 backdrop-blur-xl border border-black/[0.04] rounded-[24px] shadow-[0_16px_50px_rgb(0,0,0,0.12)] p-4 z-50 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Pesan Tim</h3>
                  <span className="text-[11px] font-semibold text-[#0071E3] cursor-pointer hover:underline">Tandai dibaca</span>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-3 p-2 hover:bg-slate-50 rounded-[16px] transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0071E3] font-bold text-sm shrink-0">JS</div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-slate-900">Juliper</h4>
                      <p className="text-[12px] text-slate-500 line-clamp-1 mt-0.5">Bro, payload JWT udah gue push ke repo ya.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button className="p-2 rounded-full transition-all active:scale-90 text-slate-600 hover:bg-black/[0.04]">
              <Bell size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('Settings')}
              className={`p-2 rounded-full transition-all active:scale-90 ${activeTab === 'Settings' ? 'bg-[#0071E3]/10 text-[#0071E3]' : 'text-slate-600 hover:bg-black/[0.04]'}`}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Render Komponen Halaman Secara Dinamis */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto h-full min-h-[700px]"> 
            {activeTab === 'Team Canvas' && <TeamCanvas />}
            {activeTab === 'Meeting Space' && <MeetingSpace />}
            {activeTab === 'Analytics' && <TeamAnalytics />}
            {activeTab === 'Project Roadmap' && <ProjectRoadmap />}
            {activeTab === 'Settings' && <SettingsPage />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;