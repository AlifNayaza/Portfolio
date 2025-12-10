import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mengganti nama prop menjadi 'playlist' agar lebih sesuai
export default function MusicPlayer({ playlist }) { 
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const audioRef = useRef(null);

  // Kondisi render sekarang menggunakan 'playlist'
  if (!playlist || playlist.length === 0) {
      return null;
  }

  const currentTrack = playlist[currentIndex];

  useEffect(() => {
    // Saat lagu berganti, pastikan audioRef dimuat ulang
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load(); // Penting untuk memuat sumber audio baru
        if (isPlaying) {
            // Coba putar otomatis, tangani error jika browser memblokir
            audioRef.current.play().catch(e => console.error("Auto-play was prevented:", e));
        }
    }
  }, [currentIndex, playlist]); // Tambahkan playlist sebagai dependency

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

  const Bar = ({ delay }) => (
    <motion.div
      animate={isPlaying ? { height: [4, 16, 8, 20, 4] } : { height: 2 }}
      transition={{ repeat: Infinity, duration: 1.2, delay: delay, ease: "easeInOut" }}
      className="w-[3px] bg-[#9f1239]"
    />
  );

  const playerVariants = {
    hidden: { y: 120, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "circOut" } },
    exit: { y: 120, opacity: 0, transition: { duration: 0.4, ease: "circIn" } }
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 p-4 md:p-6">
      {/* 'key' ditambahkan agar React me-render ulang elemen audio saat lagu berubah */}
      <audio ref={audioRef} src={currentTrack?.url} onEnded={handleNext} key={currentTrack?.url} />
      
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div
            key="expanded-player"
            variants={playerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center gap-3 bg-[#0c0c0c] border border-[#333] p-4 min-w-[280px] shadow-[0_0_30px_rgba(0,0,0,0.8)] relative"
          >
            <button
              onClick={() => setIsMinimized(true)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-[#111] border border-[#333] rounded-full flex items-center justify-center text-zinc-500 hover:bg-[#9f1239] hover:text-white hover:border-[#9f1239] transition-all"
              aria-label="Minimize player"
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            <div className="flex items-center gap-2">
                <button onClick={handlePrev} disabled={playlist.length <= 1} className="text-zinc-500 hover:text-white disabled:opacity-30 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14.832V5.168a1 1 0 00-1.555-.832L4.12 8.168a1 1 0 000 1.664l4.325 3.001zM15.89 8.168a1 1 0 000 1.664l4.324 3.001a1 1 0 001.555-.832V5.168a1 1 0 00-1.555-.832L15.89 8.168z" /></svg>
                </button>
                <button onClick={togglePlay} className="w-10 h-10 border border-[#333] flex-shrink-0 flex items-center justify-center text-[#e5e5e5] hover:bg-[#9f1239] hover:border-[#9f1239] hover:text-white transition-all focus:outline-none">
                    {isPlaying ? <div className="flex gap-1"><div className="w-1 h-3 bg-current"></div><div className="w-1 h-3 bg-current"></div></div> : <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                </button>
                <button onClick={handleNext} disabled={playlist.length <= 1} className="text-zinc-500 hover:text-white disabled:opacity-30 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.11 14.832A1 1 0 005.665 16V4a1 1 0 00-1.555-.832L-.11 7.168a1 1 0 000 1.664l4.22 2.999zM11.555 7.168a1 1 0 00-1.555.832v9.664a1 1 0 001.555.832l4.324-3.001a1 1 0 000-1.664l-4.324-3.001z" /></svg>
                </button>
            </div>
            
            <div className="flex-1 flex items-center gap-3 overflow-hidden">
                <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-xs font-display font-bold text-[#e5e5e5] tracking-widest uppercase truncate max-w-[150px]">
                        {currentTrack?.title || "UNTITLED TRACK"}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 truncate max-w-[150px] uppercase">
                        // {currentTrack?.artist || "UNKNOWN"}
                    </span>
                </div>
                <div className="flex gap-1 items-end h-5">
                    <Bar delay={0} /><Bar delay={0.2} /><Bar delay={0.4} /><Bar delay={0.1} />
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.button key="minimized-player" onClick={() => setIsMinimized(false)} variants={playerVariants} initial="hidden" animate="visible" exit="exit" className="w-16 h-16 bg-[#0c0c0c] border border-[#333] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] cursor-pointer group" aria-label="Expand player">
            <div className="flex gap-1.5 items-end h-5 transition-transform group-hover:scale-110">
                <Bar delay={0} /><Bar delay={0.2} /><Bar delay={0.4} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}