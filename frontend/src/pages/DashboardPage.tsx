import { useState } from 'react';
import { LayoutGrid, BarChart2, Map, Settings, LogOut, Menu, X, Hash, ChevronDown, Bell, MessageCircle } from 'lucide-react';
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
  const [activeProject, setActiveProject] = useState('RPL Project');
  const [showMessages, setShowMessages] = useState(false);

  const projects = ['RPL Project', 'AI di Perbankan', 'Hackathon Immersive', 'Website Kampus', 'Slicing UI Dashboard'];

  return (
    <div className="flex h-screen bg-[#F5F5F7] text-slate-900 font-sans selection:bg-[#0071E3]/20 overflow-hidden">
      
      {/* === SIDEBAR === */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out bg-white border-r border-black/[0.04] flex flex-col shrink-0 z-20 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
        <div className="p-6 border-b border-black/[0.04] flex items-center gap-4 w-64 shrink-0 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center font-semibold text-sm border border-slate-200/60 shadow-sm shrink-0 text-slate-600">
            AM
          </div>
          <div className="shrink-0 flex-1">
            <h3 className="font-semibold text-sm text-slate-900 tracking-tight">Ambas</h3>
            <p className="text-[12px] text-slate-500 font-medium">Lead Engineer</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar w-64">
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'Team Canvas', icon: <LayoutGrid size={18} /> },
              { id: 'Analytics', icon: <BarChart2 size={18} /> },
              { id: 'Project Roadmap', icon: <Map size={18} /> }
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

          <div className="px-4 pb-4">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Workspaces</h4>
            <div className="space-y-1">
              {projects.map((proj) => (
                <button 
                  key={proj}
                  onClick={() => setActiveProject(proj)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-200 active:scale-[0.98] ${
                    activeProject === proj ? 'bg-blue-50/50 text-[#0071E3]' : 'text-slate-500 hover:bg-[#F5F5F7] hover:text-slate-900'
                  }`}
                >
                  <Hash size={14} className={activeProject === proj ? 'text-[#0071E3]' : 'text-slate-400'} />
                  <span className="truncate">{proj}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

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
              <h1 className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider">{activeProject}</h1>
              <span className="text-slate-300">/</span>
              <h1 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">{activeTab}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative">
            
            {/* Tombol Pesan */}
            <button onClick={() => setShowMessages(!showMessages)} className="p-2 rounded-full transition-all active:scale-90 text-slate-600 hover:bg-black/[0.04] relative">
              <MessageCircle size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F5F5F7]"></span>
            </button>

            {/* Pop-up Pesan Melayang */}
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
                      <p className="text-[12px] text-slate-500 line-clamp-1 mt-0.5">Bro, payload JWT udah gue push ke repo Github ya.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-2 hover:bg-slate-50 rounded-[16px] transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#FF3B30] font-bold text-sm shrink-0">DC</div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-slate-900">Dasacak</h4>
                      <p className="text-[12px] text-slate-500 line-clamp-1 mt-0.5">Aset Figma yang baru udah bisa didownload belum?</p>
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