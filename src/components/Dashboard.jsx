import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Disc, Zap, TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';
import ListeningClock from './Charts/ListeningClock';
import YearlyStats from './Charts/YearlyStats';
import ScrobbleMilestones from './Charts/ScrobbleMilestones';
import SearchBar from './SearchBar';
import ArtistDetailsModal from './Modals/ArtistDetailsModal';
import AudioPlayer from './AudioPlayer';
import ThemeToggle from './ThemeToggle';
import { InfoModal, ListModal } from './Modals/GenericModals';
import { useData } from '../context/DataContext';

import { parseCSV, getStatsSummary, getTopArtists } from '../utils/dataProcessor';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { openArtistModal } = useData();

    // Modal States
    const [showAllSongs, setShowAllSongs] = useState(false);
    const [showAllArtists, setShowAllArtists] = useState(false);
    const [showStreakInfo, setShowStreakInfo] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use relative path for GitHub Pages compatibility
                const stats = await parseCSV('./lastfmstats-IndoCurry.csv');
                setData(stats);
                setLoading(false);
            } catch (err) {
                console.error("Error loading data:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-ios-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h2 className="text-white/80 font-medium animate-pulse">Analyzing Library...</h2>
                </div>
            </div>
        );
    }

    if (!data) return <div className="text-white text-center mt-20">Failed to load data.</div>;

    const summary = getStatsSummary(data);
    const topArtists = getTopArtists(data, 50);
    const top10Artists = topArtists.slice(0, 10);

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-24 relative">
            <ArtistDetailsModal rawData={data} />
            <AudioPlayer />

            {/* New Generic Modals */}
            <ListModal
                isOpen={showAllSongs}
                onClose={() => setShowAllSongs(false)}
                title="All Tracks"
                items={data.topTracks.slice(0, 1000)} // Limit to 1000 for performance simple list
                renderItem={(track, idx) => (
                    <div key={idx} className="flex justify-between p-2 border-b border-white/5 hover:bg-white/5 text-sm">
                        <span className="text-white truncate max-w-[70%]">{track.name}</span>
                        <span className="text-gray-400">{track.count} plays</span>
                    </div>
                )}
            />

            <ListModal
                isOpen={showAllArtists}
                onClose={() => setShowAllArtists(false)}
                title="All Artists"
                items={data.topArtists}
                renderItem={(artist, idx) => (
                    <div key={idx} onClick={() => { setShowAllArtists(false); openArtistModal(artist.name); }} className="flex justify-between p-2 border-b border-white/5 hover:bg-white/5 text-sm cursor-pointer">
                        <span className="text-white truncate font-medium">{artist.name}</span>
                        <span className="text-gray-400">{artist.count} plays</span>
                    </div>
                )}
            />

            <InfoModal
                isOpen={showStreakInfo}
                onClose={() => setShowStreakInfo(false)}
                title="Max Streak Logic"
                message="This data is calculated based on consecutive days of listening. If you see '0' or low numbers, contact IndoCurry!"
            />

            {/* Top Bar */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <div className="text-center md:text-left flex items-center gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-1">
                            IndoCurry's 2025
                        </h1>
                    </div>
                    <ThemeToggle />
                </div>
                <SearchBar artists={data.topArtists} />
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">

                {/* Stat Tiles (Row 1) - Now Clickable */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 cursor-pointer" onClick={() => setShowAllSongs(true)}>
                    <StatsCard title="Total Scrobbles" value={summary.total} icon={Disc} className="h-full bg-gradient-to-br from-ios-blue/20 to-transparent border-ios-blue/30" />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1 cursor-pointer" onClick={() => setShowAllArtists(true)}>
                    <StatsCard title="Unique Artists" value={summary.uniqueArtists} icon={Music} className="h-full" />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1 cursor-pointer" onClick={() => setShowStreakInfo(true)}>
                    <StatsCard title="Max Streak" value={summary.maxStreak} icon={TrendingUp} className="h-full bg-gradient-to-br from-ios-green/20 to-transparent border-ios-green/30" />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <StatsCard title="Unique Tracks" value={summary.uniqueTracks} icon={Zap} className="h-full" />
                </div>

                {/* Yearly Chart (Wide Tile) */}
                <div className="col-span-1 md:col-span-4 lg:col-span-2 row-span-2">
                    <YearlyStats data={data.years} />
                </div>

                {/* Listening Clock (Big Tile) */}
                <div className="col-span-1 md:col-span-4 lg:col-span-4 row-span-2">
                    <ListeningClock data={data.listeningClock} />
                </div>

                {/* Top Artists List (Tall Tile) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 glass-card p-6 overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-ios-purple rounded-full"></span>
                        Top Artists
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                        {top10Artists.map((artist, idx) => (
                            <div
                                key={artist.name}
                                onClick={() => openArtistModal(artist.name)}
                                className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors group cursor-pointer active:scale-95 duration-200"
                            >
                                <span className={`font-mono font-bold w-6 text-center ${idx < 3 ? 'text-ios-yellow' : 'text-gray-500'}`}>{idx + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-medium text-white truncate group-hover:text-ios-purple transition-colors">{artist.name}</span>
                                        <span className="text-xs text-gray-400">{artist.count}</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${(artist.count / top10Artists[0].count) * 100}%` }}
                                            transition={{ duration: 1 }}
                                            className="h-full bg-ios-purple"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Milestones (Tall Tile) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
                    <ScrobbleMilestones milestones={data.milestones} />
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center text-gray-500 text-sm py-8 flex flex-col items-center gap-4">
                <p>Made by <span className="text-white font-bold">Indocurry</span></p>

                <a
                    href="https://www.instagram.com/bored__sid?igsh=MWoyNzVjMXhmb3g5eQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ios-blue hover:text-white transition-colors border-b border-transparent hover:border-white"
                >
                    Drop me a message
                </a>

                {/* Visitor Counter Badge */}
                <div className="mt-2 opacity-50 hover:opacity-100 transition-opacity">
                    <img
                        src="https://visitor-badge.laobi.icu/badge?page_id=Sidshot.Ma-Musicio&right_color=%230A84FF&left_text=Visitors"
                        alt="Visitor Count"
                    />
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
