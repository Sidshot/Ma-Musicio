import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1c1c1e]/90 backdrop-blur-md p-3 border border-white/10 rounded-xl shadow-xl">
                <p className="text-ios-blue font-bold mb-1">{label}</p>
                <p className="text-white text-sm">Scrobbles: {payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

const YearlyStats = ({ data }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card p-6 w-full h-[400px] flex flex-col"
        >
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-ios-blue rounded-full"></span>
                Yearly Journey
            </h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="year"
                            stroke="#6b7280"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }} content={<CustomTooltip />} />
                        <Bar dataKey="count" radius={[6, 6, 6, 6]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="url(#blueGradient)" />
                            ))}
                        </Bar>
                        <defs>
                            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#5E5CE6" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default YearlyStats;
