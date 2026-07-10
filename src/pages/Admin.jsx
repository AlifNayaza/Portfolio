/* eslint-disable no-unused-vars */
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
        profile: { about: "", images: [] },
        aboutPage: {
            location: "Remote • Worldwide",
            specialization: "Full-Stack Development",
            availability: "Available for work",
            availabilityStatus: "open",
            coreValues: [
                { title: "Problem Solving", desc: "Breaking down complex challenges into manageable solutions", icon: "🔍" },
                { title: "Clean Code", desc: "Writing maintainable, scalable, and well-documented code", icon: "✨" },
                { title: "Continuous Learning", desc: "Staying updated with latest technologies and best practices", icon: "📚" },
                { title: "User Focus", desc: "Building with the end-user experience as priority", icon: "🎯" }
            ],
            strengths: [
                "Project Leadership",
                "Technical Strategy",
                "Team Collaboration",
                "Agile Development"
            ]
        },
        soundtrack: [],
        skills: [],
        experience: [],
        projects: [],
        contact: { email: "", linkedin: "", github: "", instagram: "", twitter: "" }
    };

    const merged = { ...defaults };
    
    if (fetchedData) {
        if (fetchedData.home) {
            merged.home = { ...defaults.home, ...fetchedData.home };
        }
        
        if (fetchedData.profile) {
            const profileData = { ...defaults.profile };
            if (fetchedData.profile.avatarUrl && !fetchedData.profile.images) {
                profileData.images = [fetchedData.profile.avatarUrl];
                delete fetchedData.profile.avatarUrl;
            }
            merged.profile = { ...profileData, ...fetchedData.profile };
            merged.profile.images = Array.isArray(merged.profile.images) ? merged.profile.images : [];
        }
        
        if (fetchedData.aboutPage) {
            merged.aboutPage = { ...defaults.aboutPage, ...fetchedData.aboutPage };
            if (!merged.aboutPage.coreValues || !Array.isArray(merged.aboutPage.coreValues)) {
                merged.aboutPage.coreValues = defaults.aboutPage.coreValues;
            }
            if (!merged.aboutPage.strengths || !Array.isArray(merged.aboutPage.strengths)) {
                merged.aboutPage.strengths = defaults.aboutPage.strengths;
            }
        }
        
        if (fetchedData.contact) {
            merged.contact = { ...defaults.contact, ...fetchedData.contact };
        }
        
        merged.soundtrack = fetchedData.soundtrack || [];
        merged.skills = fetchedData.skills || [];
        merged.experience = fetchedData.experience || [];
        merged.projects = fetchedData.projects || [];

        if (fetchedData.music && merged.soundtrack.length === 0) {
            merged.soundtrack = Array.isArray(fetchedData.music) 
                ? fetchedData.music 
                : [fetchedData.music];
        }
    }

    return merged;
};

// --- Helper Components (Fixed Contrast) ---
const AdminInput = ({ label, textarea, ...props }) => {
    const Comp = textarea ? "textarea" : "input";
    return (
        <div className="w-full space-y-2 group">
            <label className="block font-mono text-[9px] text-[var(--color-muted)] uppercase tracking-[0.2em] border-l border-[var(--color-crimson)] pl-2 transition-colors group-focus-within:text-[var(--color-crimson)]">
                {label}
            </label>
            <Comp 
                className="w-full bg-[var(--color-line)]/30 border border-[var(--color-border)] text-[var(--color-paper)] p-3.5 font-serif focus:border-[var(--color-crimson)] focus:bg-[var(--color-bg)] focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]/30 placeholder:text-[var(--color-muted)]/40 transition-all rounded-lg shadow-sm"
                {...props}
            />
        </div>
    );
};

const SectionHeader = ({ title, onAddItem, buttonLabel, description }) => (
    <div className="border-b border-[var(--color-border)] pb-5 mb-8 space-y-2">
        <div className="flex justify-between items-end">
            <h2 className="text-2xl md:text-3xl font-display text-[var(--color-paper)] tracking-wide">{title}</h2>
            {onAddItem && (
                <button 
                    onClick={onAddItem} 
                    className="font-mono text-[10px] tracking-wider text-[var(--color-crimson)] hover:text-white border border-[var(--color-crimson)] hover:bg-[var(--color-crimson)] transition-all font-bold px-3 py-1.5 rounded-lg"
                >
                    {buttonLabel}
                </button>
            )}
        </div>
        {description && (
            <p className="text-xs text-[var(--color-muted)] font-serif italic max-w-2xl leading-relaxed">
                {description}
            </p>
        )}
    </div>
);

