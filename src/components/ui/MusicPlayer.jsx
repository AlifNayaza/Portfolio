import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function MusicPlayer({ musicData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!musicData?.url) return null;

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const Bar = ({ delay }) => (
    <motion.div
      animate={isPlaying ? { height: [4, 16, 8, 20, 4] } : { height: 2 }}
      transition={{ repeat: Infinity, duration: 1, delay: delay }}
      className="w-[2px] bg-[#9f1239]" // Warna Crimson
    />
  );

  return (
    <div className="fixed bottom-0 left-0 z-50 p-6">
      <audio ref={audioRef} src={musicData.url} loop />
      
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        // Desain Kotak, Border Tegas, Background Hitam
        className="flex items-center gap-4 bg-[#0c0c0c] border border-[#333] p-4 min-w-[200px] shadow-[0_0_30px_rgba(0,0,0,0.8)]"
      >
        {/* Tombol Play Kotak */}
        <button 
            onClick={togglePlay}
            className="w-10 h-10 border border-[#333] flex items-center justify-center text-[#e5e5e5] hover:bg-[#9f1239] hover:border-[#9f1239] hover:text-white transition-all focus:outline-none"
        >
            {isPlaying ? (
                <div className="flex gap-1">
                    <div className="w-1 h-3 bg-current"></div>
                    <div className="w-1 h-3 bg-current"></div>
                </div>
            ) : (
                <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
        </button>

        {/* Info Lagu */}
        <div className="flex flex-col flex-1">
            <span className="text-xs font-display font-bold text-[#e5e5e5] tracking-widest uppercase truncate max-w-[150px]">
                {musicData.title || "UNTITLED TRACK"}
            </span>
            <span className="text-[9px] font-mono text-zinc-500 truncate max-w-[150px] uppercase">
                // {musicData.artist || "UNKNOWN"}
            </span>
        </div>

        {/* Visualizer Minimalis */}
        <div className="flex gap-1 items-end h-5">
            <Bar delay={0} />
            <Bar delay={0.2} />
            <Bar delay={0.4} />
            <Bar delay={0.1} />
        </div>

      </motion.div>
    </div>
  );
}