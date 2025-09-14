import React from 'react';
import type { User } from '../types';
import { Icon } from './Icon';

interface DashboardProps {
    user: User;
    onNewPresentation: () => void;
}

const recentPresentations = [
    { id: 1, title: "The Future of Renewable Energy", modified: "2 days ago", thumbnail: "https://picsum.photos/seed/energymix/400/225" },
    { id: 2, title: "Innovations in Solar Power", modified: "5 days ago", thumbnail: "https://picsum.photos/seed/solarpower/400/225" },
    { id: 3, title: "Quantum Computing Explained", modified: "1 week ago", thumbnail: "https://picsum.photos/seed/quantum/400/225" },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNewPresentation }) => {
    return (
        <div className="flex-grow p-8 text-white animate-slide-in">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-display font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="text-lg text-gray-400 mt-2">Ready to create something amazing?</p>

                <div className="mt-10">
                    <button
                        onClick={onNewPresentation}
                        className="flex items-center gap-3 bg-primary text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:bg-primary-hover transform hover:scale-105 shadow-lg shadow-primary/30"
                    >
                        <Icon name="add" className="w-6 h-6" />
                        Create New Presentation
                    </button>
                </div>

                <div className="mt-16">
                    <h2 className="text-2xl font-bold font-display">Recent Presentations</h2>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentPresentations.map((pres) => (
                             <div key={pres.id} className="bg-gray-900 rounded-lg overflow-hidden group border border-gray-800 hover:border-primary transition-colors cursor-pointer">
                                <img src={pres.thumbnail} alt={pres.title} className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity" />
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-white truncate">{pres.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1">Last modified: {pres.modified}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};