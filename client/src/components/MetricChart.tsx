import { useRef, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Download, FileImage, FileText } from "lucide-react";
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface Metric {
  id: number,
  label: string;
  value: number;
  timestamp: string;
}

export function MetricChart({ title, data, color }: { title: string, data: Metric[], color: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportAsPng = async () => {
    if (!chartRef.current) return;
    setShowExportMenu(false); // Close menu first

    // Wait for DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));

    const dataUrl = await toPng(chartRef.current, {
      backgroundColor: '#ffffff',
      filter: (node) => {
        // Exclude tooltip elements from capture
        if (node.classList?.contains('recharts-tooltip-wrapper')) return false;
        // Exclude elements marked for hiding during export
        if (node.getAttribute?.('data-export-hide') === 'true') return false;
        return true;
      }
    });
    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '_')}_chart.png`;
    link.href = dataUrl;
    link.click();
  };

  const exportAsPdf = async () => {
    if (!chartRef.current) return;
    setShowExportMenu(false); // Close menu first

    // Wait for DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));

    const dataUrl = await toPng(chartRef.current, {
      backgroundColor: '#ffffff',
      filter: (node) => {
        // Exclude tooltip elements from capture
        if (node.classList?.contains('recharts-tooltip-wrapper')) return false;
        // Exclude elements marked for hiding during export
        if (node.getAttribute?.('data-export-hide') === 'true') return false;
        return true;
      }
    });
    const width = chartRef.current.offsetWidth;
    const height = chartRef.current.offsetHeight;
    const pdf = new jsPDF('landscape', 'px', [width, height]);
    pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
    pdf.save(`${title.replace(/\s+/g, '_')}_chart.pdf`);
  };

  return (
    <div ref={chartRef} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className="flex items-center space-x-2 relative" data-export-hide="true">
          <button onClick={() => setShowExportMenu(!showExportMenu)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition" title="Export">
            <Download className="w-4 h-4 text-slate-400" />
          </button>
          {showExportMenu && (
            <div className="absolute right-0 top-8 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-lg shadow-lg z-10">
              <button onClick={exportAsPng} className="flex items-center px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 w-full">
                <FileImage className="w-4 h-4 mr-2" /> PNG
              </button>
              <button onClick={exportAsPdf} className="flex items-center px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 w-full">
                <FileText className="w-4 h-4 mr-2" /> PDF
              </button>
            </div>
          )}
          <TrendingUp className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fillOpacity={1}
              fill={`url(#color${title})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}