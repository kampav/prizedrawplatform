import { useState } from 'react';
import { api } from '../api';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle } from 'lucide-react';

interface Draw {
    id: number;
    title: string;
    description: string;
    prize_description: string;
}

export default function DrawCard({ draw }: { draw: Draw }) {
    const [entered, setEntered] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEnter = async () => {
        setLoading(true);
        setError('');
        try {
            // Simulating a logged-in user
            const customer = {
                customer_id: 'cust_12345',
                customer_name: 'Sarah Smith',
                customer_email: 'sarah.smith@example.com'
            };

            await api.enterDraw({
                draw_id: draw.id,
                ...customer
            });

            setEntered(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#16a34a', '#ffffff']
            });

        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to enter draw');
        } finally {
            setLoading(false);
        }
    };

    // Generate a flashy image URL based on ID or random
    const getBgImage = (id: number) => {
        const images = [
            'https://images.unsplash.com/photo-1550989467-f3014c07310d?q=80&w=800&auto=format&fit=crop', // Abstract
            'https://images.unsplash.com/photo-1546198632-9ef6377cf785?q=80&w=800&auto=format&fit=crop', // Colorful
            'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop', // Confetti
        ];
        return images[id % images.length];
    };

    if (entered) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
                <div className="flex flex-col items-center py-6 text-center">
                    <div className="bg-green-100 p-3 rounded-full mb-4">
                        <CheckCircle size={48} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Entry Confirmed!</h3>
                    <p className="text-gray-600 mb-6">Good luck! You've been entered into the {draw.title}.</p>
                    <button disabled className="bg-gray-100 text-gray-400 font-bold py-2 px-6 rounded-lg cursor-not-allowed">
                        Entered
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transform transition hover:scale-[1.02] group">
            <div className="h-48 relative overflow-hidden">
                <img src={getBgImage(draw.id)} alt="Prize" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-white/50">
                    FEATURED
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{draw.title}</h3>
                <p className="text-green-600 font-bold mb-4 text-lg flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-500" />
                    {draw.prize_description}
                </p>
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">{draw.description}</p>

                {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

                <button
                    onClick={handleEnter}
                    disabled={loading}
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                    {loading ? 'Processing...' : 'Enter Now'}
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">Terms and Conditions apply.</p>
            </div>
        </div>
    )
}
