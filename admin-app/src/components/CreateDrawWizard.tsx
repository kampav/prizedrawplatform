import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import { X, Check, Banknote, Plane, Tag, Box, Ticket } from 'lucide-react';

export default function CreateDrawWizard() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        prize_description: '',
        value: '',
        type: 'Cash',
        status: 'Draft',
        eligibility_criteria: '',
        end_date: '',
        start_date: new Date().toISOString().split('T')[0], // Hidden field, default to today
    });

    const [isTypeOpen, setIsTypeOpen] = useState(false);

    const prizeTypes = [
        { id: 'Cash', label: 'Cash', icon: Banknote, color: 'text-green-600' },
        { id: 'Holiday', label: 'Holiday', icon: Plane, color: 'text-blue-500' },
        { id: 'Voucher', label: 'Voucher', icon: Tag, color: 'text-yellow-500' },
        { id: 'Physical Item', label: 'Physical Item', icon: Box, color: 'text-orange-500' },
        { id: 'Experience', label: 'Experience', icon: Ticket, color: 'text-purple-500' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createDraw({
                ...formData,
                value: parseFloat(formData.value) || 0,
                status: formData.status.toLowerCase(),
            });
            navigate('/');
        } catch (err) {
            alert('Failed to create draw');
        }
    };

    const selectedType = prizeTypes.find(t => t.id === formData.type) || prizeTypes[0];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-900">Create Prize Draw</h1>
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-500 p-1 bg-gray-50 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Draw Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Draw Name *</label>
                        <input required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Summer Holiday Giveaway"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                        <textarea className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400 min-h-[100px]"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the prize and draw details..."
                        />
                    </div>

                    {/* Prize Title & Value */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Prize Title *</label>
                            <input required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400"
                                value={formData.prize_description}
                                onChange={e => setFormData({ ...formData, prize_description: e.target.value })}
                                placeholder="e.g., £5,000 Voucher"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Value (£) *</label>
                            <input type="number" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400"
                                value={formData.value}
                                onChange={e => setFormData({ ...formData, value: e.target.value })}
                                placeholder="5000"
                            />
                        </div>
                    </div>

                    {/* Prize Type & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Custom Dropdown for Prize Type */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Prize Type</label>
                            <button type="button" onClick={() => setIsTypeOpen(!isTypeOpen)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-left flex items-center justify-between focus:ring-2 focus:ring-green-500 outline-none">
                                <span className="flex items-center gap-2">
                                    <selectedType.icon size={18} className={selectedType.color} />
                                    {selectedType.label}
                                </span>
                                <span className="text-gray-400">▼</span>
                            </button>

                            {isTypeOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                                    {prizeTypes.map(type => (
                                        <button key={type.id} type="button"
                                            onClick={() => { setFormData({ ...formData, type: type.id }); setIsTypeOpen(false); }}
                                            className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                            <type.icon size={18} className={type.color} />
                                            <span className="text-gray-900">{type.label}</span>
                                            {formData.type === type.id && <Check size={16} className="ml-auto text-green-600" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status & End Date */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                            <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option>Draft</option>
                                <option>Active</option>
                            </select>
                        </div>
                    </div>

                    {/* Eligibility & Dates */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Eligibility Criteria</label>
                            <textarea className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400 min-h-[80px]"
                                value={formData.eligibility_criteria}
                                onChange={e => setFormData({ ...formData, eligibility_criteria: e.target.value })}
                                placeholder="e.g. UK residents only, 18+..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Start Date</label>
                                <input type="date" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    value={formData.start_date}
                                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">End Date</label>
                                <input type="date" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    value={formData.end_date}
                                    onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="pt-6 flex justify-between items-center border-t border-gray-100 mt-6">
                        <button type="button" onClick={() => navigate('/')} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-all transform active:scale-95">
                            Create Draw
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
