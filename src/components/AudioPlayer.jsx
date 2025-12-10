import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Attempt autoplay on mount
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            // FLAC support depends on browser, but modern ones support it.
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    console.log("Autoplay prevented by browser:", error);
                    // Try muting and playing (browser policy usually allows muted autoplay)
                    audioRef.current.muted = true;
                    setIsMuted(true);
                    audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Still blocked", e));
                });
            }
        }
    }, []);

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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 glass-card p-2 rounded-full shadow-2xl border-white/20">
            <audio ref={audioRef} src="/background-music.flac" loop />

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
    );
};

export default AudioPlayer;
