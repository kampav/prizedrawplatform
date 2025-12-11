import { useEffect, useState } from 'react';
import { api } from '../api';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Trophy, ShieldCheck } from 'lucide-react';

export default function WinnerView() {
    const { id } = useParams();
    const [winners, setWinners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            api.getWinners(parseInt(id)).then(res => {
                setWinners(res.data.data);
                setLoading(false);
            });
        }
    }, [id]);

    return (
        <div className="max-w-4xl mx-auto p-8">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium">
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Draw Winners</h1>
                <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100">
                    <ShieldCheck size={16} /> Verified & Audited
                </div>
            </div>

            <div className="space-y-6">
                {/* Primary Winner */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                            <Trophy size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Primary Winner</h2>
                    </div>
                    {loading ? <p>Loading...</p> : winners.filter(w => w.type === 'primary').map(w => (
                        <div key={w.id} className="bg-white p-4 rounded-lg border border-orange-100 flex items-center gap-4">
                            <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center text-gray-500">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{w.customer_name}</p>
                                <p className="text-sm text-gray-500">{w.customer_email}</p>
                                <p className="text-xs text-orange-600 font-mono mt-1">ID: {w.id}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reserves */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Reserve Winners (Ranked 1-10)</h2>
                    <div className="grid gap-3">
                        {loading ? <p>Loading...</p> : winners.filter(w => w.type === 'reserve').map(w => (
                            <div key={w.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-gray-400 font-mono w-6">#{w.rank}</span>
                                <div>
                                    <p className="font-medium text-gray-900">{w.customer_name}</p>
                                    <p className="text-xs text-gray-500">{w.customer_email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
