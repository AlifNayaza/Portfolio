import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../components/admin/ImageUploader";
import AudioUploader from "../components/admin/AudioUploader";
import { usePortfolio } from "../context/PortfolioContext";

const API_URL = "/.netlify/functions/portfolio";

// --- Helper untuk manage auth session ---
const getAuthToken = () => {
    return localStorage.getItem("admin_session") || sessionStorage.getItem("admin_session");
};

const clearAuthToken = () => {
    localStorage.removeItem("admin_session");
    sessionStorage.removeItem("admin_session");
};

// Helper untuk merge data yang di-fetch dengan default structure
const mergeWithDefaults = (fetchedData) => {
    const defaults = {
        home: { logoName: "", headline: "", subtitle: "" },
        profile: { about: "", avatarUrl: "" },
        soundtrack: [],
        skills: [],
        experience: [],
        projects: [],
        contact: { email: "", linkedin: "", github: "", instagram: "", twitter: "" }
    };

    // Deep merge untuk memastikan semua field ada
    const merged = { ...defaults };
    
    if (fetchedData) {
        // Merge home
        if (fetchedData.home) {
            merged.home = { ...defaults.home, ...fetchedData.home };
        }
        
        // Merge profile
        if (fetchedData.profile) {
            merged.profile = { ...defaults.profile, ...fetchedData.profile };
        }
        
        // Merge contact
        if (fetchedData.contact) {
            merged.contact = { ...defaults.contact, ...fetchedData.contact };
        }
        
        // Arrays - gunakan yang dari database jika ada
        merged.soundtrack = fetchedData.soundtrack || [];
        merged.skills = fetchedData.skills || [];
        merged.experience = fetchedData.experience || [];
        merged.projects = fetchedData.projects || [];

        // Backward compatibility: konversi 'music' ke 'soundtrack'
        if (fetchedData.music && merged.soundtrack.length === 0) {
            merged.soundtrack = Array.isArray(fetchedData.music) 
                ? fetchedData.music 
                : [fetchedData.music];
        }
    }

    return merged;
};

// --- Helper Components (Internal) ---
const AdminInput = ({ label, textarea, ...props }) => {
    const Comp = textarea ? "textarea" : "input";
    return (
        <div className="w-full">
            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-[#9f1239] pl-2">
                {label}
            </label>
            <Comp 
                className="w-full bg-[#1e1e1e] border border-[#333] text-[#e5e5e5] p-3 font-serif focus:border-[#9f1239] focus:outline-none focus:ring-1 focus:ring-[#9f1239]/50 placeholder:text-zinc-600 transition-all rounded-md"
                {...props}
            />
        </div>
    );
};

const SectionHeader = ({ title, onAddItem, buttonLabel }) => (
    <div className="flex justify-between items-end border-b border-[#333] pb-4 mb-8">
        <h2 className="text-3xl font-display text-white">{title}</h2>
        {onAddItem && (
            <button 
                onClick={onAddItem} 
                className="font-mono text-xs text-[#9f1239] hover:text-white transition-colors"
            >
                {buttonLabel}
            </button>
        )}
    </div>
);

const icons = {
  home: '📖', profile: '👤', skills: '✨', projects: '💼', 
  experience: '⏳', soundtrack: '🎵', contact: '📨',
};

const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "circOut" } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3, ease: "circIn" } }
};

const listItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

