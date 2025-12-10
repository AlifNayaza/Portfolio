import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Ambil path rahasia dari env
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

export default function Login() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simpan password ke LocalStorage (anggap ini sebagai sesi)
    // Keamanan sebenarnya tetap ada di Backend (Netlify Functions) yang akan menolak jika password salah
    localStorage.setItem("admin_session", input);
    
    // Arahkan ke dashboard rahasia
    navigate(ADMIN_PATH);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center font-display">Admin Access</h1>
        <input 
          type="password" 
          placeholder="Enter Secret Key" 
          className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg focus:border-red-600 outline-none transition-colors mb-4 text-center tracking-widest"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all">
          Unlock
        </button>
      </form>
    </div>
  );
}