import { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, FileText, Sprout, Trash2, Users, Trophy, Calendar, Activity } from 'lucide-react';

export default function Dashboard() {
    const [draws, setDraws] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDraws = () => {
        setLoading(true);
        api.getDraws().then(res => {
            setDraws(res.data.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchDraws();
    }, []);

    const handlePickWinners = async (id: number) => {
        if (!confirm('Are you sure you want to pick winners now? This will close the draw.')) return;
        try {
            await api.pickWinners(id);
            alert('Winners picked successfully!');
            fetchDraws();
        } catch (e: any) {
            alert(e.response?.data?.error || 'Error picking winners');
        }
    };

    // Stats calculations
    const activeDraws = draws.filter(d => d.status === 'active').length;
    const totalEntries = draws.reduce((acc, curr) => acc + (curr.entries_count || 0), 0);
    const winnersSelected = draws.filter(d => d.status === 'completed').length;

    // Helper for images
    const getBgImage = (id: number) => {
        const images = [
            'https://images.unsplash.com/photo-1550989467-f3014c07310d?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1546198632-9ef6377cf785?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=200&auto=format&fit=crop',
        ];
        return images[id % images.length];
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchDraws} className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
                        <RefreshCw size={20} />
                    </button>
                    <Link to="/create" className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95">
                        <Plus size={18} /> New Campaign
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg shadow-green-200 transform hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Activity size={20} className="text-white" />
                        </div>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">+12%</span>
                    </div>
                    <p className="text-green-50 text-sm font-medium mb-1">Active Campaigns</p>
                    <p className="text-3xl font-bold">{activeDraws}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform hover:-translate-y-1 transition-transform group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Users size={20} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Entries</p>
                    <p className="text-3xl font-bold text-gray-900">{totalEntries.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform hover:-translate-y-1 transition-transform group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-purple-50 p-2 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Trophy size={20} className="text-purple-600" />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Winners Selected</p>
                    <p className="text-3xl font-bold text-gray-900">{winnersSelected}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform hover:-translate-y-1 transition-transform group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-orange-50 p-2 rounded-lg group-hover:bg-orange-100 transition-colors">
                            <FileText size={20} className="text-orange-600" />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Campaigns</p>
                    <p className="text-3xl font-bold text-gray-900">{draws.length}</p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
                    All Campaigns
                </button>
                <button className="px-4 py-2 hover:bg-gray-50 text-gray-500 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                    Live
                </button>
                <button className="px-4 py-2 hover:bg-gray-50 text-gray-500 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                    Drafts
                </button>
                <button className="px-4 py-2 hover:bg-gray-50 text-gray-500 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                    Completed
                </button>
                <div className="ml-auto flex gap-2">
                    <Link to="/audit" className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <FileText size={16} /> Audit Log
                    </Link>
                    <button className="px-4 py-2 border border-yellow-200 text-yellow-700 bg-yellow-50 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center gap-2">
                        <Sprout size={16} /> Seed Data
                    </button>
                </div>
            </div>

            {/* Draws Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Campaign</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Prize Value</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Entries</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Timeline</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
                            ) : draws.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No campaigns found.</td></tr>
                            ) : draws.map((draw, idx) => (
                                <tr key={draw.id} className="group hover:bg-gray-50/50 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                                                <img src={getBgImage(draw.id)} alt="" className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{draw.title}</div>
                                                <div className="text-xs text-gray-500">{draw.prize_description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 font-medium text-gray-900">
                                            <span className="text-gray-400 text-xs">£</span>
                                            {draw.value?.toLocaleString() || '1,000'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link to={`/entries/${draw.id}`} className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                            <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(100, (draw.entries_count || 0) / 20)}%` }}></div>
                                            </div>
                                            <span className="text-sm text-gray-600 group-hover:text-blue-600">{draw.entries_count || '0'}</span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                            <Calendar size={14} />
                                            {new Date(draw.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${draw.status === 'active' ? 'bg-green-100 text-green-700' :
                                                draw.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                                                ${draw.status === 'active' ? 'bg-green-500' :
                                                    draw.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                                            {draw.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/entries/${draw.id}`} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="View Entries">
                                                <Users size={16} />
                                            </Link>

                                            {draw.status === 'active' && (
                                                <button onClick={() => handlePickWinners(draw.id)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Pick Winner">
                                                    <Trophy size={16} />
                                                </button>
                                            )}

                                            {draw.status === 'completed' && (
                                                <Link to={`/winners/${draw.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="View Winners">
                                                    <Users size={16} />
                                                </Link>
                                            )}

                                            <button className="p-2 hover:bg-gray-100 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Visual Only) */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{draws.length}</span> of <span className="font-medium text-gray-900">{draws.length}</span> results</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-500 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-500 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
