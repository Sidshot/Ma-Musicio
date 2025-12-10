import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';

const SearchBar = ({ artists }) => {
    const { openArtistModal } = useData();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        if (val.length > 1) {
            const filtered = artists.filter(a => a.name.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
            setResults(filtered);
        } else {
            setResults([]);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
    };

    return (
        <div className="relative w-full max-w-md mx-auto z-50">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search for an artist..."
                    className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-ios-blue/50 transition-colors shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                {query && (
                    <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <X size={16} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-3 glass-card bg-black/80 overflow-hidden"
                    >
                        <ul>
                            {results.map((artist) => (
                                <li
                                    key={artist.name}
                                    onClick={() => {
                                        openArtistModal(artist.name);
                                        clearSearch();
                                    }}
                                    className="px-4 py-3 hover:bg-white/10 cursor-pointer flex justify-between items-center transition-colors border-b border-white/5 last:border-0"
                                >
                                    <span className="font-medium text-white">{artist.name}</span>
                                    <span className="text-sm text-gray-400">{artist.count} plays</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
