import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Helper komponen untuk ikon (tidak berubah)
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);

// Ini adalah path ke DASHBOARD ADMIN, bukan halaman login.
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/adomin";

export default function Login() {
  const [input, setInput] = useState("");
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!input) return;
    localStorage.setItem("admin_session", input);
    // --- PERBAIKAN LOGIKA UTAMA DI SINI ---
    // Setelah login, arahkan ke path dashboard admin yang sebenarnya.
    navigate(ADMIN_PATH);
  };

  const toggleKeyVisibility = () => {
    setIsKeyVisible(!isKeyVisible);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut", delay: 0.2 }}
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-white p-4">
      <motion.div className="w-full max-w-sm relative" variants={formVariants} initial="hidden" animate="visible">
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-[#333]"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-[#333]"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-[#333]"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-[#333]"></div>
        
        <form onSubmit={handleLogin} className="w-full bg-[#0c0c0c] p-8 md:p-10 border border-[#333] flex flex-col items-center">
          <motion.div className="text-4xl text-[#9f1239] mb-4" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            §
          </motion.div>
          <h1 className="text-xl font-display mb-8 text-center uppercase tracking-widest">Archivist's Keyhole</h1>
          
          <div className="relative w-full mb-10">
            <input 
              type={isKeyVisible ? "text" : "password"} 
              placeholder="SECRET KEY" 
              className="w-full bg-transparent border-b border-[#333] p-3 pr-10 text-center font-mono tracking-[0.3em] text-sm focus:border-[#9f1239] focus:outline-none transition-colors"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="button" onClick={toggleKeyVisibility} className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 hover:text-white transition-colors" aria-label="Toggle password visibility">
              {isKeyVisible ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          
          <button type="submit" className="w-full font-mono text-xs text-zinc-500 tracking-widest py-3 border border-[#333] hover:border-[#9f1239] hover:text-white hover:bg-[#9f1239]/10 transition-all duration-300">
            [ UNSEAL THE ARCHIVE ]
          </button>
        </form>
      </motion.div>
    </div>
  );
}