
import React, { useState, useMemo } from 'react';
import { RAW_CSV_DATA } from './constants';
import { parseCSVData, processPrincipalData } from './utils/dataParser';
import BubbleChart from './components/BubbleChart';
import PrincipalTable from './components/PrincipalTable';
import { BARRIER_COLORS, BARRIER_LABELS, BarrierType } from './types';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  ShieldAlert,
  ChevronDown,
  LayoutDashboard,
  Filter
} from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  
  const rawData = useMemo(() => parseCSVData(RAW_CSV_DATA), []);
  const processedData = useMemo(() => processPrincipalData(rawData), [rawData]);

  const stats = useMemo(() => {
    const totalRev = rawData.reduce((acc, curr) => acc + curr.revenue, 0);
    const avgMargin = rawData.reduce((acc, curr) => acc + curr.margin, 0) / rawData.length;
    const highValue = [...rawData].sort((a, b) => b.revenue - a.revenue).slice(0, 3);
    return { totalRev, avgMargin, highValue };
  }, [rawData]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900">
      {/* Sidebar - Desktop Only */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 hidden lg:block z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-blue-600 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Principal Insight</h1>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setViewMode('chart')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <TrendingUp size={20} />
            <span className="font-medium">Performance Chart</span>
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Filter size={20} />
            <span className="font-medium">Raw Data View</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-slate-800 rounded-xl">
            <p className="text-xs text-slate-500 uppercase mb-2">Total Managed Revenue</p>
            <p className="text-2xl font-bold">${(stats.totalRev / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Strategic Portfolio Analysis</h2>
            <p className="text-slate-500 mt-1">Analyzing {rawData.length} principals for sales targeting and optimization.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="lg:hidden flex border bg-white rounded-lg p-1">
              <button 
                onClick={() => setViewMode('chart')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'chart' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                Chart
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                Table
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="space-y-8">
          {viewMode === 'chart' ? (
            <>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow">
                  <BubbleChart data={processedData} />
                  <div className="mt-6 flex flex-wrap gap-4 items-center justify-center bg-white py-4 px-6 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-sm font-semibold text-slate-500 mr-2 uppercase tracking-tight">Barrier Level:</span>
                    {Object.entries(BARRIER_COLORS).map(([key, color]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                        <span className="text-sm text-slate-600">{BARRIER_LABELS[key as unknown as BarrierType]}</span>
                      </div>
                    ))}
                    <div className="h-4 w-px bg-slate-200 mx-2"></div>
                    <span className="text-sm font-semibold text-slate-500 mr-2 uppercase tracking-tight">Bubble Size:</span>
                    <span className="text-sm text-slate-600">Total Revenue Value</span>
                  </div>
                </div>

                <div className="lg:w-80 shrink-0 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <ChevronDown size={18} className="text-blue-600" />
                      Strategic Targets
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      Focus on principals in the <strong>Top-Left</strong> quadrant: High margins with manageable credit terms.
                    </p>
                    <div className="space-y-4">
                      {stats.highValue.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Principal</p>
                            <p className="font-semibold text-slate-800 text-sm truncate w-32">{p.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase">Rev</p>
                            <p className="font-bold text-blue-600 text-sm">
                              ${(p.revenue / 1000000).toFixed(1)}M
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-blue-200">
                    <h4 className="font-bold mb-2">Portfolio Insights</h4>
                    <p className="text-blue-100 text-sm leading-relaxed mb-4">
                      Nestle Waters and Nikka Whisky represent stable high-volume anchors with favorable margins.
                    </p>
                    <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-50 transition-colors">
                      Export Report
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <PrincipalTable data={rawData} />
          )}
        </div>
        
        {/* Footer info */}
        <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm pb-8">
          <p>© 2024 Principal Sales Performance Analysis Dashboard</p>
          <p className="mt-1 font-mono text-xs">Analysis generated from {rawData.length} distinct product principals.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
