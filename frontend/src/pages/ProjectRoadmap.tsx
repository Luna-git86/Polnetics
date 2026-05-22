import { AlertTriangle, Calendar, TrendingUp, Zap } from 'lucide-react';

const ProjectRoadmap = () => {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 font-sans text-slate-900">
      
      {/* Header & Toggle */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Project Roadmap</h1>
        
        {/* Tombol Toggle ala Switch iOS */}
        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-black/[0.04] shadow-sm rounded-full">
          <Zap size={16} className="text-[#0071E3] fill-[#0071E3]/20" />
          <span className="text-[13px] font-semibold text-slate-600">AI Predictive Mode</span>
          <div className="w-10 h-6 bg-[#34C759] rounded-full relative ml-2 cursor-pointer transition-colors shadow-inner">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-[#0071E3] mb-3">
            <TrendingUp size={18} /> <span className="text-sm font-semibold tracking-tight">Current Progress</span>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">62%</h2>
          <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
            <div className="w-[62%] h-full bg-[#0071E3] rounded-full"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-[#FF9500] mb-3">
            <Calendar size={18} /> <span className="text-sm font-semibold tracking-tight">Release Date</span>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-1">MAY 28</h2>
          <p className="text-[13px] font-medium text-slate-500">2026</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[24px] p-6 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-[#FF3B30] mb-3">
            <AlertTriangle size={18} /> <span className="text-sm font-semibold tracking-tight">AI Estimated Delay</span>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-[#FF3B30] mb-1">-1 Day</h2>
          <p className="text-[13px] font-medium text-slate-500">Due to active blockers</p>
        </div>
      </div>

      {/* Timeline View (Gantt Chart UI) */}
      <div className="bg-white rounded-[24px] p-8 border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1 overflow-x-auto">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 mb-8">Timeline View</h3>
        
        <div className="min-w-[800px]">
          {/* Header Hari */}
          <div className="grid grid-cols-8 gap-4 mb-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center border-b border-slate-100 pb-4">
            <div className="text-left text-slate-500">Task Name</div>
            <div>Sun | 3</div>
            <div>Mon | 4</div>
            <div>Tue | 5</div>
            <div>Wed | 6</div>
            <div>Thu | 7</div>
            <div>Fri | 8</div>
            <div>Sat | 9</div>
          </div>

          {/* Baris Task */}
          <div className="space-y-6 relative">
            
            {/* API Integration */}
            <div className="grid grid-cols-8 gap-4 items-center group">
              <div>
                <h4 className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                  API Integration <span className="w-2 h-2 rounded-full bg-[#FF9500]"></span>
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">BackEnd</p>
              </div>
              <div className="col-span-7 relative h-8 bg-slate-50 rounded-full group-hover:bg-slate-100 transition-colors">
                <div className="absolute top-1 left-[14%] w-[57%] h-6 bg-[#FF9500]/10 border border-[#FF9500]/20 rounded-full flex items-center justify-between px-4 text-xs font-semibold text-[#FF9500]">
                  <span>4</span><span>5</span><span>6</span><span>7</span>
                </div>
              </div>
            </div>

            {/* Dashboard Slicing */}
            <div className="grid grid-cols-8 gap-4 items-center group">
              <div>
                <h4 className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                  Dashboard Slicing <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">FrontEnd</p>
              </div>
              <div className="col-span-7 relative h-8 bg-slate-50 rounded-full group-hover:bg-slate-100 transition-colors">
                <div className="absolute top-1 left-[42%] w-[57%] h-6 bg-[#34C759]/10 border border-[#34C759]/20 rounded-full flex items-center justify-between px-4 text-xs font-semibold text-[#34C759]">
                  <span>12</span><span>13</span><span>14</span><span>15</span>
                </div>
              </div>
            </div>

            {/* User Auth */}
            <div className="grid grid-cols-8 gap-4 items-center group">
              <div>
                <h4 className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                  User Authentification <span className="w-2 h-2 rounded-full bg-[#0071E3]"></span>
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">BackEnd</p>
              </div>
              <div className="col-span-7 relative h-8 bg-slate-50 rounded-full group-hover:bg-slate-100 transition-colors">
                <div className="absolute top-1 left-0 w-[70%] h-6 bg-[#0071E3]/10 border border-[#0071E3]/20 rounded-full flex items-center justify-between px-4 text-xs font-semibold text-[#0071E3]">
                  <span>17</span><span>18</span><span>19</span><span>20</span><span>21</span>
                </div>
                <div className="absolute top-1 left-[80%] w-[20%] h-6 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-full flex items-center justify-between px-4 text-xs font-semibold text-[#FF3B30]">
                  <span>22</span><span>23</span>
                </div>
              </div>
            </div>

             {/* Design System */}
             <div className="grid grid-cols-8 gap-4 items-center group">
              <div>
                <h4 className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                  Design System <span className="w-2 h-2 rounded-full bg-[#AF52DE]"></span>
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Design</p>
              </div>
              <div className="col-span-7 relative h-8 bg-slate-50 rounded-full group-hover:bg-slate-100 transition-colors">
                <div className="absolute top-1 left-[14%] w-[42%] h-6 bg-[#AF52DE]/10 border border-[#AF52DE]/20 rounded-full flex items-center justify-between px-4 text-xs font-semibold text-[#AF52DE]">
                  <span>24</span><span>25</span><span>26</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectRoadmap;