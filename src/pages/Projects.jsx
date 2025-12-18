import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion } from "framer-motion";

// Varian animasi
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

const titleContainer = {
  hidden: { opacity: 0 },
  show: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: i * 0.05 },
  }),
};

const titleLetter = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const creativeFadeInUp = {
  hidden: { opacity: 0, y: 60, skewY: 5 },
  show: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.8, ease: "circOut" },
  },
};

const lineWipe = {
  hidden: { scaleX: 0, originX: 0 },
  show: { scaleX: 1, originX: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
};

export default function Projects() {
  const { data, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="font-display text-xl tracking-[0.5em] animate-pulse text-white">
          LOADING ARCHIVES...
        </div>
      </div>
    );
  }

  const headerText = "Battle Records.";
  const projects = data?.projects || [];
  
  return (
    <PageTransition>
      <section className="py-20 pl-4 md:pl-16 relative overflow-hidden">
        <div className="absolute top-20 -left-6 md:-left-12 font-mono text-xs text-[#333] rotate-180" style={{ writingMode: 'vertical-rl' }}>
          CHAPTER II /// THE ARCHIVE
        </div>

        <div className="mb-16 pb-8 flex flex-col md:flex-row justify-between items-end gap-4 relative">
          <motion.div 
            className="absolute bottom-0 left-0 w-full h-[1px] bg-[#333]"
            variants={lineWipe}
            initial="hidden"
            animate="show"
          />
          <motion.div initial="hidden" animate="show" variants={creativeFadeInUp}>
            <motion.h1 
              className="text-4xl md:text-6xl font-display mb-2"
              variants={titleContainer}
            >
              {headerText.split('').map((char, index) => (
                <motion.span key={index} variants={titleLetter} className={char === '.' ? 'text-[#9f1239]' : ''}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>
            <p className="font-serif italic text-zinc-500">A collection of completed projects.</p>
          </motion.div>
          <motion.div 
            className="font-mono text-xs text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            TOTAL ENTRIES: {projects.length}
          </motion.div>
        </div>

        {/* Empty State */}
        {projects.length === 0 ? (
          <motion.div 
            className="text-center py-20 border border-dashed border-[#333] rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="font-mono text-xs text-zinc-600 tracking-widest mb-2">
              [ NO ARCHIVES FOUND ]
            </div>
            <p className="text-zinc-500 font-serif italic">
              The chronicles are yet to be written...
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-0"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {projects.map((proj, idx) => (
              <motion.div key={idx} variants={creativeFadeInUp}>
                <Link to={`/project/${idx}`} className="group block border-b border-[#333] hover:bg-[#111] transition-colors py-6 md:py-8">
                  <div className="flex justify-between items-center gap-4">
                    
                    {/* KIRI: Konten Utama */}
                    <div className="flex-1 flex items-start gap-4 md:gap-8">
                      {/* Nomor Indeks */}
                      <div className="font-mono text-xs md:text-sm text-zinc-600 group-hover:text-[#9f1239] pt-1.5 md:pt-1 transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      {/* Judul, Deskripsi, dan Technologies */}
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-display text-white mb-1 md:mb-2 group-hover:translate-x-2 transition-transform duration-500">
                          {proj.name}
                        </h3>
                        <p className="text-zinc-500 font-serif text-sm line-clamp-1 italic max-w-md mb-3">
                          {proj.description}
                        </p>
                        
                        {/* Technologies - Tampil di semua ukuran layar */}
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {proj.technologies.slice(0, 4).map((tech, techIdx) => (
                              <span
                                key={techIdx}
                                className="inline-flex items-center px-2 py-1 bg-[#0c0c0c] border border-[#333] text-zinc-500 font-mono text-[10px] rounded-sm group-hover:border-[#9f1239]/30 transition-colors"
                              >
                                <span className="w-1 h-1 bg-[#9f1239] rounded-full mr-1.5"></span>
                                {tech}
                              </span>
                            ))}
                            {proj.technologies.length > 4 && (
                              <span className="inline-flex items-center px-2 py-1 text-zinc-600 font-mono text-[10px]">
                                +{proj.technologies.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Metadata Desktop */}
                        <div className="hidden md:block font-mono text-xs text-zinc-600 uppercase tracking-wider mt-4">
                          [ CLASSIFIED DATA ]
                        </div>
                      </div>
                    </div>

                    {/* KANAN: Tombol Aksi */}
                    <div className="flex-shrink-0 pl-2">
                      <span className="font-mono text-xs group-hover:text-white text-zinc-600 transition-colors">
                        OPEN FILE &rarr;
                      </span>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </PageTransition>
  );
}