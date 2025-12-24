import { useState } from "react";
import Papa from 'papaparse';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface MetricRow {
    label: string;
    value: number;
    timestamp: string;
}

export function CsvUpload({ onImportComplete }: { onImportComplete: () => void }) {
    const [parsedData, setParsedData] = useState<MetricRow[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const rows = results.data as any[];
                const validRows = rows
                    .filter(row => row.label && row.value && row.timestamp)
                    .map(row => ({
                        label: row.label,
                        value: Number(row.value),
                        timestamp: row.timestamp
                    }));
                setParsedData(validRows);
            },
            error: (err) => setError(err.message)
        });
    };

    const handleImport = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch('/api/metrics/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rows: parsedData })
            });
            const data = await response.json();
            if (data.success) {
                setParsedData([]);
                onImportComplete();
            } else {
                setError(data.error || 'Import failed');
            }
        } catch (err) {
            setError('Connection failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                <FileSpreadsheet className="w-5 h-5 mr-2" />
                Import Data (CSV)
            </h3>
            <label className="block w-full p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center cursor-pointer hover:border-indigo-500 transition">
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400">Click to select CSV file</span>
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            {parsedData.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        {parsedData.length} rows ready to import
                    </p>
                    <button onClick={handleImport} disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                        {loading ? 'Importing...' : 'Import Data'}
                    </button>
                </div>
            )}
        </div>
    );
}