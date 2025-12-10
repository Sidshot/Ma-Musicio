import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
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
            if (showWarning) setShowWarning(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleYes = () => {
        // User says "Yes" to "want me to play something for you?" -> YES = PLAY
        setShowWarning(false);
        if (audioRef.current) {
            audioRef.current.muted = false;
            audioRef.current.volume = 1.0;
            setIsMuted(false);

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => setIsPlaying(true))
                    .catch(e => console.error("Play failed:", e));
            }
        }
    };

    const handleNo = () => {
        // User says "No" to "want me to play something for you?" -> NO = STOP/PAUSE
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

            {/* Warning Dialog - Centered and Bigger */}
            <AnimatePresence>
                {showWarning && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card p-10 bg-[#1c1c1e]/95 pointer-events-auto flex flex-col items-center gap-6 border border-ios-blue/30 shadow-2xl w-full max-w-lg"
                        >
                            <h3 className="text-2xl font-bold text-white text-center">want me to play something for you</h3>
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={handleYes} // Yes -> Play
                                    className="flex-1 py-4 bg-ios-blue text-white font-bold text-lg rounded-2xl active:scale-95 transition-transform shadow-lg shadow-ios-blue/20"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={handleNo} // No -> Stop
                                    className="flex-1 py-4 bg-white/10 text-white font-medium text-lg rounded-2xl hover:bg-white/20 active:scale-95 transition-all"
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
