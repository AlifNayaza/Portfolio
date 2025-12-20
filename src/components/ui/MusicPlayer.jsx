import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MusicPlayer({ playlist }) { 
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  if (!playlist || playlist.length === 0) {
    return null;
  }

  const currentTrack = playlist[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Auto-play was prevented:", e));
      }
    }
  }, [currentIndex, playlist]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Animated visualizer bars
  const VisualizerBar = ({ delay, index }) => (
    <motion.div
      animate={isPlaying ? { 
        height: ["20%", "80%", "40%", "90%", "20%"],
        opacity: [0.3, 1, 0.5, 1, 0.3]
      } : { 
        height: "20%",
        opacity: 0.3
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5, 
        delay: delay, 
        ease: "easeInOut" 
      }}
      className="w-1 bg-gradient-to-t from-[#9f1239] to-[#c2410c] rounded-full"
    />
  );

  const playerVariants = {
    hidden: { y: 120, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
    exit: { 
      y: 120, 
      opacity: 0, 
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  return (
    <div className="fixed bottom-4 md:bottom-6 left-4 md:left-6 z-50">
      <audio 
        ref={audioRef} 
        src={currentTrack?.url} 
        onEnded={handleNext} 
        key={currentTrack?.url} 
      />
      
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div
            key="expanded-player"
            variants={playerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-gradient-to-br from-[#0c0c0c] via-[#0a0a0a] to-[#0c0c0c] border border-[#333] rounded-2xl p-4 md:p-5 shadow-2xl backdrop-blur-xl w-[300px] md:w-[340px]"
          >
            {/* Decorative glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#9f1239]/10 via-transparent to-[#c2410c]/10 opacity-50 blur-xl" />

            {/* Close/Minimize button */}
            <motion.button
              onClick={() => setIsMinimized(true)}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-[#0c0c0c] border border-[#333] rounded-full flex items-center justify-center text-zinc-500 hover:bg-[#9f1239] hover:text-white hover:border-[#9f1239] transition-all z-10 shadow-lg"
              aria-label="Minimize player"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            {/* Track info with visualizer */}
            <div className="relative z-10 mb-4">
              <div className="flex items-center gap-4">
                {/* Visualizer */}
                <div className="flex gap-1 items-end h-12 w-12 flex-shrink-0 bg-[#0a0a0a] rounded-lg border border-[#333] p-2 justify-center">
                  <VisualizerBar delay={0} index={0} />
                  <VisualizerBar delay={0.1} index={1} />
                  <VisualizerBar delay={0.2} index={2} />
                  <VisualizerBar delay={0.3} index={3} />
                  <VisualizerBar delay={0.15} index={4} />
                </div>

                {/* Track details */}
                <div className="flex-1 min-w-0">
                  <motion.h3 
                    key={currentTrack?.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm md:text-base font-display font-bold text-white truncate"
                  >
                    {currentTrack?.title || "Untitled Track"}
                  </motion.h3>
                  <motion.p 
                    key={currentTrack?.artist}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs font-mono text-zinc-500 truncate"
                  >
                    {currentTrack?.artist || "Unknown Artist"}
                  </motion.p>
                  
                  {/* Track count */}
                  {playlist.length > 1 && (
                    <div className="mt-1 text-[10px] font-mono text-zinc-700">
                      Track {currentIndex + 1} of {playlist.length}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative z-10 mb-4">
              <div className="h-1 bg-[#222] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#9f1239] to-[#c2410c]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              {/* Time stamps */}
              <div className="flex justify-between mt-1 text-[10px] font-mono text-zinc-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="relative z-10 flex items-center justify-center gap-3">
              {/* Previous */}
              <motion.button
                onClick={handlePrev}
                disabled={playlist.length <= 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#333] text-zinc-500 hover:text-white hover:border-[#9f1239] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14.832V5.168a1 1 0 00-1.555-.832L4.12 8.168a1 1 0 000 1.664l4.325 3.001z" />
                </svg>
              </motion.button>

              {/* Play/Pause */}
              <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#9f1239] to-[#c2410c] text-white shadow-lg shadow-[#9f1239]/30 hover:shadow-[#9f1239]/50 transition-all relative group"
              >
                {/* Pulse effect when playing */}
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#9f1239]"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                
                {isPlaying ? (
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-white rounded-full"></div>
                    <div className="w-1 h-4 bg-white rounded-full"></div>
                  </div>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </motion.button>

              {/* Next */}
              <motion.button
                onClick={handleNext}
                disabled={playlist.length <= 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#333] text-zinc-500 hover:text-white hover:border-[#9f1239] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l4.325-3.001a1 1 0 000-1.664L4.555 5.168z" />
                </svg>
              </motion.button>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#9f1239]/30 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#9f1239]/30 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#9f1239]/30 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#9f1239]/30 rounded-br-2xl" />
          </motion.div>
        ) : (
          <motion.button 
            key="minimized-player" 
            onClick={() => setIsMinimized(false)}
            variants={playerVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#0c0c0c] via-[#0a0a0a] to-[#0c0c0c] border border-[#333] rounded-full flex items-center justify-center shadow-2xl group" 
            aria-label="Expand player"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9f1239]/20 to-[#c2410c]/20 blur-xl"
              animate={{ 
                scale: isPlaying ? [1, 1.2, 1] : 1,
                opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.3
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Visualizer */}
            <div className="relative z-10 flex gap-1 items-end h-6">
              <VisualizerBar delay={0} />
              <VisualizerBar delay={0.15} />
              <VisualizerBar delay={0.3} />
              <VisualizerBar delay={0.1} />
            </div>

            {/* Ripple when playing */}
            {isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#9f1239]"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}