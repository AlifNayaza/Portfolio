import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import RevealText from "../components/ui/RevealText";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const { data } = usePortfolio();
  const { home, skills } = data;

  return (
    <PageTransition>
      <section className="min-h-[85vh] flex flex-col justify-center relative pl-4 md:pl-16">
        
        <div className="absolute top-0 -left-6 md:-left-12 font-mono text-xs text-[#333] rotate-180 select-none" style={{ writingMode: 'vertical-rl' }}>
            PROLOGUE /// THE BEGINNING
        </div>

        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="font-mono text-xs text-[#9f1239] mb-8 tracking-[0.2em] flex items-center gap-4"
        >
            <span className="w-12 h-[1px] bg-[#9f1239]"></span>
            OPEN TO WORK
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-display leading-[1.1] mb-8 text-[#e5e5e5] max-w-6xl">
           <RevealText 
                text={home?.headline || "The Journey Begins"} 
                type="word"
                delay={1.5}
                className="hover-trigger"
           />
           <span className="text-[#9f1239] animate-pulse">_</span>
        </h1>

        <div className="max-w-2xl relative mt-4">
            <motion.div 
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#333]"
            ></motion.div>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="pl-8 text-lg md:text-xl text-zinc-400 italic font-serif leading-loose break-words"
            >
                "{home?.subtitle || "Loading description..."}"
            </motion.p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            className="mt-16 flex items-center gap-8"
        >
            <Link to="/projects" className="group flex items-center gap-6 hover-trigger">
                <div className="w-16 h-16 border border-[#333] rounded-full flex items-center justify-center group-hover:border-[#9f1239] group-hover:bg-[#9f1239] transition-all duration-500 relative overflow-hidden">
                    <span className="font-mono text-sm relative z-10 group-hover:text-white transition-colors">→</span>
                    <div className="absolute inset-0 bg-[#9f1239] transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full origin-center"></div>
                </div>
                <div className="flex flex-col">
                    <span className="font-mono text-xs tracking-widest text-zinc-500 group-hover:text-white transition-colors">READ CHAPTER II</span>
                    <span className="font-display text-sm text-[#9f1239] opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all">Start Reading</span>
                </div>
            </Link>
        </motion.div>

        <div className="w-full max-w-6xl mx-auto border-t border-[#333] pt-20 mt-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                  <h2 className="text-3xl md:text-4xl font-display mb-2">Arsenal & Abilities<span className="text-[#9f1239]">.</span></h2>
                  <p className="font-serif italic text-zinc-500">List of technologies and proficiency levels mastered.</p>
              </div>
              <div className="font-mono text-xs text-[#9f1239] tracking-widest mt-4 md:mt-0">
                  /// SYSTEM ANALYSIS
              </div>
          </div>
          
          {/* PERBAIKAN: grid-cols-2 untuk mobile (2 card per baris), min-h dan flex untuk card */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {skills?.map((skill, idx) => {
               const skillName = typeof skill === 'string' ? skill : skill.name;
               const skillLevel = typeof skill === 'string' ? "Intermediate" : skill.level;

               let levelScore = 2;
               let levelColor = "text-zinc-500";
               let borderColor = "border-[#333]";
               
               if (skillLevel === "Beginner") { levelScore = 1; levelColor = "text-zinc-500"; }
               if (skillLevel === "Intermediate") { levelScore = 2; levelColor = "text-yellow-600"; }
               if (skillLevel === "Advanced") { levelScore = 3; levelColor = "text-orange-500"; borderColor = "group-hover:border-orange-500/50"; }
               if (skillLevel === "Master") { levelScore = 4; levelColor = "text-[#9f1239]"; borderColor = "group-hover:border-[#9f1239]"; }

               return (
                  <div 
                    key={idx} 
                    className={`group bg-[#0c0c0c] border border-[#333] ${borderColor} p-3 md:p-6 transition-all duration-500 hover:bg-[#111] relative overflow-hidden min-h-[160px] md:min-h-[180px] flex flex-col`}
                  >
                      
                      {/* Nomor Background - Ukuran lebih kecil di mobile */}
                      <div className="absolute -right-1 -top-1 md:-right-4 md:-top-6 text-[50px] md:text-[100px] font-display text-[#1a1a1a] opacity-50 group-hover:opacity-100 transition-opacity select-none pointer-events-none">
                          {idx + 1}
                      </div>

                      <div className="relative z-10 flex flex-col h-full">
                          {/* PERBAIKAN: Ukuran font lebih kecil di mobile, break-words untuk teks panjang */}
                          <h3 className="text-base sm:text-lg md:text-2xl font-display font-bold text-[#e5e5e5] mb-2 md:mb-3 group-hover:translate-x-2 transition-transform break-words hyphens-auto leading-tight">
                              {skillName}
                          </h3>
                          
                          <div className="w-8 md:w-12 h-[1px] bg-[#333] group-hover:w-full group-hover:bg-[#9f1239] transition-all duration-700 my-2 md:my-3"></div>

                          {/* PERBAIKAN: mt-auto untuk push ke bawah, gap lebih kecil di mobile */}
                          <div className="flex flex-col gap-2 md:gap-3 mt-auto">
                              {/* Level Text - Ukuran font disesuaikan */}
                              <div className="flex flex-col">
                                  <span className="font-mono text-[8px] md:text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Rank</span>
                                  <span className={`font-mono text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider ${levelColor} break-words`}>
                                      {skillLevel}
                                  </span>
                              </div>

                              {/* Diamond Indicators - Ukuran lebih kecil di mobile */}
                              <div className="flex gap-1 md:gap-1.5 flex-wrap">
                                  {[1, 2, 3, 4].map((diamond) => (
                                      <span 
                                        key={diamond} 
                                        className={`text-xs md:text-sm transition-all duration-300 transform ${diamond <= levelScore ? `${levelColor} scale-110` : "text-[#222]"}`}
                                      >
                                          ◆
                                      </span>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
               )
            })}
          </div>
        </div>

      </section>
    </PageTransition>
  );
}