// === COMPONENT UNTUK MULTIPLE IMAGES (Fixed Contrast) ===
const ProfileImagesManager = ({ images = [], onChange }) => {
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleAddImage = (url) => {
        onChange([...images, url]);
        toast.success("Image added successfully");
    };

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
        toast.success("Image removed");
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) return;
        
        const newImages = [...images];
        const [draggedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(targetIndex, 0, draggedItem);
        
        onChange(newImages);
        setDraggedIndex(null);
        toast.success("Image order updated");
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <label className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest mb-2 border-l-2 border-[var(--color-crimson)] pl-2">
                        Profile Images ({images.length} images)
                    </label>
                    
                    <div className="space-y-4">
                        {/* Image Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.map((image, index) => (
                                <motion.div
                                    key={index}
                                    layout
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, index)}
                                    className="relative group aspect-square border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-crimson)] rounded-lg overflow-hidden bg-[var(--color-line)] shadow-sm"
                                >
                                    <img
                                        src={image}
                                        alt={`Profile image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Overlay Controls */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <div className="flex items-center gap-1 text-xs text-white bg-black/50 px-2 py-1 rounded">
                                            <span className="font-mono">#{index + 1}</span>
                                            <span className="text-[10px] text-zinc-300">Drag to reorder</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Add New Image Button */}
                            <div className="relative aspect-square">
                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-crimson)] rounded-lg bg-[var(--color-bg)] hover:bg-[var(--color-line)] transition-all group shadow-sm">
                                    <span className="text-3xl text-[var(--color-muted)] group-hover:text-[var(--color-crimson)] mb-2">+</span>
                                    <span className="font-mono text-xs text-[var(--color-muted)] group-hover:text-[var(--color-paper)]">Add Image</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            
                                            const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                                            const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;
                                            
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            formData.append("upload_preset", UPLOAD_PRESET);
                                            
                                            try {
                                                const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
                                                handleAddImage(res.data.secure_url);
                                            } catch (err) {
                                                toast.error("Failed to upload image");
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        
                        {/* Quick Upload */}
                        <div className="pt-4 border-t border-[var(--color-border)]">
                            <label className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest mb-2">
                                Quick Image Upload
                            </label>
                            <div className="flex items-center gap-4">
                                <ImageUploader 
                                    onUpload={handleAddImage}
                                    compact={true}
                                />
                                <div className="text-xs text-[var(--color-muted)]">
                                    <p>• Upload multiple profile images</p>
                                    <p>• Drag to reorder</p>
                                    <p>• First image is main profile</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Preview Section */}
                <div className="space-y-4">
                    <label className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest border-l-2 border-[var(--color-crimson)] pl-2">
                        Live Preview
                    </label>
                    
                    <div className="aspect-square border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-line)] shadow-md">
                        {images.length > 0 ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={images[0]}
                                    alt="Main profile preview"
                                    className="w-full h-full object-cover"
                                />
                                {images.length > 1 && (
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-mono">
                                        +{images.length - 1} more
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--color-muted)] font-mono text-sm">
                                No images added
                            </div>
                        )}
                    </div>
                    
                    <div className="text-xs text-[var(--color-muted)] space-y-2">
                        <p className="font-mono text-[10px] text-[var(--color-crimson)]">💡 Tips:</p>
                        <p>• Add 3-5 high-quality images</p>
                        <p>• First image appears as main profile</p>
                        <p>• Use consistent aspect ratio (1:1 recommended)</p>
                    </div>
                </div>
            </div>
            
            {images.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--color-crimson)]/10 border border-[var(--color-crimson)]/30 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--color-crimson)] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                            <p className="text-sm text-[var(--color-paper)] font-mono">Profile Images Configured</p>
                            <p className="text-xs text-[var(--color-muted)]">
                                {images.length} image{images.length !== 1 ? 's' : ''} will display in carousel on homepage
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

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
            <label className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest border-l-2 border-[var(--color-crimson)] pl-2">
                Technologies Used
            </label>
            
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., React, Node.js, MongoDB..."
                    className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-paper)] p-2 font-mono text-sm focus:border-[var(--color-crimson)] focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]/50 placeholder:text-[var(--color-muted)] transition-all rounded-md shadow-inner"
                />
                <button
                    type="button"
                    onClick={addTech}
                    className="px-4 py-2 bg-[var(--color-crimson)] text-white font-mono text-xs hover:bg-[#7f0e2a] transition-colors rounded-md shadow-sm"
                >
                    ADD
                </button>
            </div>

            {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md shadow-inner">
                    {technologies.map((tech, idx) => (
                        <span
                            key={idx}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-line)] border border-[var(--color-border)] text-[var(--color-paper)] font-mono text-xs rounded-full group hover:border-[var(--color-crimson)] transition-colors shadow-sm"
                        >
                            {tech}
                            <button
                                type="button"
                                onClick={() => removeTech(tech)}
                                className="text-[var(--color-muted)] hover:text-red-500 transition-colors font-bold"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {technologies.length === 0 && (
                <p className="text-xs text-[var(--color-muted)] font-mono italic p-3 bg-[var(--color-line)] border border-[var(--color-border)] rounded-md">
                    No technologies added yet. Type and press Enter or click ADD.
                </p>
            )}
        </div>
    );
};

