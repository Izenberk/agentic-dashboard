// RunTable component - currently unused but kept for future use

interface Run {
  id: string;
  workflow_name: string;
  status: 'pending' | 'completed' | 'failed';
  completed_at: string;
}

export function RunTable({ runs }: { runs: Run[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 bg-white">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Workflow</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Run ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {runs.map((run) => (
            <tr key={run.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${run.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                  ${run.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${run.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {run.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                {run.workflow_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                {run.id.slice(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {new Date(run.completed_at).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}