export default function Admin() {
    const navigate = useNavigate();
    const { refreshData } = usePortfolio();
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("home");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
    const [formData, setFormData] = useState({
        home: { logoName: "", headline: "", subtitle: "" },
        profile: { about: "", avatarUrl: "" },
        soundtrack: [],
        skills: [],
        experience: [],
        projects: [],
        contact: { email: "", linkedin: "", github: "", instagram: "", twitter: "" }
    });

    // Validasi auth saat component mount
    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            toast.error("Session expired. Please login again.");
            navigate("/keyhole");
            return;
        }
        setPassword(token);
    }, [navigate]);

    // Fetch data dari backend
    useEffect(() => {
        if (!password) return;

        console.log('🔄 Fetching data from backend...');
        
        axios.get(API_URL)
            .then(res => {
                console.log('✅ Data received:', res.data);
                console.log('Data keys:', Object.keys(res.data || {}));
                
                // Merge dengan defaults untuk memastikan semua field ada
                const mergedData = mergeWithDefaults(res.data);
                console.log('✅ Data merged with defaults:', Object.keys(mergedData));
                
                setFormData(mergedData);
                setLoading(false);
                
                // Log untuk debugging
                console.log('Home data:', mergedData.home);
                console.log('Skills count:', mergedData.skills?.length || 0);
                console.log('Projects count:', mergedData.projects?.length || 0);
                console.log('Soundtrack count:', mergedData.soundtrack?.length || 0);
            })
            .catch(err => {
                console.error("❌ Failed to fetch data:", err);
                console.error("Error response:", err.response?.data);
                setLoading(false);
                toast.error("Failed to load data from server.");
            });
    }, [password]);

    const handleSave = async () => {
        const currentToken = getAuthToken();
        
        if (!currentToken) {
            toast.error("Session expired. Please login again.");
            navigate("/keyhole");
            return;
        }

        console.log('💾 Saving data to backend...');
        console.log('Data to save:', formData);

        setSaving(true);
        try {
            const response = await axios.post(API_URL, formData, { 
                headers: { Authorization: currentToken },
                timeout: 15000
            });
            
            console.log('✅ Save response:', response.data);
            toast.success("MANUSCRIPT UPDATED.");
            refreshData();
        } catch (e) {
            console.error("❌ Save error:", e);
            console.error("Error response:", e.response?.data);
            
            if (e.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                clearAuthToken();
                navigate("/keyhole");
            } else if (e.response?.status === 500) {
                toast.error("Server error. Check backend logs.");
            } else if (!e.response) {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error("Failed to save. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        clearAuthToken();
        toast.success("Logged out successfully.");
        navigate("/keyhole");
    };

    // Helper functions
    const setNest = (sec, f, v) => setFormData(p => ({...p, [sec]: { ...p[sec], [f]: v }}));
    const setArrObj = (section, index, field, value) => {
        const newArr = [...(formData[section] || [])];
        newArr[index] = { ...newArr[index], [field]: value };
        setFormData(prev => ({ ...prev, [section]: newArr }));
    };  
    const addItem = (sec, tpl) => setFormData(p => ({...p, [sec]: [...(p[sec]||[]), tpl]}));
    const delItem = (section, index) => {
        if(!window.confirm("Are you sure?")) return;
        setFormData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
    };
  
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="font-mono text-xs text-white mb-4">INITIALIZING WORKBENCH...</div>
                    <div className="flex justify-center">
                        <svg className="animate-spin h-8 w-8 text-[#9f1239]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "home", label: "Prologue", icon: icons.home },
        { id: "profile", label: "Character", icon: icons.profile },
        { id: "skills", label: "Abilities", icon: icons.skills },
        { id: "projects", label: "Archives", icon: icons.projects },
        { id: "experience", label: "Timeline", icon: icons.experience },
        { id: "soundtrack", label: "Soundtrack", icon: icons.soundtrack },
        { id: "contact", label: "Signal", icon: icons.contact },
    ];

    const activeTabData = tabs.find(t => t.id === activeTab);

    return (
        <div className="min-h-screen bg-black text-[#e5e5e5] font-serif">
            <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-sm border-b border-[#333] px-4 md:px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-[#9f1239] text-2xl">§</span>
                    <h1 className="font-display font-bold text-lg tracking-widest hidden md:block">ARCHIVIST'S WORKBENCH</h1>
                    <h1 className="font-display font-bold text-lg tracking-widest md:hidden">A.W.</h1>
                </div>
                <div className="flex items-center gap-4 md:gap-6 font-mono text-xs">
                    <button onClick={handleLogout} className="text-zinc-500 hover:text-red-500 transition-colors">[ LOGOUT ]</button>
                    <motion.button 
                        onClick={handleSave} 
                        disabled={saving} 
                        className="bg-[#9f1239] text-white px-4 py-2 rounded-md shadow-lg shadow-[#9f1239]/30 hover:bg-red-700 transition-colors disabled:opacity-50"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                        {saving ? "SAVING..." : "SAVE"}
                    </motion.button>
                </div>
            </header>

            <div className="flex flex-col md:flex-row max-w-8xl mx-auto p-4 md:p-6 gap-6">
                
                {/* --- MOBILE DROPDOWN NAV (RESPONSIVE) --- */}
                <div className="md:hidden relative mb-2">
                    <button 
                        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                        className="w-full flex justify-between items-center gap-3 px-4 py-3 text-left font-mono text-xs tracking-widest transition-all rounded-md bg-[#9f1239] text-white shadow-md shadow-[#9f1239]/20"
                    >
                        <div className="flex items-center gap-3">
                            <span>{activeTabData.icon}</span>
                            <span>{activeTabData.label}</span>
                        </div>
                        <motion.span animate={{ rotate: isMobileNavOpen ? 180 : 0 }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </motion.span>
                    </button>

                    <AnimatePresence>
                        {isMobileNavOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-[#333] rounded-md shadow-lg z-50 p-2 space-y-1"
                            >
                                {tabs.map(t => (
                                    <button 
                                        key={t.id} 
                                        onClick={() => { setActiveTab(t.id); setIsMobileNavOpen(false); }} 
                                        className="w-full flex items-center gap-3 px-3 py-2 text-left font-mono text-xs tracking-widest transition-all rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white"
                                    >
                                        <span>{t.icon}</span>
                                        <span>{t.label}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- DESKTOP SIDEBAR --- */}
                <aside className="hidden md:block w-full md:w-56 flex-shrink-0">
                    <div className="flex flex-col gap-2">
                        {tabs.map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => setActiveTab(t.id)} 
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left font-mono text-xs tracking-widest transition-all rounded-md ${
                                    activeTab === t.id 
                                    ? "bg-[#9f1239] text-white shadow-md shadow-[#9f1239]/20" 
                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                }`}
                            >
                                <span>{t.icon}</span>
                                <span>{t.label}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="flex-1 min-h-[500px] bg-[#111] border border-[#333] rounded-lg p-4 md:p-6 shadow-inner shadow-black/30">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab} variants={tabContentVariants}
                            initial="hidden" animate="visible" exit="exit"
                        >
                            {/* Home */}
                            {activeTab === "home" && (
                                <div>
                                    <SectionHeader title="Prologue Settings" />
                                    <div className="space-y-6">
                                        <AdminInput label="Brand Name (Navbar)" value={formData.home?.logoName || ""} onChange={e=>setNest('home','logoName',e.target.value)} />
                                        <AdminInput label="Main Headline" value={formData.home?.headline || ""} onChange={e=>setNest('home','headline',e.target.value)} />
                                        <AdminInput textarea rows={4} label="Subtitle / Intro" value={formData.home?.subtitle || ""} onChange={e=>setNest('home','subtitle',e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* Profile */}
                            {activeTab === "profile" && (
                                <div>
                                    <SectionHeader title="Character Sheet" />
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <AdminInput textarea rows={12} label="Biography" value={formData.profile?.about || ""} onChange={e=>setNest('profile','about',e.target.value)} />
                                        <div className="space-y-2">
                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest border-l-2 border-[#9f1239] pl-2">Portrait</label>
                                            <ImageUploader currentImage={formData.profile?.avatarUrl || ""} onUpload={url => setNest('profile', 'avatarUrl', url)} onDelete={() => setNest('profile', 'avatarUrl', "")} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Soundtrack */}
                            {activeTab === "soundtrack" && (
                                <div>
                                    <SectionHeader title="Background Audio" onAddItem={() => addItem('soundtrack', { url: "", title: "", artist: "" })} buttonLabel="[ + ADD TRACK ]" />
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {formData.soundtrack?.map((track, i) => (
                                                <motion.div key={i} variants={listItemVariants} initial="hidden" animate="visible" exit="exit" layout className="bg-[#1e1e1e]/50 border border-[#333] rounded-lg p-4 relative">
                                                    <button onClick={() => delItem('soundtrack',i)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 text-xl font-bold">&times;</button>
                                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                        <AdminInput label="Track Title" value={track.title || ""} onChange={e => setArrObj('soundtrack', i, 'title', e.target.value)} />
                                                        <AdminInput label="Artist Name" value={track.artist || ""} onChange={e => setArrObj('soundtrack', i, 'artist', e.target.value)} />
                                                    </div>
                                                    <AudioUploader currentAudio={track.url || ""} onUpload={url => setArrObj('soundtrack', i, 'url', url)} onDelete={() => setArrObj('soundtrack', i, 'url', "")} />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {formData.soundtrack?.length === 0 && <p className="text-center text-zinc-600 font-mono text-xs py-10">NO TRACKS FOUND</p>}
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === "skills" && (
                                <div>
                                    <SectionHeader title="Abilities" onAddItem={()=>addItem('skills', { name: "", level: "Intermediate" })} buttonLabel="[ + ADD ABILITY ]" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AnimatePresence>
                                            {formData.skills?.map((skill, i) => {
                                                const skillData = typeof skill === 'string' ? { name: skill, level: "Intermediate" } : skill;
                                                return (
                                                    <motion.div key={i} variants={listItemVariants} initial="hidden" animate="visible" exit="exit" layout className="bg-[#1e1e1e]/50 border border-[#333] rounded-lg p-4 space-y-4">
                                                        <AdminInput label="Skill Name" value={skillData.name || ""} onChange={e=>setArrObj('skills',i,'name',e.target.value)} />
                                                        <div>
                                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-[#9f1239] pl-2">Proficiency</label>
                                                            <select className="w-full bg-[#1e1e1e] border border-[#333] text-[#e5e5e5] p-3 font-serif focus:border-[#9f1239] focus:outline-none focus:ring-1 focus:ring-[#9f1239]/50 transition-all rounded-md" value={skillData.level || "Intermediate"} onChange={e=>setArrObj('skills',i,'level',e.target.value)}>
                                                                <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Master</option>
                                                            </select>
                                                        </div>
                                                        <button onClick={()=>delItem('skills',i)} className="font-mono text-[10px] text-zinc-500 hover:text-red-500 transition-colors">[ DELETE ]</button>
                                                    </motion.div>
                                                )
                                            })}
                                        </AnimatePresence>
                                    </div>
                                    {formData.skills?.length === 0 && <p className="text-center text-zinc-600 font-mono text-xs py-10">NO SKILLS FOUND</p>}
                                </div>
                            )}

                            {activeTab === "experience" && (
                                <div>
                                    <SectionHeader title="Timeline" onAddItem={()=>addItem('experience', {role:"", company:"", year:""})} buttonLabel="[ + ADD EVENT ]" />
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {formData.experience?.map((exp, i) => (
                                                <motion.div key={i} variants={listItemVariants} initial="hidden" animate="visible" exit="exit" layout className="bg-[#1e1e1e]/50 border border-[#333] rounded-lg p-4 relative space-y-4">
                                                    <button onClick={() => delItem('experience',i)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500 text-xl font-bold">&times;</button>
                                                    <AdminInput label="Role / Title" value={exp.role || ""} onChange={e=>setArrObj('experience',i,'role',e.target.value)} />
                                                    <AdminInput label="Company / Place" value={exp.company || ""} onChange={e=>setArrObj('experience',i,'company',e.target.value)} />
                                                    <AdminInput label="Duration / Year" value={exp.year || ""} onChange={e=>setArrObj('experience',i,'year',e.target.value)} />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    {formData.experience?.length === 0 && <p className="text-center text-zinc-600 font-mono text-xs py-10">NO EVENTS FOUND</p>}
                                </div>
                            )}

                            {activeTab === "projects" && (
                                <div>
                                    <SectionHeader title="Archives" onAddItem={()=>addItem('projects', {name:"",description:"",image:"",link:""})} buttonLabel="[ + NEW ENTRY ]" />
                                    <div className="space-y-6">
                                        <AnimatePresence>
                                            {formData.projects?.map((p, i) => (
                                                <motion.div key={i} variants={listItemVariants} initial="hidden" animate="visible" exit="exit" layout className="bg-[#1e1e1e]/50 border border-[#333] rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <p className="font-mono text-xs text-zinc-500 mb-4">FILE #{i+1}</p>
                                                        <button onClick={()=>delItem('projects',i)} className="text-zinc-600 hover:text-red-500 text-xl font-bold -mt-2">&times;</button>
                                                    </div>
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                        <div className="lg:col-span-2 space-y-4">
                                                            <AdminInput label="Project Name" value={p.name || ""} onChange={e=>setArrObj('projects',i,'name',e.target.value)} />
                                                            <AdminInput label="Link / URL" value={p.link || ""} onChange={e=>setArrObj('projects',i,'link',e.target.value)} />
                                                            <AdminInput textarea rows={4} label="Description / Report" value={p.description || ""} onChange={e=>setArrObj('projects',i,'description',e.target.value)} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest border-l-2 border-[#9f1239] pl-2">Attachment</label>
                                                            <ImageUploader currentImage={p.image || ""} onUpload={url=>setArrObj('projects',i,'image',url)} onDelete={()=>setArrObj('projects',i,'image',"")} />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    {formData.projects?.length === 0 && <p className="text-center text-zinc-600 font-mono text-xs py-10">NO PROJECTS FOUND</p>}
                                </div>
                            )}

                            {activeTab === "contact" && (
                                <div>
                                    <SectionHeader title="Signal Frequencies" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <AdminInput label="Email Address" value={formData.contact?.email || ""} onChange={e=>setNest('contact','email',e.target.value)} />
                                        <AdminInput label="LinkedIn" value={formData.contact?.linkedin || ""} onChange={e=>setNest('contact','linkedin',e.target.value)} />
                                        <AdminInput label="GitHub" value={formData.contact?.github || ""} onChange={e=>setNest('contact','github',e.target.value)} />
                                        <AdminInput label="Instagram" value={formData.contact?.instagram || ""} onChange={e=>setNest('contact','instagram',e.target.value)} />
                                        <AdminInput label="Twitter / X" value={formData.contact?.twitter || ""} onChange={e=>setNest('contact','twitter',e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}