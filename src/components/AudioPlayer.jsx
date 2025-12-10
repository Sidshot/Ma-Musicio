import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showWarning, setShowWarning] = useState(true);
    const audioRef = useRef(null);

    useEffect(() => {
        // Attempt autoplay on mount
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            // Try unmuted first
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    console.log("Autoplay blocked:", error);
                    // Fallback to muted
                    audioRef.current.muted = true;
                    setIsMuted(true);
                    audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Still blocked", e));
                });
            }
        }

        // Auto-dismiss warning after 5 seconds
        const timer = setTimeout(() => {
            setShowWarning(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleYes = () => {
        // User says "Yes" -> Logic: "Keep music on" (As requested)
        setShowWarning(false);
        if (audioRef.current) {
            audioRef.current.muted = false; // Unmute if it was muted
            setIsMuted(false);
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleNo = () => {
        // User says "No" -> Logic: "Turn off" (As requested)
        setShowWarning(false);
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <>
            {/* Floating Player */}
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 glass-card p-2 rounded-full shadow-2xl border-white/20">
                <audio ref={audioRef} src="./background-music.flac" loop />

                <button
                    onClick={togglePlay}
                    className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>

                <button
                    onClick={toggleMute}
                    className="p-3 bg-transparent text-gray-400 hover:text-white transition-colors"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>

            {/* Warning Dialog */}
            <AnimatePresence>
                {showWarning && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center pb-24 pointer-events-none">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="glass-card p-6 bg-[#1c1c1e]/90 pointer-events-auto flex flex-col items-center gap-4 border border-ios-blue/30 shadow-2xl max-w-sm mx-4"
                        >
                            <p className="text-white font-medium text-center text-lg">Want me to turn off the song?</p>
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={handleYes} // Yes -> Keep On
                                    className="flex-1 py-3 bg-ios-blue text-white font-bold rounded-xl active:scale-95 transition-transform"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={handleNo} // No -> Turn Off
                                    className="flex-1 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 active:scale-95 transition-all"
                                >
                                    No
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AudioPlayer;
