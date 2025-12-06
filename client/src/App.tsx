import { useEffect, useState } from 'react';
import { api } from './lib/api';
import { MetricChart } from './components/MetricChart';
import { LayoutDashboard, MessageSquare } from 'lucide-react';
import { AgentChat } from './components/AgentChat';

function App() {
  const [metrics, setMetrics] = useState<any[]>([])

  useEffect(() => {
    if (api.api.metrics) {
      api.api.metrics.get().then(({ data }) => {
        if (data) setMetrics(data);
      });
    }
  }, []);

  // Filter data for charts
  const salesData = metrics.filter(m => m.label === 'Sales');
  const visitorData = metrics.filter(m => m.label === 'Visitors');

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 font-bold text-white tracking-wider border-b border-slate-800">
          ANALYST 🕵️‍♂️
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center px-4 py-3 bg-slate-800 text-white rounded-lg cursor-pointer">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </div>
          <div className="flex items-center px-4 py-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors text-slate-400">
            <MessageSquare className="w-5 h-5 mr-3" />
            Insights
          </div>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shadow-sm z-10">
          <h1 className="text-xl font-semibold text-slate-800">Overview</h1>
          <div className="flex items-center space-x-4">
             <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">Live Config</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MetricChart title="Total Revenue" data={salesData} color="#8884d8" />
                    <MetricChart title="Unique Visitors" data={visitorData} color="#82ca9d" />
                </div>
                {/* Agent Insight */}
                <div className="grid grid-cols-1 gap-8">
                  <AgentChat />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;