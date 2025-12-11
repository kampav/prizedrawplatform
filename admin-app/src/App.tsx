import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateDrawWizard from './components/CreateDrawWizard';
import WinnerView from './components/WinnerView';
import EntriesView from './components/EntriesView';
import AuditLog from './components/AuditLog';
import { LayoutDashboard } from 'lucide-react';

function App() {
    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
            <nav className="bg-slate-900 border-b border-white/10 sticky top-0 z-30 shadow-xl shadow-slate-900/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-18 items-center py-4">
                        <div className="flex items-center gap-8">
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <div className="bg-gradient-to-br from-green-400 to-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-green-900/20">
                                    <LayoutDashboard size={22} />
                                </div>
                                <div>
                                    <h1 className="font-bold text-lg text-white leading-tight tracking-tight">Prize Platform</h1>
                                    <p className="text-xs text-slate-400 font-medium">Administration</p>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-6 pl-8 border-l border-slate-700/50 h-8">
                                <a href="/" className="text-sm font-medium text-white hover:text-green-400 transition-colors">Dashboard</a>
                                <a href="/audit" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Audit Logs</a>
                                <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Settings</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                AD
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="min-h-[calc(100vh-72px)]">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/create" element={<CreateDrawWizard />} />
                    <Route path="/winners/:id" element={<WinnerView />} />
                    <Route path="/entries/:id" element={<EntriesView />} />
                    <Route path="/audit" element={<AuditLog />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
