import { useEffect, useState } from 'react';
import { api } from './api';
import DrawCard from './components/DrawCard';
import { Wallet, Trophy } from 'lucide-react';

function App() {
    const [draws, setDraws] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        api.getActiveDraws()
            .then(res => setDraws(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-green-600 selection:text-white font-sans">
            {/* Header */}
            <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg transition-colors ${scrolled ? 'bg-green-600' : 'bg-white/20 backdrop-blur'}`}>
                            <Trophy size={24} className={scrolled ? 'text-white' : 'text-white'} />
                        </div>
                        <span className={`font-bold text-lg hidden sm:block ${scrolled ? 'text-gray-900' : 'text-white'}`}>Prize Platform</span>
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all ${scrolled ? 'bg-gray-100 text-gray-900' : 'bg-white/10 backdrop-blur text-white'}`}>
                        <Wallet size={18} />
                        <span className="text-sm font-medium">My Account</span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative bg-emerald-900 pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-600 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight animate-slide-up">
                        Unlock Exclusive <span className="text-green-300">Rewards</span>
                    </h1>
                    <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        As a valued customer, you have access to premium prize draws. Enter now for your chance to win.
                    </p>
                    <div className="flex justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <button onClick={() => document.getElementById('draws')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white text-emerald-900 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            View Prize Draws
                        </button>
                    </div>
                </div>
            </div>

            {/* Draws Grid */}
            <main id="draws" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
                {loading ? (
                    <div className="flex justify-center p-20 bg-white rounded-3xl shadow-xl min-h-[400px] items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {draws.map((draw, index) => (
                            <div key={draw.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <DrawCard draw={draw} />
                            </div>
                        ))}
                        {draws.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Trophy className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Draws</h3>
                                <p className="text-gray-500">Check back later for new opportunities!</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Trophy size={20} />
                        <span className="font-bold text-lg">Prize Platform</span>
                        <span className="text-sm ml-2">© 2024</span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-green-600 transition-colors">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App
