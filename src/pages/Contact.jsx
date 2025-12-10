import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion } from "framer-motion";

// Varian animasi (tidak berubah)
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2
    },
  },
};

const titleContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
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


export default function Contact() {
  const { data } = usePortfolio();
  const { contact } = data;

  // --- PERBAIKAN DI SINI: Kembali ke satu string utuh ---
  const headerText = "Send A Signal";

  const socialLinks = contact 
    ? Object.entries(contact).filter(([key, value]) => key !== 'email' && value) 
    : [];

  return (
    <PageTransition>
      <motion.section 
        className="min-h-[70vh] flex flex-col justify-center items-center text-center relative px-6 overflow-hidden"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        
        <motion.div variants={creativeFadeInUp} className="font-mono text-xs text-[#9f1239] mb-4 tracking-[0.3em] uppercase">
            // End of Line
        </motion.div>

        {/* --- BAGIAN YANG DIPERBARUI DENGAN LOGIKA BARU --- */}
        <motion.h1 
            className="text-5xl md:text-7xl font-display mb-8"
            variants={titleContainer}
        >
            {/* Split string menjadi array karakter */}
            {headerText.split('').map((char, index) => (
              <motion.span
                key={index}
                variants={titleLetter}
                // Render spasi sebagai spasi literal, bukan karakter kosong
                // Ini memungkinkan browser untuk melakukan word wrapping secara alami
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
            
            <motion.span 
                variants={titleLetter}
                className="text-[#9f1239] animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                _
            </motion.span>
        </motion.h1>
        
        <motion.p variants={creativeFadeInUp} className="font-serif text-zinc-400 italic mb-12 max-w-xl">
            The story doesn’t end here. Want to create something together? Send a message and let’s start building it.
        </motion.p>

        {contact?.email && (
            <motion.a 
                variants={creativeFadeInUp}
                href={`mailto:${contact.email}`} 
                // Tambahkan 'break-all' untuk menangani email panjang di mobile
                className="text-2xl md:text-4xl font-mono border-b border-[#333] pb-2 hover:border-[#9f1239] hover:text-[#9f1239] transition-all break-all"
            >
                {contact.email}
            </motion.a>
        )}

        {socialLinks.length > 0 && (
            <motion.div 
                variants={creativeFadeInUp} 
                className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 font-mono text-xs tracking-widest"
            >
                {socialLinks.map(([key, url]) => (
                    <a 
                        key={key} 
                        href={url} 
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white text-zinc-600 transition-colors"
                    >
                        [ {key.toUpperCase()} ]
                    </a>
                ))}
            </motion.div>
        )}

      </motion.section>
    </PageTransition>
  );
}