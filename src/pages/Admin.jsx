import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImageUploader from "../components/admin/ImageUploader";
import AudioUploader from "../components/admin/AudioUploader";
import { usePortfolio } from "../context/PortfolioContext";

const API_URL = "/.netlify/functions/portfolio";

const AdminInput = ({ label, textarea, ...props }) => {
    const Comp = textarea ? "textarea" : "input";
    return (
        <div className="w-full mb-4">
            <label className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-[#9f1239] pl-2">
                {label}
            </label>
            <Comp 
                className="w-full bg-[#111] border border-[#333] text-[#e5e5e5] p-3 font-serif focus:border-[#9f1239] focus:outline-none placeholder:text-zinc-700 transition-colors"
                {...props}
            />
        </div>
    )
}

export default function Admin() {
  const { refreshData } = usePortfolio();
  const [password] = useState(localStorage.getItem("admin_session") || "");
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    home: { logoName: "", headline: "", subtitle: "" },
    profile: { about: "", avatarUrl: "" },
    soundtrack: [], // PERUBAHAN: Dari 'music' object menjadi 'soundtrack' array
    skills: [],
    experience: [],
    projects: [],
    contact: { email: "", linkedin: "", github: "", instagram: "", twitter: "" }
  });

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        let fetchedData = res.data;

        // --- LOGIKA PERBAIKAN DI SINI ---
        // Melakukan migrasi data dari format 'music' (object) ke 'soundtrack' (array)
        // jika data lama masih ada di database.
        if (fetchedData) {
          // Kondisi: Jika 'soundtrack' tidak ada, TAPI 'music' yang lama ada
          if (!fetchedData.soundtrack && fetchedData.music && typeof fetchedData.music === 'object' && fetchedData.music.url) {
            
            // 1. Buat field 'soundtrack' baru dari data 'music' yang lama
            fetchedData.soundtrack = [fetchedData.music];
            
            // 2. Hapus field 'music' yang lama agar tidak ada duplikasi saat disimpan
            delete fetchedData.music;
          }
        }
        // --- AKHIR LOGIKA PERBAIKAN ---

        if(fetchedData) {
          // Set state dengan data yang sudah bersih dan termigrasi
          setFormData(prev => ({ ...prev, ...fetchedData }));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch portfolio data:", err);
        setLoading(false);
        toast.error("Gagal memuat data dari server.");
      });
  }, []);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(API_URL, formData, { headers: { Authorization: password } });
      toast.success("MANUSCRIPT UPDATED.");
      refreshData();
    } catch (e) {
      toast.error("ERROR: UNAUTHORIZED.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { localStorage.removeItem("admin_session"); window.location.href = "/login"; };

  const setNest = (sec, f, v) => setFormData(p => ({...p, [sec]: { ...p[sec], [f]: v }}));
  const setArrObj = (section, index, field, value) => {
    const newArr = [...(formData[section] || [])];
    newArr[index] = { ...newArr[index], [field]: value };
    setFormData(prev => ({ ...prev, [section]: newArr }));
  };  
  const addItem = (sec, tpl) => setFormData(p => ({...p, [sec]: [...(p[sec]||[]), tpl]}));
  const delItem = (section, index) => {
    if(!window.confirm("Yakin ingin menghapus item ini?")) return;
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };
  
  if (loading) return <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center font-mono text-xs text-white">INITIALIZING...</div>;

  const tabs = [
    { id: "home", label: "01 // PROLOGUE" },
    { id: "profile", label: "02 // CHARACTER" },
    { id: "skills", label: "03 // ABILITIES" },
    { id: "projects", label: "04 // ARCHIVES" },
    { id: "experience", label: "05 // TIMELINE" },
    { id: "soundtrack", label: "06 // SOUNDTRACK" }, // PERUBAHAN NAMA TAB
    { id: "contact", label: "07 // SIGNAL" },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e5e5e5] pb-20 font-serif">
      <header className="sticky top-0 z-40 bg-[#0c0c0c]/95 border-b border-[#333] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <span className="text-[#9f1239] text-xl">§</span>
            <h1 className="font-display font-bold text-lg tracking-widest">MANUSCRIPT EDITOR</h1>
        </div>
        <div className="flex gap-6 font-mono text-xs">
          <button onClick={handleLogout} className="text-zinc-500 hover:text-red-500">[ LOGOUT ]</button>
          <button onClick={handleSave} disabled={saving} className="text-[#9f1239] hover:text-white transition-colors">
            {saving ? "[ SAVING... ]" : "[ SAVE CHANGES ]"}
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto mt-12 px-6 gap-12">
        <aside className="w-full md:w-64 flex-shrink-0 border-r border-[#333] pr-6">
          <div className="flex md:flex-col gap-2 overflow-x-auto pb-4">
            {tabs.map(t => (
              <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`px-4 py-3 text-left font-mono text-xs tracking-widest transition-all ${activeTab === t.id ? "text-[#9f1239] border-l-2 border-[#9f1239] bg-[#111]" : "text-zinc-600 hover:text-zinc-300 border-l-2 border-transparent"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </aside>

        {/* EDITOR AREA */}
        <main className="flex-1 min-h-[500px]">
          
          {/* --- TAB HOME --- */}
          {activeTab === "home" && (
            <div className="animate-in fade-in space-y-8">
               <h2 className="text-3xl font-display mb-8">Prologue Settings</h2>
               <div className="p-6 border border-[#333] bg-[#0c0c0c]">
                   <AdminInput label="Brand Name (Navbar)" placeholder="Ex: ALIF" value={formData.home?.logoName} onChange={e=>setNest('home','logoName',e.target.value)} />
                   <AdminInput label="Main Headline" placeholder="The Opening Sentence..." value={formData.home?.headline} onChange={e=>setNest('home','headline',e.target.value)} />
                   <AdminInput textarea rows={4} label="Subtitle / Intro" value={formData.home?.subtitle} onChange={e=>setNest('home','subtitle',e.target.value)} />
               </div>
            </div>
          )}

          {/* --- TAB PROFILE --- */}
          {activeTab === "profile" && (
            <div className="animate-in fade-in space-y-8">
               <h2 className="text-3xl font-display mb-8">Character Sheet</h2>
               <div className="grid md:grid-cols-2 gap-8">
                   <div>
                       <AdminInput textarea rows={12} label="Biography" value={formData.profile?.about} onChange={e=>setNest('profile','about',e.target.value)} />
                   </div>
                   <div className="space-y-4">
                       <p className="font-mono text-[10px] uppercase text-zinc-500 tracking-widest border-l-2 border-[#9f1239] pl-2">Portrait</p>
                       <ImageUploader currentImage={formData.profile?.avatarUrl} onUpload={url => setNest('profile', 'avatarUrl', url)} onDelete={() => setNest('profile', 'avatarUrl', "")} />
                   </div>
               </div>
            </div>
          )}

          {/* --- TAB SOUNDTRACK (SEBELUMNYA MUSIC) --- */}
          {activeTab === "soundtrack" && (
            <div className="animate-in fade-in space-y-8">
               <div className="flex justify-between items-end border-b border-[#333] pb-4">
                  <h2 className="text-3xl font-display">Background Audio</h2>
                  <button 
                      onClick={() => addItem('soundtrack', { url: "", title: "", artist: "" })}
                      className="font-mono text-xs text-[#9f1239] hover:underline hover:bg-[#111] px-2 py-1 border border-transparent hover:border-[#333] transition-all"
                  >
                      [ + ADD NEW TRACK ]
                  </button>
               </div>
               
               {formData.soundtrack?.length === 0 && (
                   <div className="text-center py-10 border border-dashed border-[#333] font-mono text-xs text-zinc-600">
                       NO TRACKS FOUND. ADD A NEW ENTRY.
                   </div>
               )}

               <div className="space-y-6">
                  {formData.soundtrack?.map((track, i) => (
                      <div key={i} className="p-6 border border-[#333] bg-[#0c0c0c] hover:border-[#9f1239] transition-colors relative">
                           <div className="absolute top-2 right-3 font-mono text-[10px] text-[#333]">
                               TRACK #{String(i + 1).padStart(2, '0')}
                           </div>
                           <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                              <AdminInput label="Track Title" value={track.title} onChange={e => setArrObj('soundtrack', i, 'title', e.target.value)} />
                              <AdminInput label="Artist Name" value={track.artist} onChange={e => setArrObj('soundtrack', i, 'artist', e.target.value)} />
                           </div>
                           <div className="mt-6">
                               <p className="font-mono text-[10px] uppercase text-zinc-500 tracking-widest border-l-2 border-[#9f1239] pl-2 mb-4">Audio File</p>
                               <AudioUploader 
                                  currentAudio={track.url} 
                                  onUpload={url => setArrObj('soundtrack', i, 'url', url)} 
                                  onDelete={() => setArrObj('soundtrack', i, 'url', "")}
                                />
                           </div>
                           <button onClick={() => delItem('soundtrack', i)} className="mt-4 text-zinc-600 hover:text-red-500 font-mono text-[10px] border-b border-transparent hover:border-red-500 transition-all">
                              [ DELETE TRACK ]
                           </button>
                      </div>
                  ))}
               </div>
            </div>
          )}

          {/* --- TAB SKILLS (ADMIN) --- */}
          {activeTab === "skills" && (
              <div className="animate-in fade-in space-y-8">
                 <div className="flex justify-between items-end border-b border-[#333] pb-4">
                    <h2 className="text-3xl font-display">Abilities</h2>
                    <button 
                        onClick={()=>addItem('skills', { name: "", level: "Intermediate" })} 
                        className="font-mono text-xs text-[#9f1239] hover:underline hover:bg-[#111] px-2 py-1 border border-transparent hover:border-[#333] transition-all"
                    >
                        [ + ADD NEW ABILITY ]
                    </button>
                 </div>
                 
                 {formData.skills?.length === 0 && (
                     <div className="text-center py-10 border border-dashed border-[#333] font-mono text-xs text-zinc-600">
                         NO DATA FOUND. ADD NEW ENTRY.
                     </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.skills?.map((skill, i) => {
                        // Pastikan data selalu Object (Handle jika ada data lama berupa string)
                        const skillData = typeof skill === 'string' ? { name: skill, level: "Intermediate" } : skill;
                        
                        // Helper warna untuk Admin Preview agar Admin tau bedanya
                        let colorClass = "text-zinc-500";
                        if(skillData.level === "Intermediate") colorClass = "text-yellow-600";
                        if(skillData.level === "Advanced") colorClass = "text-orange-500";
                        if(skillData.level === "Master") colorClass = "text-red-600";

                        return (
                            <div key={i} className="border border-[#333] bg-[#0c0c0c] p-5 flex flex-col gap-4 group hover:border-[#9f1239] transition-colors relative">
                                
                                {/* Nomor Index (Dekorasi) */}
                                <div className="absolute top-2 right-3 font-mono text-[10px] text-[#333]">
                                    {String(i + 1).padStart(2, '0')}
                                </div>

                                {/* 1. EDIT NAMA SKILL */}
                                <div className="flex justify-between pt-2">
                                    <input 
                                        className="w-full bg-transparent border-b border-[#333] text-[#e5e5e5] text-lg font-display pb-1 focus:border-[#9f1239] outline-none placeholder:text-zinc-700 transition-colors" 
                                        value={skillData.name} 
                                        // PENTING: Fungsi Edit Nama
                                        onChange={e=>setArrObj('skills',i,'name',e.target.value)} 
                                        placeholder="Skill Name..."
                                    />
                                </div>

                                {/* 2. EDIT LEVEL & PREVIEW */}
                                <div className="flex items-center justify-between bg-[#111] p-2 border border-[#333]">
                                    <select 
                                        className={`bg-transparent text-xs font-mono uppercase outline-none cursor-pointer w-full ${colorClass}`}
                                        value={skillData.level}
                                        // PENTING: Fungsi Edit Level
                                        onChange={e=>setArrObj('skills',i,'level',e.target.value)}
                                    >
                                        <option value="Beginner">Rank: Beginner</option>
                                        <option value="Intermediate">Rank: Intermediate</option>
                                        <option value="Advanced">Rank: Advanced</option>
                                        <option value="Master">Rank: Master</option>
                                    </select>

                                    {/* Visual Diamond Preview */}
                                    <div className="flex gap-1 text-[10px] pl-4 border-l border-[#333]">
                                        {[1, 2, 3, 4].map(d => {
                                            let active = 1;
                                            if(skillData.level === "Intermediate") active = 2;
                                            if(skillData.level === "Advanced") active = 3;
                                            if(skillData.level === "Master") active = 4;
                                            
                                            return <span key={d} className={d <= active ? colorClass : "text-[#222]"}>◆</span>
                                        })}
                                    </div>
                                </div>

                                {/* 3. TOMBOL HAPUS */}
                                <button 
                                    onClick={()=>delItem('skills',i)} 
                                    className="self-end text-zinc-600 hover:text-red-500 font-mono text-[10px] mt-1 border-b border-transparent hover:border-red-500 transition-all"
                                >
                                    [ DELETE ENTRY ]
                                </button>
                            </div>
                        );
                    })}
                 </div>
              </div>
           )}

           {/* --- TAB EXPERIENCE --- */}
           {activeTab === "experience" && (
              <div className="animate-in fade-in space-y-8">
                 <div className="flex justify-between items-end border-b border-[#333] pb-4">
                    <h2 className="text-3xl font-display">Timeline</h2>
                    <button onClick={()=>addItem('experience', {role:"", company:"", year:""})} className="font-mono text-xs text-[#9f1239] hover:underline">[ + ADD EVENT ]</button>
                 </div>
                 
                 <div className="space-y-6">
                    {formData.experience?.map((exp, i) => (
                        <div key={i} className="p-6 border border-[#333] bg-[#0c0c0c] hover:border-[#9f1239] transition-colors relative">
                             <div className="grid md:grid-cols-2 gap-4">
                                <AdminInput label="Role / Title" value={exp.role} onChange={e=>setArrObj('experience',i,'role',e.target.value)} />
                                <AdminInput label="Company / Place" value={exp.company} onChange={e=>setArrObj('experience',i,'company',e.target.value)} />
                                <AdminInput label="Duration / Year" value={exp.year} onChange={e=>setArrObj('experience',i,'year',e.target.value)} />
                             </div>
                             <button onClick={()=>delItem('experience',i)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 font-mono text-xs">[ DELETE ]</button>
                        </div>
                    ))}
                 </div>
              </div>
           )}

           {/* --- TAB PROJECTS --- */}
           {activeTab === "projects" && (
            <div className="animate-in fade-in space-y-8">
               <div className="flex justify-between items-end border-b border-[#333] pb-4">
                 <h2 className="text-3xl font-display">Archives</h2>
                 <button onClick={()=>addItem('projects', {name:"",description:"",image:"",link:""})} className="font-mono text-xs text-[#9f1239] hover:underline">[ + NEW ENTRY ]</button>
               </div>
               
               <div className="grid gap-8">
                 {formData.projects?.map((p, i) => (
                   <div key={i} className="p-6 border border-[#333] flex flex-col md:flex-row gap-8 hover:border-[#9f1239] transition-colors relative">
                      <div className="absolute top-0 left-0 bg-[#333] text-zinc-400 font-mono text-[10px] px-2">FILE #{i+1}</div>
                      
                      <div className="flex-1">
                         <div className="grid md:grid-cols-2 gap-4">
                             <AdminInput label="Project Name" value={p.name} onChange={e=>setArrObj('projects',i,'name',e.target.value)} />
                             <AdminInput label="Link / URL" value={p.link} onChange={e=>setArrObj('projects',i,'link',e.target.value)} />
                         </div>
                         <AdminInput textarea rows={4} label="Description / Report" value={p.description} onChange={e=>setArrObj('projects',i,'description',e.target.value)} />
                         
                         <button className="mt-2 text-zinc-500 hover:text-red-500 font-mono text-xs" onClick={()=>delItem('projects',i)}>
                            [ DELETE RECORD ]
                         </button>
                      </div>
                      
                      <div className="w-full md:w-56 flex-shrink-0 space-y-2">
                          <p className="font-mono text-[10px] uppercase text-zinc-500 tracking-widest border-l-2 border-[#9f1239] pl-2">Attachment</p>
                          <ImageUploader 
                                currentImage={p.image} 
                                onUpload={url=>setArrObj('projects',i,'image',url)} 
                                onDelete={()=>setArrObj('projects',i,'image',"")} 
                          />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* --- TAB CONTACT --- */}
          {activeTab === "contact" && (
            <div className="animate-in fade-in space-y-8">
               <h2 className="text-3xl font-display mb-8">Signal Frequency</h2>
               <div className="p-6 border border-[#333]">
                   <div className="grid md:grid-cols-2 gap-6">
                       <AdminInput label="Email Address" value={formData.contact?.email} onChange={e=>setNest('contact','email',e.target.value)} />
                       <AdminInput label="LinkedIn" value={formData.contact?.linkedin} onChange={e=>setNest('contact','linkedin',e.target.value)} />
                       <AdminInput label="GitHub" value={formData.contact?.github} onChange={e=>setNest('contact','github',e.target.value)} />
                       <AdminInput label="Instagram" value={formData.contact?.instagram} onChange={e=>setNest('contact','instagram',e.target.value)} />
                       <AdminInput label="Twitter / X" value={formData.contact?.twitter} onChange={e=>setNest('contact','twitter',e.target.value)} />
                   </div>
               </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}