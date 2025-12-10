import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const ListeningClock = ({ data }) => {
    // Find max value for normalization
    const maxVal = Math.max(...data.flat());

    const getIntensityClass = (val) => {
        if (val === 0) return 'bg-white/5';
        const intensity = val / maxVal;
        if (intensity < 0.2) return 'bg-ios-blue/20';
        if (intensity < 0.4) return 'bg-ios-blue/40';
        if (intensity < 0.6) return 'bg-ios-blue/60';
        if (intensity < 0.8) return 'bg-ios-blue/80';
        return 'bg-ios-blue shadow-[0_0_15px_rgba(10,132,255,0.5)]';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 w-full overflow-x-auto h-full"
        >
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-ios-indigo rounded-full"></span>
                Listening Clock
            </h3>

            <div className="flex flex-col min-w-[800px]">
                {/* Header Row */}
                <div className="flex mb-3">
                    <div className="w-12"></div>
                    {HOURS.map(h => (
                        <div key={h} className="flex-1 text-[10px] text-gray-500 text-center font-medium">
                            {h}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                <div className="space-y-[2px]">
                    {DAYS.map((day, dIndex) => (
                        <div key={day} className="flex items-center">
                            <div className="w-12 text-[10px] text-gray-400 font-medium uppercase tracking-wider">{day}</div>
                            {HOURS.map((h) => {
                                const val = data[dIndex][h];
                                return (
                                    <div
                                        key={`${day}-${h}`}
                                        className="flex-1 aspect-square mx-[1px] relative group"
                                    >
                                        <div
                                            className={cn(
                                                "w-full h-full rounded-[2px] transition-all duration-300",
                                                getIntensityClass(val)
                                            )}
                                        />

                                        {/* Tooltip */}
                                        {val > 0 && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-max pointer-events-none">
                                                <div className="bg-[#1c1c1e] text-white text-xs px-2 py-1.5 rounded-lg border border-white/10 shadow-xl">
                                                    <span className="font-bold text-ios-blue">{val}</span> plays at {h}:00
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ListeningClock;
