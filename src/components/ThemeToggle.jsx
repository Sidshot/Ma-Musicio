import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useData();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full glass-card hover:bg-white/10 transition-colors"
            title="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.3 }}
            >
                {theme === 'dark' ? (
                    <Moon size={20} className="text-ios-blue" />
                ) : (
                    <Sun size={20} className="text-ios-orange" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
