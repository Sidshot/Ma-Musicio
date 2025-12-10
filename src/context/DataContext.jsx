import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [selectedArtist, setSelectedArtist] = useState(null); // For Modal
    const [searchQuery, setSearchQuery] = useState('');
    const [timeRange, setTimeRange] = useState('all'); // 'all', '2025', 'month'
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Sync theme with body class
    useEffect(() => {
        document.body.className = theme === 'dark' ? 'theme-dark bg-black text-white' : 'theme-light bg-gray-100 text-gray-900';
    }, [theme]);

    const openArtistModal = (artistName) => {
        setSelectedArtist(artistName);
    };

    const closeArtistModal = () => {
        setSelectedArtist(null);
    };

    return (
        <DataContext.Provider value={{
            selectedArtist,
            openArtistModal,
            closeArtistModal,
            searchQuery,
            setSearchQuery,
            timeRange,
            setTimeRange,
            theme,
            toggleTheme
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
