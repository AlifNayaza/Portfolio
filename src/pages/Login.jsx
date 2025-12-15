import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

// Helper komponen untuk ikon
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

// Path ke dashboard admin
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/adomin";
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

export default function Login() {
  const [input, setInput] = useState("");
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!input) {
      toast.error("Please enter the secret key.");
      return;
    }

    setLoading(true);
    
    // Simulasi delay untuk UX yang lebih baik
    await new Promise(resolve => setTimeout(resolve, 600));

    // Validasi password jika ADMIN_SECRET di-set
    if (ADMIN_SECRET && input !== ADMIN_SECRET) {
      toast.error("INCORRECT KEY. ACCESS DENIED.");
      setInput("");
      setLoading(false);
      return;
    }

    // Simpan session berdasarkan pilihan "Remember Me"
    if (rememberMe) {
      localStorage.setItem("admin_session", input);
      // Hapus dari sessionStorage jika ada
      sessionStorage.removeItem("admin_session");
    } else {
      sessionStorage.setItem("admin_session", input);
      // Hapus dari localStorage jika ada
      localStorage.removeItem("admin_session");
    }

    toast.success("ACCESS GRANTED.");
    setLoading(false);
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
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay fixed top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-[0.03]"></div>
      
      {/* Vignette effect */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none"></div>

      <motion.div 
        className="w-full max-w-sm relative z-10" 
        variants={formVariants} 
        initial="hidden" 
        animate="visible"
      >
        {/* Decorative corners */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-[#333]"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-[#333]"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-[#333]"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-[#333]"></div>
        
        <form onSubmit={handleLogin} className="w-full bg-[#0c0c0c]/90 backdrop-blur-sm p-8 md:p-10 border border-[#333] flex flex-col items-center shadow-2xl">
          {/* Logo with pulse animation */}
          <motion.div 
            className="text-4xl text-[#9f1239] mb-4" 
            animate={{ opacity: [0.5, 1, 0.5] }} 
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            §
          </motion.div>
          
          <h1 className="text-xl font-display mb-2 text-center uppercase tracking-widest">
            Archivist's Keyhole
          </h1>
          <p className="font-mono text-[10px] text-zinc-600 tracking-widest mb-8">
            AUTHORIZED ACCESS ONLY
          </p>
          
          {/* Password Input */}
          <div className="relative w-full mb-6">
            <input 
              type={isKeyVisible ? "text" : "password"} 
              placeholder="SECRET KEY" 
              className="w-full bg-transparent border-b border-[#333] p-3 pr-10 text-center font-mono tracking-[0.3em] text-sm focus:border-[#9f1239] focus:outline-none transition-colors placeholder:text-zinc-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button 
              type="button" 
              onClick={toggleKeyVisibility} 
              className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 hover:text-white transition-colors"
              aria-label="Toggle password visibility"
              disabled={loading}
            >
              {isKeyVisible ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 mb-8 w-full justify-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="w-3.5 h-3.5 bg-transparent border border-[#333] rounded-sm checked:bg-[#9f1239] checked:border-[#9f1239] focus:ring-1 focus:ring-[#9f1239] focus:ring-offset-0 cursor-pointer"
            />
            <label 
              htmlFor="rememberMe" 
              className="font-mono text-[10px] text-zinc-500 tracking-wider cursor-pointer select-none hover:text-zinc-400 transition-colors"
            >
              REMEMBER ME ON THIS DEVICE
            </label>
          </div>
          
          {/* Submit Button */}
          <motion.button 
            type="submit"
            disabled={loading || !input}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full font-mono text-xs text-zinc-500 tracking-widest py-3 border border-[#333] hover:border-[#9f1239] hover:text-white hover:bg-[#9f1239]/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                VERIFYING...
              </span>
            ) : (
              "[ UNSEAL THE ARCHIVE ]"
            )}
          </motion.button>

          {/* Footer hint */}
          <p className="font-mono text-[9px] text-zinc-700 mt-6 text-center">
            Lost your key? Contact the administrator.
          </p>
        </form>

        {/* Decorative glow */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#9f1239]/5 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
}