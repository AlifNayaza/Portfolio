import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

export default function About() {
  const { data } = usePortfolio();
  const { profile, experience } = data;
  
  // State untuk menangani status Zoom Gambar
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <PageTransition>
      <section className="py-20 pl-4 md:pl-16 relative">
        
        {/* Chapter Marker */}
        <div className="absolute top-20 -left-6 md:-left-12 font-mono text-xs text-[#333] rotate-180 select-none" style={{ writingMode: 'vertical-rl' }}>
            CHAPTER I /// THE CHARACTER
        </div>

        <div className="grid md:grid-cols-12 gap-16">
            
            {/* --- LEFT: AVATAR (CLICKABLE) --- */}
            <div className="md:col-span-5 relative">
                <div 
                    className="aspect-[3/4] border border-[#333] p-2 relative group cursor-zoom-in"
                    onClick={() => setIsZoomed(true)} // Trigger Zoom
                >
                    {/* Dekorasi Frame Sudut */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#9f1239] transition-all group-hover:w-full group-hover:h-full"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#9f1239] transition-all group-hover:w-full group-hover:h-full"></div>
                    
                    {/* Overlay Hover Text */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                        <span className="font-mono text-xs text-white tracking-widest border border-white px-3 py-1">
                            [ INSPECT ]
                        </span>
                    </div>

                    {profile?.avatarUrl ? (
                        <img 
                            src={profile.avatarUrl} 
                            alt="Portrait" 
                            className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700" 
                        />
                    ) : (
                        <div className="w-full h-full bg-[#111] flex items-center justify-center font-mono text-xs">NO PORTRAIT</div>
                    )}
                </div>
                
                <div className="mt-4 flex justify-between font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                    <span>Fig. 01</span>
                    <span>Character</span>
                </div>
            </div>

            {/* --- RIGHT: NARRATIVE TEXT --- */}
            <div className="md:col-span-7">
                <h1 className="text-4xl md:text-5xl font-display mb-8">Background Story<span className="text-[#9f1239]">.</span></h1>
                
                <div className="prose prose-invert prose-lg text-zinc-400 font-serif leading-loose">
                    <p>
                        <span className="float-left text-6xl font-display pr-4 pt-2 text-white">
                            {profile?.about?.charAt(0) || "I"}
                        </span>
                        {profile?.about?.slice(1) || "Belum ada cerita yang ditulis."}
                    </p>
                </div>

                <div className="mt-16">
                    <h2 className="font-mono text-xs text-[#9f1239] uppercase tracking-[0.2em] mb-8 border-b border-[#333] pb-4 inline-block">
                        Timeline of Events
                    </h2>
                    <div className="space-y-12 border-l border-[#333] pl-8 relative">
                        {experience?.map((exp, idx) => (
                            <div key={idx} className="relative group">
                                <span className="absolute -left-[37px] top-1 w-4 h-4 bg-[#0c0c0c] border border-[#333] group-hover:border-[#9f1239] rounded-full flex items-center justify-center transition-colors">
                                    <span className="w-1 h-1 bg-[#9f1239] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                </span>
                                <span className="font-mono text-xs text-zinc-500 mb-1 block">{exp.year}</span>
                                <h3 className="text-xl font-display text-white">{exp.role}</h3>
                                <p className="text-zinc-500 italic font-serif text-sm mt-1">{exp.company}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>

        {/* --- LIGHTBOX (MODAL ZOOM) --- */}
        <AnimatePresence>
            {isZoomed && profile?.avatarUrl && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] bg-[#0c0c0c]/95 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
                    onClick={() => setIsZoomed(false)} // Klik background untuk close
                >
                    {/* Close Button */}
                    <button className="absolute top-8 right-8 font-mono text-xs text-[#9f1239] hover:text-white border border-transparent hover:border-[#9f1239] px-4 py-2 transition-all">
                        [ CLOSE VIEW ]
                    </button>

                    {/* Image Container */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="relative max-w-full max-h-screen"
                        onClick={(e) => e.stopPropagation()} // Agar klik gambar tidak menutup modal
                    >
                        <img 
                            src={profile.avatarUrl} 
                            alt="Full Portrait" 
                            className="max-h-[80vh] w-auto border-2 border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                        />
                        
                        {/* Technical Label */}
                        <div className="absolute -bottom-8 left-0 text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
                            /// ORIGINAL FILE : SOURCE_IMG_01.JPG
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

      </section>
    </PageTransition>
  );
}