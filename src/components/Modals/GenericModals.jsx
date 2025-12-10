// Basic modal for alerts or lists
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const InfoModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="glass-card p-8 max-w-sm text-center bg-[#111]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-gray-300 mb-6">{message}</p>
                    <button onClick={onClose} className="px-6 py-2 bg-ios-blue text-white rounded-full font-medium hover:bg-ios-blue/80 transition-colors">
                        Close
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export const ListModal = ({ isOpen, onClose, title, items, renderItem }) => {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="glass-card w-full max-w-2xl max-h-[80vh] bg-[#111] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white">{title}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
                        {items.map((item, idx) => renderItem(item, idx))}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
