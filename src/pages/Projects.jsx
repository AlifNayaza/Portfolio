import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion } from "framer-motion";

// --- VARIAN ANIMASI KREATIF ---

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5, // Beri jeda setelah judul muncul
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
}

export default function Projects() {
  const { data } = usePortfolio();
  const headerText = "Battle Records.";
  
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
                TOTAL ENTRIES: {data.projects?.length || 0}
            </motion.div>
        </div>

        <motion.div 
            className="grid grid-cols-1 gap-0"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
        >
            {data.projects?.map((proj, idx) => (
                <motion.div key={idx} variants={creativeFadeInUp}>
                    <Link to={`/project/${idx}`} className="group block border-b border-[#333] hover:bg-[#111] transition-colors py-8">
                        <div className="grid md:grid-cols-12 gap-8 items-center">
                            <div className="md:col-span-1 font-mono text-xs text-zinc-600 group-hover:text-[#9f1239]">
                                {String(idx + 1).padStart(2, '0')}
                            </div>
                            <div className="md:col-span-6">
                                <h3 className="text-2xl font-display text-white mb-2 group-hover:translate-x-2 transition-transform duration-500">
                                    {proj.name}
                                </h3>
                                <p className="text-zinc-500 font-serif text-sm line-clamp-1 italic max-w-md">
                                    {proj.description}
                                </p>
                            </div>
                            <div className="md:col-span-3 font-mono text-xs text-zinc-600 uppercase tracking-wider text-right md:text-left">
                                [ CLASSIFIED DATA ]
                            </div>
                            <div className="md:col-span-2 text-right">
                                 <span className="font-mono text-xs group-hover:text-white text-zinc-600 transition-colors">
                                     OPEN FILE &rarr;
                                 </span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
      </section>
    </PageTransition>
  );
}