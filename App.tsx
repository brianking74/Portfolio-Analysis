
import React, { useState, useMemo } from 'react';
import { RAW_CSV_DATA } from './constants';
import { parseCSVData, processPrincipalData } from './utils/dataParser';
import BubbleChart from './components/BubbleChart';
import PrincipalTable from './components/PrincipalTable';
import { BARRIER_COLORS, BARRIER_LABELS, BarrierType } from './types';
import { 
  TrendingUp, 
  ChevronDown,
  LayoutDashboard,
  Filter,
  Download
} from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  
  const rawData = useMemo(() => parseCSVData(RAW_CSV_DATA), []);
  const processedData = useMemo(() => processPrincipalData(rawData), [rawData]);

  const stats = useMemo(() => {
    const totalRev = rawData.reduce((acc, curr) => acc + curr.revenue, 0);
    const avgMargin = rawData.reduce((acc, curr) => acc + curr.margin, 0) / rawData.length;
    const highValue = [...rawData].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    return { totalRev, avgMargin, highValue };
  }, [rawData]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Sidebar - Desktop Only */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 hidden lg:block z-20 shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Principal IQ</h1>
        </div>
        
        <nav className="space-y-1">
          <button 
            onClick={() => setViewMode('chart')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${viewMode === 'chart' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <TrendingUp size={20} />
            <span className="font-semibold">Quadrant Analysis</span>
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${viewMode === 'table' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Filter size={20} />
            <span className="font-semibold">Master Ledger</span>
          </button>
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <div className="p-5 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Aggregate Portfolio</p>
            <p className="text-2xl font-bold text-white">${(stats.totalRev / 1000000).toFixed(2)}M</p>
            <div className="mt-3 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[75%]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-wider">Internal Report</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="text-slate-400 text-xs font-medium tracking-tight">Updated: March 2024</span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Strategic Portfolio Analysis</h2>
            <p className="text-slate-500 mt-2 text-lg max-w-2xl">High-fidelity visualization of principal performance across margin, credit, and market barriers.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              <Download size={18} />
              Export Image
            </button>
            <div className="lg:hidden flex border bg-white rounded-xl p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('chart')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'chart' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                Chart
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                Data
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="animate-in fade-in zoom-in duration-1000">
          {viewMode === 'chart' ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3">
                <BubbleChart data={processedData} />
                
                {/* Legend Bar */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-center gap-8 shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Barriers</span>
                    {Object.entries(BARRIER_COLORS).map(([key, color]) => (
                      <div key={key} className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 rounded-full ring-2 ring-offset-2 ring-slate-100 shadow-sm" style={{ backgroundColor: color }}></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{BARRIER_LABELS[key as unknown as BarrierType]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-center gap-8 shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scale</span>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Small Rev</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Medium Rev</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-300"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">High Rev</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp size={80} />
                  </div>
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    Strategic Summary
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-8">
                    Identifying the <strong className="text-slate-900">Sweet Spot</strong>: Principals exhibiting &gt;50% margin with terms below 90 days should be prioritized for scaling.
                  </p>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">High-Volume Anchors</p>
                    {stats.highValue.map((p, i) => (
                      <div key={i} className="group/item flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all cursor-default shadow-sm hover:shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm truncate w-24">{p.name}</p>
                            <p className="text-[10px] font-medium text-slate-400 tracking-tight">{p.creditTerms} Days • {p.margin}%</p>
                          </div>
                        </div>
                        <p className="font-black text-indigo-600 text-sm">
                          ${(p.revenue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <h4 className="font-black text-xs uppercase tracking-widest mb-3 opacity-80">Next Actions</h4>
                    <ul className="text-sm space-y-3 font-medium text-indigo-50 mb-6">
                      <li className="flex gap-2 leading-snug"><span className="opacity-60">•</span> Negotiate terms for Nestle Waters</li>
                      <li className="flex gap-2 leading-snug"><span className="opacity-60">•</span> Investigate high-barrier outliers</li>
                      <li className="flex gap-2 leading-snug"><span className="opacity-60">•</span> Refresh Q2 sales targets</li>
                    </ul>
                    <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-50 transition-all active:scale-95">
                      Generate PDF Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <PrincipalTable data={rawData} />
          )}
        </div>
        
        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-slate-400 text-xs gap-4 mb-10">
          <div className="flex items-center gap-4">
            <p className="font-bold uppercase tracking-widest">© 2024 Intelligence Operations</p>
            <div className="h-4 w-px bg-slate-200"></div>
            <p className="font-medium">Data Integrity: Verified March 1, 2024</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors font-bold uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors font-bold uppercase tracking-widest">Security</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
