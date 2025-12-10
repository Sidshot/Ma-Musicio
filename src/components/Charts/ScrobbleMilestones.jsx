import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Award, Zap } from 'lucide-react';

const ScrobbleMilestones = ({ milestones }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'Flag': return <Flag size={16} className="text-ios-blue" />;
            case 'Award': return <Award size={16} className="text-ios-yellow" />;
            case 'Zap': return <Zap size={16} className="text-ios-green" />;
            default: return <Award size={16} className="text-white" />;
        }
    };

    const handleMilestoneClick = (title, desc) => {
        // Remove "by Artist" from desc to get cleaner query, or just search full string
        // desc format: "TrackName by ArtistName"
        const query = desc.replace(' by ', ' ');
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    };

    return (
        <div className="glass-card p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-ios-yellow rounded-full"></span>
                Milestones
            </h3>
            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2 pb-4">
                {milestones.map((m, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative pl-6 border-l border-white/10 last:border-0 group cursor-pointer"
                        onClick={() => handleMilestoneClick(m.title, m.desc)}
                        title="Click to search on Google"
                    >
                        <div className="absolute left-[-9px] top-0 bg-[#1c1c1e] p-1 rounded-full border border-white/20 group-hover:scale-110 group-hover:border-ios-yellow transition-all">
                            {getIcon(m.icon)}
                        </div>
                        <div className="mb-1 group-hover:translate-x-1 transition-transform">
                            <span className="text-xs font-mono text-gray-400 block">{m.date.toLocaleDateString()}</span>
                            <span className="text-white font-bold block group-hover:text-ios-yellow transition-colors">{m.title}</span>
                        </div>
                        <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{m.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ScrobbleMilestones;
