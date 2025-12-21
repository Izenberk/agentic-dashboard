import { type ReactNode, useState } from 'react';
import { LayoutDashboard, MessageSquare, LogOut, Menu } from 'lucide-react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../lib/AuthContext';

export function DashboardLayout({ children }: { children: ReactNode }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - hidden on mobile, slides in when open */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col 
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
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
                <div className="p-4 border-t border-slate-800 space-y-2">
                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="flex items-center px-4 py-3 w-full hover:bg-slate-800 rounded-lg transition text-slate-400">
                        {theme === 'light' ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                    {/* Logout */}
                    <button onClick={logout} className="flex items-center px-4 py-3 w-full hover:bg-red-900/30 text-red-400 rounded-lg transition">
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 md:px-8 justify-between shadow-sm z-10">
                    {/* Hamburger menu - mobile only */}
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 md:hidden">
                        <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                    </button>
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Overview</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline">{user?.email}</span>
                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 dark:text-slate-400">v1.2</span>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}