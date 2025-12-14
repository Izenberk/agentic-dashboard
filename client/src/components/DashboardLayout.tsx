import { type ReactNode } from 'react';
import { LayoutDashboard, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export function DashboardLayout({ children }: { children: ReactNode }) {
    const { user, logout } = useAuth();

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
                <div className="p-4 border-t border-slate-800">
                    <button onClick={logout} className="flex items-center px-4 py-3 w-full hover:bg-red-900/30 text-red-400 rounded-lg transition">
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shadow-sm z-10">
                    <h1 className="text-xl font-semibold text-slate-800">Overview</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-slate-600">{user?.email}</span>
                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">v1.2</span>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}