const icons = {
  home: '📖', profile: '👤', aboutpage: '📄', skills: '✨', projects: '💼', 
  experience: '⏳', soundtrack: '🎵', contact: '📨', messages: '✉️',
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
    const [activeTab, setActiveTab] = useState("home");
    const [formData, setFormData] = useState({
        home: { logoName: "", headline: "", subtitle: "" },
        profile: { about: "", images: [] },
        aboutPage: {
            location: "Remote • Worldwide",
            specialization: "Full-Stack Development",
            availability: "Available for work",
            availabilityStatus: "open",
            coreValues: [],
            strengths: []
        },
        soundtrack: [],
        skills: [],
        experience: [],
        projects: [],
        contact: { email: "", linkedin: "", github: "", instagram: "", twitter: "" }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
            const token = getAuthToken();
            const response = await axios.get("/.netlify/functions/contact", {
                headers: { Authorization: token },
                timeout: 10000
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages.");
        } finally {
            setLoadingMessages(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            const token = getAuthToken();
            await axios.delete(`/.netlify/functions/contact?id=${id}`, {
                headers: { Authorization: token }
            });
            toast.success("Message deleted.");
            setMessages(prev => prev.filter(m => m._id !== id));
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error("Failed to delete message.");
        }
    };

    useEffect(() => {
        if (activeTab === "messages") {
            fetchMessages();
        }
    }, [activeTab]);

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
            await axios.post(API_URL, formData, {
                headers: { Authorization: token },
                timeout: 15000
            });
            toast.success("✓ Data saved successfully!");
            await refreshData();
        } catch (error) {
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

    const updateProfileImages = (newImages) => {
        setFormData(prev => ({
            ...prev,
            profile: { ...prev.profile, images: newImages }
        }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
                <div className="font-display text-xl tracking-[0.5em] animate-pulse text-[var(--color-paper)]">
                    LOADING ARCHIVE...
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'home', label: 'Home Page', icon: icons.home },
        { id: 'profile', label: 'Biography', icon: icons.profile },
        { id: 'aboutpage', label: 'About Page', icon: icons.aboutpage },
        { id: 'skills', label: 'Skills', icon: icons.skills },
        { id: 'projects', label: 'Projects', icon: icons.projects },
        { id: 'experience', label: 'Experience', icon: icons.experience },
        { id: 'soundtrack', label: 'Music', icon: icons.soundtrack },
        { id: 'contact', label: 'Contact', icon: icons.contact },
        { id: 'messages', label: 'Messages', icon: icons.messages }
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-paper)] flex flex-col">
            <div className="noise-overlay fixed top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-[0.03]"></div>
            
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between h-16 px-6 border-b border-[var(--color-border)] bg-[var(--color-bg)] sticky top-0 z-30">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="font-mono text-xs border border-[var(--color-border)] px-3 py-1.5 rounded text-[var(--color-paper)] hover:border-[var(--color-crimson)] transition-colors"
                >
                    ☰ MENU
                </button>
                <span className="font-display font-medium text-lg tracking-wider">ARCHIVIST</span>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="font-mono text-xs bg-[var(--color-crimson)] text-white px-3 py-1.5 rounded shadow-sm disabled:opacity-50"
                >
                    {isSaving ? "SAVING..." : "[ SAVE ]"}
                </button>
            </header>

            <div className="flex flex-1 relative">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div 
                        onClick={() => setSidebarOpen(false)} 
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    />
                )}

                <aside 
                    className={`w-64 min-h-screen bg-[var(--color-bg)] border-r border-[var(--color-border)] fixed left-0 top-0 z-40 overflow-y-auto transition-transform duration-300 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
                >
                    <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
                        <div>
                            <h1 className="font-display text-2xl text-[var(--color-paper)] mb-1">ARCHIVIST</h1>
                            <p className="font-mono text-xs text-[var(--color-muted)] tracking-widest">CONTROL PANEL</p>
                        </div>
                        <button 
                            onClick={() => setSidebarOpen(false)} 
                            className="lg:hidden font-mono text-xs text-[var(--color-muted)] hover:text-red-500 border border-[var(--color-border)] px-2 py-1 rounded"
                        >
                            CLOSE
                        </button>
                    </div>

                    <nav className="p-4 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 font-mono text-sm transition-all flex items-center gap-3 rounded-lg ${
                                    activeTab === tab.id 
                                        ? 'bg-[var(--color-crimson)] text-white shadow-md font-bold' 
                                        : 'text-[var(--color-muted)] hover:text-[var(--color-paper)] hover:bg-[var(--color-line)]'
                                }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-[var(--color-border)] space-y-2">
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="w-full bg-[var(--color-crimson)] hover:bg-[#7f0e2a] text-white py-3 font-mono text-xs tracking-widest transition-colors rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'SAVING...' : '[ COMMIT CHANGES ]'}
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full border border-[var(--color-border)] hover:border-[var(--color-crimson)] text-[var(--color-muted)] hover:text-[var(--color-paper)] py-3 font-mono text-xs tracking-widest transition-colors rounded hover:bg-[var(--color-line)]"
                        >
                            [ LOGOUT ]
                        </button>
                    </div>
                </aside>

                <main className="flex-grow lg:ml-64 p-6 md:p-10 relative z-10 w-full overflow-x-hidden">
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
                                    <SectionHeader 
                                        title="Home Page Settings" 
                                        description="Configure the primary branding name, main headline, and subtitle on the opening landing page."
                                    />
                                    <div className="space-y-6">
                                        <AdminInput label="Author Name (Logo)" value={formData.home?.logoName || ""} onChange={e=>setNest('home','logoName',e.target.value)} />
                                        <AdminInput label="Main Headline" value={formData.home?.headline || ""} onChange={e=>setNest('home','headline',e.target.value)} />
                                        <AdminInput textarea rows={3} label="Opening Quote / Subtitle" value={formData.home?.subtitle || ""} onChange={e=>setNest('home','subtitle',e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {activeTab === "profile" && (
                                <div>
                                    <SectionHeader 
                                        title="Biography & Profile Images" 
                                        description="Edit your biographical details, tell your professional story, and arrange your gallery images."
                                    />
                                    <div className="space-y-8">
                                        {/* About Section */}
                                        <div className="bg-[var(--color-line)] border border-[var(--color-border)] rounded-lg p-6 shadow-sm">
                                            <h3 className="text-lg font-display text-[var(--color-paper)] mb-4 border-b border-[var(--color-border)] pb-3">
                                                📝 Biography
                                            </h3>
                                            <AdminInput 
                                                textarea 
                                                rows={10} 
                                                label="About Me / Biography" 
                                                value={formData.profile?.about || ""} 
                                                onChange={e=>setNest('profile','about',e.target.value)} 
                                            />
                                        </div>

                                        {/* Multiple Images Section */}
                                        <div className="bg-[var(--color-line)] border border-[var(--color-border)] rounded-lg p-6 shadow-sm">
                                            <h3 className="text-lg font-display text-[var(--color-paper)] mb-6 border-b border-[var(--color-border)] pb-3">
                                                🖼️ Profile Images Gallery
                                            </h3>
                                            <ProfileImagesManager 
                                                images={formData.profile?.images || []} 
                                                onChange={updateProfileImages}
                                            />
                                        </div>

                                        {/* Tips Section */}
                                        <div className="bg-[var(--color-crimson)]/5 border border-[var(--color-crimson)]/30 rounded-lg p-6">
                                            <h4 className="text-sm font-mono text-[var(--color-crimson)] mb-4 flex items-center gap-2">
                                                <span>💡</span> Profile Tips:
                                            </h4>
                                            <ul className="text-xs text-[var(--color-muted)] space-y-2 font-mono">
                                                <li>• <span className="text-[var(--color-paper)]">Biography:</span> Write 2-3 paragraphs about yourself, your journey, and passion</li>
                                                <li>• <span className="text-[var(--color-paper)]">Images:</span> Upload 3-5 high-quality photos showing different aspects</li>
                                                <li>• <span className="text-[var(--color-paper)]">Order:</span> First image is main profile, others show in carousel</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "aboutpage" && (
                                <div>
                                    <SectionHeader 
                                        title="About Page Settings" 
                                        description="Configure your current location, work availability, core professional values, and personal strengths."
                                    />
                                    
                                    <div className="space-y-8">
                                        <div className="bg-[var(--color-line)] border border-[var(--color-border)] rounded-lg p-6 space-y-6 shadow-sm">
                                            <h3 className="text-lg font-display text-[var(--color-paper)] border-b border-[var(--color-border)] pb-3">
                                                📍 Basic Information
                                            </h3>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <AdminInput 
                                                    label="Your Location" 
                                                    placeholder="e.g., Remote • Worldwide"
                                                    value={formData.aboutPage?.location || ""} 
                                                    onChange={e => setNest('aboutPage','location',e.target.value)} 
                                                />
                                                
                                                <AdminInput 
                                                    label="Your Specialization" 
                                                    placeholder="e.g., Full-Stack Developer"
                                                    value={formData.aboutPage?.specialization || ""} 
                                                    onChange={e => setNest('aboutPage','specialization',e.target.value)} 
                                                />
                                                
                                                <AdminInput 
                                                    label="Availability Text" 
                                                    placeholder="e.g., Available for work"
                                                    value={formData.aboutPage?.availability || ""} 
                                                    onChange={e => setNest('aboutPage','availability',e.target.value)} 
                                                />
                                                
                                                <div>
                                                    <label className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest mb-2 border-l-2 border-[var(--color-crimson)] pl-2">
                                                        Availability Status
                                                    </label>
                                                    <select 
                                                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-paper)] p-3 font-serif focus:border-[var(--color-crimson)] focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]/50 transition-all rounded-md shadow-inner"
                                                        value={formData.aboutPage?.availabilityStatus || "open"}
                                                        onChange={e => setNest('aboutPage','availabilityStatus',e.target.value)}
                                                    >
                                                        <option value="open">🟢 Open for Work</option>
                                                        <option value="limited">🟡 Limited Availability</option>
                                                        <option value="closed">🔴 Not Available</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-[var(--color-line)] border border-[var(--color-border)] rounded-lg p-6 space-y-4 shadow-sm">
                                            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
                                                <h3 className="text-lg font-display text-[var(--color-paper)]">
                                                    💡 Your Core Values & Approach
                                                </h3>
                                                <button 
                                                    onClick={() => {
                                                        const newValues = formData.aboutPage?.coreValues || [];
                                                        newValues.push({ title: "", desc: "", icon: "⭐" });
                                                        setNest('aboutPage', 'coreValues', newValues);
                                                    }}
                                                    className="font-mono text-xs text-[var(--color-crimson)] hover:text-[var(--color-paper)] transition-colors"
                                                >
                                                    [ + ADD VALUE ]
                                                </button>
                                            </div>
                                            
                                            <p className="text-sm text-[var(--color-muted)] font-mono">
                                                Add 4 core values that represent your work philosophy
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(formData.aboutPage?.coreValues || []).map((value, i) => (
                                                    <div key={i} className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 space-y-3 shadow-inner">
                                                        <div className="flex justify-between items-start">
                                                            <input
                                                                type="text"
                                                                placeholder="Icon (emoji)"
                                                                value={value.icon || ""}
                                                                onChange={e => {
                                                                    const newValues = [...(formData.aboutPage?.coreValues || [])];
                                                                    newValues[i] = { ...newValues[i], icon: e.target.value };
                                                                    setNest('aboutPage', 'coreValues', newValues);
                                                                }}
                                                                className="w-16 text-center text-2xl bg-transparent border-none focus:outline-none"
                                                            />
                                                            <button 
                                                                onClick={() => {
                                                                    const newValues = (formData.aboutPage?.coreValues || []).filter((_, idx) => idx !== i);
                                                                    setNest('aboutPage', 'coreValues', newValues);
                                                                }}
                                                                className="text-[var(--color-muted)] hover:text-red-500 text-xl font-bold"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                        
                                                        <AdminInput 
                                                            label="Value Title" 
                                                            placeholder="e.g., Problem Solving"
                                                            value={value.title || ""} 
                                                            onChange={e => {
                                                                const newValues = [...(formData.aboutPage?.coreValues || [])];
                                                                newValues[i] = { ...newValues[i], title: e.target.value };
                                                                setNest('aboutPage', 'coreValues', newValues);
                                                            }}
                                                        />
                                                        
                                                        <AdminInput 
                                                            textarea
                                                            rows={2}
                                                            label="Description" 
                                                            placeholder="Brief explanation..."
                                                            value={value.desc || ""} 
                                                            onChange={e => {
                                                                const newValues = [...(formData.aboutPage?.coreValues || [])];
                                                                newValues[i] = { ...newValues[i], desc: e.target.value };
                                                                setNest('aboutPage', 'coreValues', newValues);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {(!formData.aboutPage?.coreValues || formData.aboutPage.coreValues.length === 0) && (
                                                <div className="text-center py-8 border-2 border-dashed border-[var(--color-border)] rounded-lg">
                                                    <p className="text-[var(--color-muted)] font-mono text-sm">
                                                        No core values added. Click "+ ADD VALUE" to start.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-[var(--color-line)] border border-[var(--color-border)] rounded-lg p-6 space-y-4 shadow-sm">
                                            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
                                                <h3 className="text-lg font-display text-[var(--color-paper)]">
                                                    💪 Professional Strengths
                                                </h3>
                                                <button 
                                                    onClick={() => {
                                                        const newStrengths = formData.aboutPage?.strengths || [];
                                                        newStrengths.push("");
                                                        setNest('aboutPage', 'strengths', newStrengths);
                                                    }}
                                                    className="font-mono text-xs text-[var(--color-crimson)] hover:text-[var(--color-paper)] transition-colors"
                                                >
                                                    [ + ADD STRENGTH ]
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                {(formData.aboutPage?.strengths || []).map((strength, i) => (
                                                    <div key={i} className="flex gap-3 items-center">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                placeholder="e.g., Project Leadership"
                                                                value={strength || ""}
                                                                onChange={e => {
                                                                    const newStrengths = [...(formData.aboutPage?.strengths || [])];
                                                                    newStrengths[i] = e.target.value;
                                                                    setNest('aboutPage', 'strengths', newStrengths);
                                                                }}
                                                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-paper)] p-3 font-serif focus:border-[var(--color-crimson)] focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]/50 placeholder:text-[var(--color-muted)] transition-all rounded-md shadow-inner"
                                                            />
                                                        </div>
                                                        <button 
                                                            onClick={() => {
                                                                const newStrengths = (formData.aboutPage?.strengths || []).filter((_, idx) => idx !== i);
                                                                setNest('aboutPage', 'strengths', newStrengths);
                                                            }}
                                                            className="text-[var(--color-muted)] hover:text-red-500 text-xl font-bold px-3"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === "soundtrack" && (
                                <div>
                                    <SectionHeader 
                                        title="Background Audio" 
                                        onAddItem={() => addItem('soundtrack', { url: "", title: "", artist: "" })} 
                                        buttonLabel="[ + ADD TRACK ]" 
                                        description="Provide background soundtrack music for visitors. You can upload tracks and edit details."
                                    />
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {formData.soundtrack?.map((track, i) => (
                                                <motion.div key={i} variants={listItemVariants} initial="hidden" animate="visible" exit="exit" layout className="bg-[var(--color-line)] border border-[var(--color-border)] rounded-lg p-4 relative shadow-sm">
                                                    <button onClick={() => delItem('soundtrack',i)} className="absolute top-2 right-2 text-[var(--color-muted)] hover:text-red-500 text-xl font-bold">&times;</button>
                                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                        <AdminInput label="Track Title" value={track.title || ""} onChange={e => setArrObj('soundtrack', i, 'title', e.target.value)} />
                                                        <AdminInput label="Artist Name" value={track.artist || ""} onChange={e => setArrObj('soundtrack', i, 'artist', e.target.value)} />
                                                    </div>
                                                    <AudioUploader currentAudio={track.url || ""} onUpload={url => setArrObj('soundtrack', i, 'url', url)} onDelete={() => setArrObj('soundtrack', i, 'url', "")} />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {formData.soundtrack?.length === 0 && <p className="text-center text-[var(--color-muted)] font-mono text-xs py-10">NO TRACKS FOUND</p>}
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === "skills" && (
                                <div>
                                    <SectionHeader 
                                        title="Skills & Abilities" 
                                        onAddItem={()=>addItem('skills', { name: "", level: "Intermediate" })} 
                                        buttonLabel="[ + ADD SKILL ]" 
                                        description="List your tech stack skills and assign proficiency levels from Beginner to Expert."
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AnimatePresence>
                                            {formData.skills?.map((skill, i) => {
                                                const skillData = typeof skill === 'string' ? { name: skill, level: "Intermediate" } : skill;
                                                return (
                                                    <motion.div key={i} variants={listItemVariants} initial="hidden" animate="visible" exit="exit" layout className="bg-[var(--color-line)] border border-[var(--color-border)] rounded-lg p-4 space-y-4 shadow-sm">
                                                        <AdminInput label="Skill Name" value={skillData.name || ""} onChange={e=>setArrObj('skills',i,'name',e.target.value)} />
                                                        <div>
                                                            <label className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest mb-2 border-l-2 border-[var(--color-crimson)] pl-2">Proficiency Level</label>
                                                            <select className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-paper)] p-3 font-serif focus:border-[var(--color-crimson)] focus:outline-none focus:ring-1 focus:ring-[var(--color-crimson)]/50 transition-all rounded-md shadow-inner" value={skillData.level || "Intermediate"} onChange={e=>setArrObj('skills',i,'level',e.target.value)}>
                                                                <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Master</option>
                                                            </select>
                                                        </div>
                                                        <button onClick={()=>delItem('skills',i)} className="font-mono text-[10px] text-[var(--color-muted)] hover:text-red-500 transition-colors">[ DELETE ]</button>
                                                    </motion.div>
                                                )
                                            })}
                                        </AnimatePresence>
                                    </div>
                                    {formData.skills?.length === 0 && <p className="text-center text-[var(--color-muted)] font-mono text-xs py-10">NO SKILLS FOUND</p>}
                                </div>
                            )}

                            {activeTab === "experience" && (
                                <div>
                                    <SectionHeader 
                                        title="Work Experience" 
                                        onAddItem={()=>addItem('experience', {role:"", company:"", year:""})} 
                                        buttonLabel="[ + ADD EXPERIENCE ]" 
                                        description="Outline your past roles, companies, and timelines in a chronological sequence."
                                    />
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {formData.experience?.map((exp, i) => (
                                                <motion.div key={i} variants={listItemVariants} initial="hidden" animate="visible" exit="exit" layout className="bg-[var(--color-line)] border border-[var(--color-border)] rounded-lg p-4 relative space-y-4 shadow-sm">
                                                    <button onClick={() => delItem('experience',i)} className="absolute top-2 right-2 text-[var(--color-muted)] hover:text-red-500 text-xl font-bold">&times;</button>
                                                    <AdminInput label="Job Title / Role" value={exp.role || ""} onChange={e=>setArrObj('experience',i,'role',e.target.value)} />
                                                    <AdminInput label="Company Name" value={exp.company || ""} onChange={e=>setArrObj('experience',i,'company',e.target.value)} />
                                                    <AdminInput label="Duration / Year" placeholder="e.g., 2020-2023" value={exp.year || ""} onChange={e=>setArrObj('experience',i,'year',e.target.value)} />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    {formData.experience?.length === 0 && <p className="text-center text-[var(--color-muted)] font-mono text-xs py-10">NO EXPERIENCE FOUND</p>}
                                </div>
                            )}

                            {activeTab === "projects" && (
                                <div>
                                    <SectionHeader 
                                        title="Projects Portfolio" 
                                        onAddItem={()=>addItem('projects', {name:"",description:"",image:"",link:"",technologies:[]})} 
                                        buttonLabel="[ + NEW PROJECT ]" 
                                        description="Highlight your crafted projects, technology tags, preview images, and links."
                                    />
                                    <div className="space-y-6">
                                        <AnimatePresence>
                                            {formData.projects?.map((p, i) => (
                                                <motion.div key={i} variants={listItemVariants} initial="hidden" animate="visible" exit="exit" layout className="bg-[var(--color-line)] border border-[var(--color-border)] rounded-lg p-4 shadow-sm">
                                                    <div className="flex justify-between items-start">
                                                        <p className="font-mono text-xs text-[var(--color-muted)] mb-4">PROJECT #{i+1}</p>
                                                        <button onClick={()=>delItem('projects',i)} className="text-[var(--color-muted)] hover:text-red-500 text-xl font-bold -mt-2">&times;</button>
                                                    </div>
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                        <div className="lg:col-span-2 space-y-4">
                                                            <AdminInput label="Project Name" value={p.name || ""} onChange={e=>setArrObj('projects',i,'name',e.target.value)} />
                                                            <AdminInput label="Project Link / URL" value={p.link || ""} onChange={e=>setArrObj('projects',i,'link',e.target.value)} />
                                                            <AdminInput textarea rows={4} label="Description" value={p.description || ""} onChange={e=>setArrObj('projects',i,'description',e.target.value)} />
                                                            
                                                            <TechStackInput 
                                                                technologies={p.technologies || []} 
                                                                onChange={(newTechs) => setArrObj('projects', i, 'technologies', newTechs)}
                                                                projectIndex={i}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest border-l-2 border-[var(--color-crimson)] pl-2">Project Image</label>
                                                            <ImageUploader currentImage={p.image || ""} onUpload={url=>setArrObj('projects',i,'image',url)} onDelete={()=>setArrObj('projects',i,'image',"")} />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    {formData.projects?.length === 0 && <p className="text-center text-[var(--color-muted)] font-mono text-xs py-10">NO PROJECTS FOUND</p>}
                                </div>
                            )}

                            {activeTab === "contact" && (
                                <div>
                                    <SectionHeader 
                                        title="Contact Information" 
                                        description="Update your active social links and email address to maintain connection routes."
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <AdminInput label="Email Address" placeholder="your@email.com" value={formData.contact?.email || ""} onChange={e=>setNest('contact','email',e.target.value)} />
                                        <AdminInput label="LinkedIn URL" placeholder="https://linkedin.com/in/..." value={formData.contact?.linkedin || ""} onChange={e=>setNest('contact','linkedin',e.target.value)} />
                                        <AdminInput label="GitHub URL" placeholder="https://github.com/..." value={formData.contact?.github || ""} onChange={e=>setNest('contact','github',e.target.value)} />
                                        <AdminInput label="Instagram URL" placeholder="https://instagram.com/..." value={formData.contact?.instagram || ""} onChange={e=>setNest('contact','instagram',e.target.value)} />
                                        <AdminInput label="Twitter / X URL" placeholder="https://twitter.com/..." value={formData.contact?.twitter || ""} onChange={e=>setNest('contact','twitter',e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {activeTab === "messages" && (
                                <div>
                                    <SectionHeader 
                                        title="Received Messages" 
                                        onAddItem={fetchMessages} 
                                        buttonLabel="[ ↻ REFRESH ]" 
                                        description="Read and manage direct messages sent by visitors through the terminal connection."
                                    />
                                    {loadingMessages ? (
                                        <p className="text-center text-[var(--color-muted)] font-mono text-xs py-10 animate-pulse">
                                            RETRIEVING INCOMING TRANSMISSIONS...
                                        </p>
                                    ) : messages.length === 0 ? (
                                        <p className="text-center text-[var(--color-muted)] font-mono text-xs py-10 border border-dashed border-[var(--color-border)] rounded-xl">
                                            NO TRANSMISSIONS RECEIVED YET
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((msg) => (
                                                <div 
                                                    key={msg._id} 
                                                    className="relative border border-[var(--color-border)] rounded-xl p-5 md:p-6 bg-[var(--color-line)]/20 hover:border-[var(--color-crimson)]/50 transition-all duration-300 shadow-sm"
                                                >
                                                    <button 
                                                        onClick={() => deleteMessage(msg._id)} 
                                                        className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-red-500 text-sm font-mono tracking-wider transition-colors border border-[var(--color-border)] hover:border-red-500/50 px-2.5 py-1 rounded"
                                                        title="Delete message"
                                                    >
                                                        [ DELETE ]
                                                    </button>
                                                    <div className="space-y-3">
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 items-baseline">
                                                            <h4 className="font-display text-base text-[var(--color-paper)]">
                                                                {msg.name}
                                                            </h4>
                                                            <a 
                                                                href={`mailto:${msg.email}`} 
                                                                className="font-mono text-xs text-[var(--color-crimson)] hover:underline"
                                                            >
                                                                &lt;{msg.email}&gt;
                                                            </a>
                                                            <span className="font-mono text-[10px] text-[var(--color-muted)] ml-auto">
                                                                {new Date(msg.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        {msg.subject && (
                                                            <div className="font-mono text-xs text-[var(--color-paper)] opacity-80 border-b border-[var(--color-border)]/50 pb-2">
                                                                <span className="text-[var(--color-muted)]">Subject:</span> {msg.subject}
                                                            </div>
                                                        )}
                                                        <p className="text-sm text-[var(--color-paper)] opacity-90 leading-relaxed font-serif whitespace-pre-wrap mt-2">
                                                            {msg.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}