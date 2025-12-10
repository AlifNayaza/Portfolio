import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ home }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Tutup menu saat pindah halaman
  useEffect(() => setIsOpen(false), [location]);

  // Kunci scroll saat menu mobile terbuka
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  const links = [
    { name: "Prologue", path: "/", label: "Home" },
    { name: "Chapter I", path: "/about", label: "Character" },
    { name: "Chapter II", path: "/projects", label: "Battles" },
    { name: "Epilogue", path: "/contact", label: "Signal" },
  ];

  const brandName = home?.logoName || "Author";

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#0c0c0c]/95 backdrop-blur-sm border-b border-[#333] h-20 flex items-center transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex justify-between items-center">
          
          {/* LOGO */}
          <NavLink to="/" className="font-display font-bold text-xl tracking-widest text-white z-[60] group relative">
            <span className="text-[#9f1239] group-hover:mr-2 transition-all duration-500">§</span>
            {brandName.toUpperCase()}
          </NavLink>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-12 font-mono text-xs tracking-widest">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `group relative py-2 transition-colors ${isActive ? "text-[#9f1239]" : "text-zinc-500 hover:text-white"}`
                }
              >
                <span className="block opacity-50 text-[9px]">{link.name}</span>
                <span className="font-bold">{link.label}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#9f1239] transition-all group-hover:w-full"></span>
              </NavLink>
            ))}
          </div>

          {/* MOBILE TOGGLE BUTTON (Z-Index Tinggi) */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-white z-[60] font-mono text-xs border border-[#333] px-3 py-1 hover:bg-[#111] transition-colors"
          >
             {isOpen ? "[ CLOSE X ]" : "[ MENU + ]"}
          </button>

        </div>
      </nav>

      {/* MOBILE MENU OVERLAY (FULL SCREEN & SOLID BLACK) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            // KUNCI PERBAIKAN: fixed inset-0, bg-[#0c0c0c] (Solid), z-[55] (Di atas konten, di bawah tombol menu)
            className="fixed inset-0 z-[55] bg-[#0c0c0c] flex flex-col items-center justify-center w-full h-screen"
          >
            {/* Garis Dekorasi */}
            <div className="absolute top-0 left-6 bottom-0 w-[1px] bg-[#222]"></div>
            <div className="absolute top-0 right-6 bottom-0 w-[1px] bg-[#222]"></div>

            <div className="flex flex-col gap-8 w-full max-w-xs z-10">
                <div className="text-center font-mono text-xs text-[#9f1239] tracking-[0.3em] mb-4">
                    /// TABLE OF CONTENTS
                </div>

                {links.map((link, i) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => 
                      `text-center group border-b border-[#222] pb-4 transition-all ${isActive ? "text-[#9f1239]" : "text-zinc-500"}`
                    }
                  >
                    <span className="block font-mono text-[10px] tracking-[0.2em] mb-1 group-hover:text-white transition-colors">
                        0{i} // {link.name}
                    </span>
                    <span className="font-display text-3xl group-hover:tracking-widest transition-all duration-500 text-[#e5e5e5]">
                        {link.label}
                    </span>
                  </NavLink>
                ))}
            </div>
            
            <div className="absolute bottom-10 font-mono text-[10px] text-zinc-700">
                CHRONICLES SYSTEM V.1.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}