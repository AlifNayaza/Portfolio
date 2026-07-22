/* eslint-disable */
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

  const currentTrack = playlist[currentIndex];

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlayingRef.current) {
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

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current && !isNaN(seekTime)) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      if (duration > 0) {
        setProgress((seekTime / duration) * 100);
      }
    }
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
      className="w-1 rounded-full"
      style={{
        background: 'linear-gradient(to top, var(--color-crimson), var(--color-gold))'
      }}
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

  if (!playlist || playlist.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 md:bottom-6 left-4 md:left-6 z-50">
      <audio 
        ref={audioRef} 
        src={currentTrack?.url} 
        onEnded={handleNext} 
      />
      
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div
            key="expanded-player"
            variants={playerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative rounded-2xl p-4 md:p-5 shadow-2xl backdrop-blur-xl w-[300px] md:w-[340px]"
            style={{
              background: `linear-gradient(to bottom right, var(--color-bg), var(--color-bg), var(--color-bg))`,
              border: '1px solid var(--color-border)'
            }}
          >
            {/* Decorative glow */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-50 blur-xl"
              style={{
                background: 'linear-gradient(to right, rgba(159, 18, 57, 0.1), transparent, rgba(194, 65, 12, 0.1))'
              }}
            />

            {/* Close/Minimize button */}
            <motion.button
              onClick={() => setIsMinimized(true)}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-2 -right-2 w-8 h-8 border rounded-full flex items-center justify-center transition-all z-10 shadow-lg"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-muted)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-crimson)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'var(--color-crimson)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg)';
                e.currentTarget.style.color = 'var(--color-muted)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
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
                <div 
                  className="flex gap-1 items-end h-12 w-12 flex-shrink-0 rounded-lg border p-2 justify-center"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)'
                  }}
                >
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
                    className="text-sm md:text-base font-display font-bold truncate"
                    style={{ color: 'var(--color-paper)' }}
                  >
                    {currentTrack?.title || "Untitled Track"}
                  </motion.h3>
                  <motion.p 
                    key={currentTrack?.artist}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs font-mono truncate"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {currentTrack?.artist || "Unknown Artist"}
                  </motion.p>
                  
                  {/* Track count */}
                  {playlist.length > 1 && (
                    <div 
                      className="mt-1 text-[10px] font-mono"
                      style={{ color: 'var(--color-line)' }}
                    >
                      Track {currentIndex + 1} of {playlist.length}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Progress bar & Timeline Slider */}
            <div className="relative z-10 mb-4 group">
              <div 
                className="h-2 rounded-full overflow-hidden relative cursor-pointer"
                style={{ backgroundColor: 'var(--color-border)' }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${progress}%`,
                    background: 'linear-gradient(to right, var(--color-crimson), var(--color-gold))'
                  }}
                />
              </div>
              <input 
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime || 0}
                onChange={handleSeek}
                aria-label="Seek track timeline"
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-20"
              />
              {/* Time stamps */}
              <div 
                className="flex justify-between mt-1 text-[10px] font-mono"
                style={{ color: 'var(--color-muted)' }}
              >
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
                className="w-8 h-8 flex items-center justify-center rounded-full border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-muted)'
                }}
                aria-label="Previous track"
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.borderColor = 'var(--color-crimson)';
                    e.currentTarget.style.color = 'var(--color-paper)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-muted)';
                }}
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
                className="w-14 h-14 flex items-center justify-center rounded-full text-white shadow-lg transition-all relative group"
                aria-label={isPlaying ? "Pause track" : "Play track"}
                style={{
                  background: 'linear-gradient(to right, var(--color-crimson), var(--color-gold))',
                  boxShadow: '0 10px 15px -3px rgba(159, 18, 57, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(159, 18, 57, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(159, 18, 57, 0.3)';
                }}
              >
                {/* Pulse effect when playing */}
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: 'var(--color-crimson)' }}
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
                className="w-8 h-8 flex items-center justify-center rounded-full border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next track"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-muted)'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.borderColor = 'var(--color-crimson)';
                    e.currentTarget.style.color = 'var(--color-paper)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-muted)';
                }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l4.325-3.001a1 1 0 000-1.664L4.555 5.168z" />
                </svg>
              </motion.button>
            </div>

            {/* Decorative corners */}
            <div 
              className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-2xl"
              style={{ borderColor: 'rgba(159, 18, 57, 0.3)' }}
            />
            <div 
              className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-2xl"
              style={{ borderColor: 'rgba(159, 18, 57, 0.3)' }}
            />
            <div 
              className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-2xl"
              style={{ borderColor: 'rgba(159, 18, 57, 0.3)' }}
            />
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-2xl"
              style={{ borderColor: 'rgba(159, 18, 57, 0.3)' }}
            />
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
            className="relative w-16 h-16 md:w-20 md:h-20 border rounded-full flex items-center justify-center shadow-2xl group" 
            style={{
              background: 'linear-gradient(to bottom right, var(--color-bg), var(--color-bg), var(--color-bg))',
              borderColor: 'var(--color-border)'
            }}
            aria-label="Expand player"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: 'linear-gradient(to right, rgba(159, 18, 57, 0.2), rgba(194, 65, 12, 0.2))'
              }}
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
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: 'var(--color-crimson)' }}
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