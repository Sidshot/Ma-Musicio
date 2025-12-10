import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { cn } from '../utils/cn';

const StatsCard = ({ title, value, icon: Icon, className, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-white/30 transition-all duration-300",
                className
            )}
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {Icon && <Icon size={64} />}
            </div>

            <div className="z-10 text-center relative">
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">{title}</h3>
                <div className="text-4xl font-bold text-white tracking-tight">
                    <CountUp end={value} duration={2.5} separator="," />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
