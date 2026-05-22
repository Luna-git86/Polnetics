import { useState } from 'react';
import { LayoutGrid, BarChart2, Map, Settings, LogOut, Menu, X } from 'lucide-react';
import TeamCanvas from './TeamCanvas';
import ProjectRoadmap from './ProjectRoadmap';
import TeamAnalytics from './TeamAnalytics';
import SettingsPage from './SettingsPage'; // <-- Kita panggil halaman Settings di sini

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('Analytics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#F5F5F7] text-slate-900 font-sans selection:bg-[#0071E3]/20">
      
      {/* === SIDEBAR (Animasi Buka Tutup) === */}
      <div 
        className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out bg-white border-r border-black/[0.04] flex flex-col shrink-0 z-20 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}
      >
        <div className="p-6 border-b border-black/[0.04] flex items-center gap-4 w-64">
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center font-semibold text-sm border border-slate-200/60 shadow-sm shrink-0 text-slate-600">
            AM
          </div>
          <div className="shrink-0">
            <h3 className="font-semibold text-sm text-slate-900 tracking-tight">Ambas</h3>
            <p className="text-[12px] text-slate-500 font-medium">Lead Engineer</p>
          </div>
        </div>
        
        <nav className="p-4 space-y-1.5 flex-1 w-64">
          {[
            { id: 'Team Canvas', icon: <LayoutGrid size={18} /> },
            { id: 'Analytics', icon: <BarChart2 size={18} /> },
            { id: 'Project Roadmap', icon: <Map size={18} /> }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-200 ${
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

        <div className="p-6 border-t border-black/[0.04] w-64">
          <button className="w-full py-2.5 bg-[#F5F5F7] text-slate-600 hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-[12px] text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      {/* === KONTEN UTAMA === */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header Transparan & Tombol Navigasi */}
        <div className="h-16 border-b border-black/[0.04] bg-white/60 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            {/* Tombol Hamburger untuk Sidebar */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-full hover:bg-black/[0.04] text-slate-600 transition-colors focus:outline-none"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
              {activeTab}
            </h1>
          </div>
          
          {/* Tombol Settings (Sekarang Berfungsi!) */}
          <button 
            onClick={() => setActiveTab('Settings')}
            className={`p-2 rounded-full transition-colors ${
              activeTab === 'Settings' 
                ? 'bg-[#0071E3]/10 text-[#0071E3]' 
                : 'text-slate-600 hover:bg-black/[0.04]'
            }`}
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Area Render Halaman */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Rute Halaman berdasarkan Tab yang Aktif */}
            {activeTab === 'Team Canvas' && <TeamCanvas />}
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