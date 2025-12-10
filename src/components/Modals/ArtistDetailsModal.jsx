import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Disc, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getArtistStats } from '../../utils/dataProcessor';

const ArtistDetailsModal = ({ rawData }) => {
    const { selectedArtist, closeArtistModal } = useData();

    const stats = useMemo(() => {
        if (!selectedArtist) return null;
        return getArtistStats(rawData, selectedArtist);
    }, [selectedArtist, rawData]);

    if (!selectedArtist || !stats) return null;

    const topTracks = Object.entries(stats.topTracks)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    const topAlbums = Object.entries(stats.topAlbums)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeArtistModal}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] glass-card bg-[#111] overflow-hidden flex flex-col shadow-2xl border-white/10"
                >
                    {/* Header with Gradient */}
                    <div className="relative h-48 bg-gradient-to-b from-ios-blue/20 to-[#111] p-8 flex flex-col justify-end">
                        <button
                            onClick={closeArtistModal}
                            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-5xl font-bold text-white text-glow mb-2">{stats.name}</h2>
                        <div className="flex gap-6 text-sm text-gray-300">
                            <span className="flex items-center gap-1"><Play size={14} className="text-ios-green" /> {stats.count.toLocaleString()} scrobbles</span>
                            <span className="flex items-center gap-1"><Calendar size={14} className="text-ios-blue" /> First: {stats.firstListen.toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Calendar size={14} className="text-ios-red" /> Latest: {stats.lastListen.toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar">
                        {/* Top Tracks */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white/90">
                                <Disc size={20} className="text-ios-purple" /> Top Tracks
                            </h3>
                            <ul className="space-y-4">
                                {topTracks.map(([track, count], idx) => (
                                    <li key={track} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500 font-mono w-6 text-right">{idx + 1}</span>
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium truncate max-w-[200px]">{track}</span>
                                                <div className="h-1 bg-white/10 w-24 rounded-full mt-1 overflow-hidden">
                                                    <div className="h-full bg-ios-purple" style={{ width: `${(count / topTracks[0][1]) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-gray-400 text-sm">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Top Albums */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white/90">
                                <Disc size={20} className="text-ios-orange" /> Top Albums
                            </h3>
                            <ul className="space-y-4">
                                {topAlbums.map(([album, count], idx) => (
                                    <li key={album} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500 font-mono w-6 text-right">{idx + 1}</span>
                                            <span className="text-white font-medium truncate max-w-[200px]">{album}</span>
                                        </div>
                                        <span className="text-gray-400 text-sm">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ArtistDetailsModal;
