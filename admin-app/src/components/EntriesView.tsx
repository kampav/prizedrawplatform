import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Trophy, Search, Download } from 'lucide-react';

export default function EntriesView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [draw, setDraw] = useState<any>(null);

    useEffect(() => {
        setLoading(true);
        // Fetch Draw Details to know status/title
        api.getDraws().then(res => {
            const d = res.data.data.find((d: any) => d.id === Number(id));
            setDraw(d);
        });

        // Fetch Entries
        api.getEntries(Number(id)).then(res => {
            setEntries(res.data.data);
            setLoading(false);
        }).catch(err => {
            console.error('Failed to fetch entries', err);
            setLoading(false);
        });
    }, [id]);

    const handlePickWinners = async () => {
        if (!confirm('Are you sure you want to pick winners now? This will close the draw.')) return;
        try {
            const res = await api.pickWinners(Number(id));
            alert(`Winners picked! Primary winner ID: ${res.data.primary_winner_entry_id}`);
            navigate(`/winners/${id}`);
        } catch (e: any) {
            alert(e.response?.data?.error || 'Error picking winners');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading entries...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{draw?.title || 'Draw Entries'}</h1>
                    <p className="text-gray-500">Managing {entries.length} entries</p>
                </div>
                <div className="ml-auto flex gap-3">
                    {draw?.status === 'active' && entries.length > 0 && (
                        <button onClick={handlePickWinners} className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-green-200">
                            <Trophy size={18} /> Pick Winner
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search entries..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-3">Entry ID</th>
                            <th className="px-6 py-3">Customer Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Entry Time</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {entries.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No entries yet.</td></tr>
                        ) : entries.map(entry => (
                            <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-3.5 text-gray-500 text-sm font-mono">#{entry.id}</td>
                                <td className="px-6 py-3.5 font-medium text-gray-900">{entry.customer_name}</td>
                                <td className="px-6 py-3.5 text-gray-600">{entry.customer_email}</td>
                                <td className="px-6 py-3.5 text-gray-500 text-sm">{new Date(entry.entry_time).toLocaleString()}</td>
                                <td className="px-6 py-3.5">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                                        Valid
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
