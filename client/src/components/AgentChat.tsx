import { useState, useEffect } from "react";
import { Send, Bot } from 'lucide-react';
import { api } from '../lib/api';

interface Insight {
    id: number;
    prompt: string;
    answer: string | null;
    created_at: string;
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { authorization: `Bearer ${token}` } : {};
}

export function AgentChat() {
    const [input, setInput] = useState('');
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(false);

    // Poll for updates
    useEffect(() => {
        const fetchHistory = () => {
            const headers = getAuthHeaders();
            if (api.api.chat && headers.authorization) {
                api.api.chat.history.get({ headers }).then(({ data }) => {
                    if (Array.isArray(data)) setInsights(data as unknown as Insight[]);
                });
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const headers = getAuthHeaders();
        if (!headers.authorization) return;

        setLoading(true);
        await api.api.chat.post({ prompt: input }, { headers });
        setInput('');
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-[500px] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h3 className="font-semibold text-slate-700 dark:text-slate-200">Analyst AI</h3>
            </div>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                {[...insights].reverse().map((insight) => (
                    <div key={insight.id} className="space-y-2">
                        {/* User Question */}
                        <div className="flex justify-end">
                            <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%] text-sm">
                                {insight.prompt}
                            </div>
                        </div>
                        {/* AI Answer */}
                        <div className="flex justify-start">
                            <div className={`px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%] text-sm border 
                    ${insight.answer ? 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200' : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400 italic'}`}>
                                {insight.answer || "Thinking..."}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your data..."
                    className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}