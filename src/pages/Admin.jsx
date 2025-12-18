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

// --- KOMPONEN BARU: Tech Stack Input ---
const TechStackInput = ({ technologies = [], onChange, projectIndex }) => {
    const [inputValue, setInputValue] = useState("");

    const addTech = () => {
        if (inputValue.trim() && !technologies.includes(inputValue.trim())) {
            onChange([...technologies, inputValue.trim()]);
            setInputValue("");
        }
    };

    const removeTech = (techToRemove) => {
        onChange(technologies.filter(tech => tech !== techToRemove));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTech();
        }
    };

    return (
        <div className="space-y-3">
            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest border-l-2 border-[#9f1239] pl-2">
                Technologies Used
            </label>
            
            {/* Input Field */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., React, Node.js, MongoDB..."
                    className="flex-1 bg-[#1e1e1e] border border-[#333] text-[#e5e5e5] p-2 font-mono text-sm focus:border-[#9f1239] focus:outline-none focus:ring-1 focus:ring-[#9f1239]/50 placeholder:text-zinc-600 transition-all rounded-md"
                />
                <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-2 bg-[#9f1239] text-white font-mono text-xs hover:bg-[#7f0e2a] transition-colors rounded-md"
                >
                    ADD
                </button>
            </div>

            {/* Tech Badges */}
            {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-[#111] border border-[#333] rounded-md">
                    {technologies.map((tech, idx) => (
                        <span
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] border border-[#444] text-[#e5e5e5] font-mono text-xs rounded-full group hover:border-[#9f1239] transition-colors"
                        >
                            {tech}
                            <button
                                type="button"
                                onClick={() => removeTech(tech)}
                                className="text-zinc-500 hover:text-red-500 transition-colors font-bold"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {technologies.length === 0 && (
                <p className="text-xs text-zinc-600 font-mono italic p-3 bg-[#111] border border-[#333] rounded-md">
                    No technologies added yet. Type and press Enter or click ADD.
                </p>
            )}
        </div>
    );
};

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
    const [formData, setFormData] = useState({
        home: { logoName: "", headline: "", subtitle: "" },
        profile: { about: "", avatarUrl: "" },
        soundtrack: [],
        skills: [],
        experience: [],
        projects: [],
        contact: { email: "", linkedin: "", github: "", instagram: "", twitter: "" }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            navigate("/keyhole");
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const response = await axios.get(API_URL, { timeout: 10000 });
            console.log("Data fetched from API:", response.data);
            const merged = mergeWithDefaults(response.data);
            setFormData(merged);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data from server");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        clearAuthToken();
        toast.success("Logged out successfully");
        navigate("/");
    };

    const handleSave = async () => {
        const token = getAuthToken();
        if (!token) {
            toast.error("No authentication token found");
            navigate("/keyhole");
            return;
        }

        setIsSaving(true);
        try {
            console.log("Saving data:", formData);
            const response = await axios.post(API_URL, formData, {
                headers: { Authorization: token },
                timeout: 15000
            });

            console.log("Save response:", response.data);
            toast.success("✓ Data saved successfully!");
            await refreshData();
        } catch (error) {
            console.error("Save error:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                clearAuthToken();
                navigate("/keyhole");
            } else {
                toast.error("Failed to save data. Check console.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const setNest = (parent, key, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [key]: value }
        }));
    };

    const addItem = (key, obj) => {
        setFormData(prev => ({
            ...prev,
            [key]: [...(prev[key] || []), obj]
        }));
    };

    const delItem = (key, index) => {
        setFormData(prev => ({
            ...prev,
            [key]: prev[key].filter((_, i) => i !== index)
        }));
    };

    const setArrObj = (key, index, field, value) => {
        setFormData(prev => {
            const arr = [...(prev[key] || [])];
            if (typeof arr[index] === 'string') {
                arr[index] = { name: arr[index], [field]: value };
            } else {
                arr[index] = { ...arr[index], [field]: value };
            }
            return { ...prev, [key]: arr };
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <div className="font-display text-xl tracking-[0.5em] animate-pulse text-white">
                    LOADING ARCHIVE...
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'home', label: 'Chronicle', icon: icons.home },
        { id: 'profile', label: 'Character', icon: icons.profile },
        { id: 'skills', label: 'Abilities', icon: icons.skills },
        { id: 'projects', label: 'Archives', icon: icons.projects },
        { id: 'experience', label: 'Timeline', icon: icons.experience },
        { id: 'soundtrack', label: 'Soundtrack', icon: icons.soundtrack },
        { id: 'contact', label: 'Signals', icon: icons.contact }
    ];

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-[#e5e5e5]">
            <div className="noise-overlay fixed top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-[0.03]"></div>
            
            <div className="flex relative">
                <aside className="w-64 min-h-screen bg-[#0c0c0c] border-r border-[#333] fixed left-0 top-0 z-40 overflow-y-auto">
                    <div className="p-6 border-b border-[#333]">
                        <h1 className="font-display text-2xl text-white mb-1">ARCHIVIST</h1>
                        <p className="font-mono text-xs text-zinc-600 tracking-widest">CONTROL PANEL</p>
                    </div>

                    <nav className="p-4 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-4 py-3 font-mono text-sm transition-all flex items-center gap-3 ${
                                    activeTab === tab.id 
                                        ? 'bg-[#9f1239] text-white border-l-4 border-white' 
                                        : 'text-zinc-500 hover:text-white hover:bg-[#1e1e1e] border-l-4 border-transparent'
                                }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-[#333] space-y-2">
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="w-full bg-[#9f1239] hover:bg-[#7f0e2a] text-white py-3 font-mono text-xs tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'SAVING...' : '[ COMMIT CHANGES ]'}
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full border border-[#333] hover:border-[#9f1239] text-zinc-500 hover:text-white py-3 font-mono text-xs tracking-widest transition-colors"
                        >
                            [ LOGOUT ]
                        </button>
                    </div>
                </aside>

                <main className="ml-64 flex-1 p-8 relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab} 
                            variants={tabContentVariants} 
                            initial="hidden" 
                            animate="visible" 
                            exit="exit"
                            className="max-w-5xl"
                        >
                            {activeTab === "home" && (
                                <div>
                                    <SectionHeader title="Chronicle Settings" />
                                    <div className="space-y-6">
                                        <AdminInput label="Author Name (Logo)" value={formData.home?.logoName || ""} onChange={e=>setNest('home','logoName',e.target.value)} />
                                        <AdminInput label="Main Headline" value={formData.home?.headline || ""} onChange={e=>setNest('home','headline',e.target.value)} />
                                        <AdminInput textarea rows={3} label="Opening Quote / Subtitle" value={formData.home?.subtitle || ""} onChange={e=>setNest('home','subtitle',e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {activeTab === "profile" && (
                                <div>
                                    <SectionHeader title="Character Profile" />
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <AdminInput textarea rows={10} label="Biography / Story" value={formData.profile?.about || ""} onChange={e=>setNest('profile','about',e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-[#9f1239] pl-2">Portrait</label>
                                            <ImageUploader currentImage={formData.profile?.avatarUrl || ""} onUpload={url=>setNest('profile','avatarUrl',url)} onDelete={()=>setNest('profile','avatarUrl',"")} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            
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

                            {/* === BAGIAN PROJECTS DENGAN TEKNOLOGI === */}
                            {activeTab === "projects" && (
                                <div>
                                    <SectionHeader title="Archives" onAddItem={()=>addItem('projects', {name:"",description:"",image:"",link:"",technologies:[]})} buttonLabel="[ + NEW ENTRY ]" />
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
                                                            
                                                            {/* === INPUT TEKNOLOGI BARU === */}
                                                            <TechStackInput 
                                                                technologies={p.technologies || []} 
                                                                onChange={(newTechs) => setArrObj('projects', i, 'technologies', newTechs)}
                                                                projectIndex={i}
                                                            />
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