import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import Button from "../components/ui/Button";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = usePortfolio();
  
  // State untuk Zoom Gambar
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0c0c0c]"></div>;

  const projectIndex = parseInt(id);
  const project = data?.projects?.[projectIndex];

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#0c0c0c] text-[#e5e5e5]">
        <h1 className="text-3xl font-display font-bold mb-4 text-[#9f1239]">ARCHIVE NOT FOUND</h1>
        <Button onClick={() => navigate("/projects")}>RETURN TO LIST</Button>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* 
          PERBAIKAN DISINI:
          - pt-32 (128px) untuk Mobile
          - md:pt-44 (176px) untuk Desktop
          Ini memberi jarak yang SANGAT CUKUP agar tidak tertutup Navbar 
      */}
      <div className="min-h-screen pb-20 pt-32 md:pt-44 px-4 md:px-12 bg-[#0c0c0c]">
        
        {/* --- HEADER SECTION --- */}
        <div className="max-w-6xl mx-auto mb-12 border-b border-[#333] pb-8">
            <Link to="/projects" className="inline-block mb-6 font-mono text-xs text-zinc-500 hover:text-[#9f1239] transition-colors">
                &larr; BACK TO ARCHIVES
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="font-mono text-xs text-[#9f1239] tracking-[0.2em] mb-2 uppercase">
                        Project File #{String(projectIndex + 1).padStart(2, '0')}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-[#e5e5e5] leading-tight">
                        {project.name}
                    </h1>
                </div>
                
                {/* Action Button (Desktop) */}
                <div className="hidden md:block">
                    {project.link ? (
                        <a href={project.link} target="_blank" rel="noreferrer">
                            <Button className="shadow-[0_0_20px_rgba(159,18,57,0.3)]">LAUNCH SYSTEM ↗</Button>
                        </a>
                    ) : (
                         <span className="font-mono text-xs text-zinc-600 border border-[#333] px-3 py-2">[ OFFLINE ]</span>
                    )}
                </div>
            </div>
        </div>

        {/* --- MAIN IMAGE SHOWCASE (UKURAN ASLI / FULL WIDTH) --- */}
        <div className="max-w-6xl mx-auto mb-16 relative group">
            
            {/* Dekorasi Sudut "Tech" */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-[#9f1239]"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t border-r border-[#9f1239]"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b border-l border-[#9f1239]"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-[#9f1239]"></div>

            <div className="bg-[#111] border border-[#333] p-2 md:p-4 rounded-sm overflow-hidden relative">
                
                {/* Label Teknis */}
                <div className="absolute top-6 right-6 z-10 font-mono text-[10px] bg-black/70 backdrop-blur px-2 py-1 text-white border border-white/20">
                    VISUAL_OUTPUT.JPG
                </div>

                {project.image ? (
                    <img 
                        src={project.image} 
                        alt={project.name} 
                        onClick={() => setIsZoomed(true)}
                        // CSS KUNCI: w-full h-auto (Agar tinggi menyesuaikan gambar asli)
                        className="w-full h-auto object-contain cursor-zoom-in hover:opacity-95 transition-opacity shadow-2xl" 
                    />
                ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-[#0c0c0c] text-zinc-600 font-mono text-xs border border-dashed border-[#333]">
                        [ NO VISUAL DATA AVAILABLE ]
                    </div>
                )}
            </div>
            
            <p className="mt-2 text-center font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                /// CLICK IMAGE TO INSPECT FULL RESOLUTION
            </p>
        </div>

        {/* --- DESCRIPTION & DETAILS --- */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
            
            {/* Description */}
            <div className="md:col-span-2">
                <h2 className="font-display text-2xl text-white mb-6 border-l-4 border-[#9f1239] pl-4">
                    Report Analysis
                </h2>
                <div className="prose prose-invert prose-lg text-zinc-400 font-serif leading-loose whitespace-pre-line">
                    {project.description || "Data deskripsi tidak tersedia dalam arsip ini."}
                </div>
            </div>

            {/* Meta Data Sidebar */}
            <div className="md:col-span-1 space-y-8">
                <div className="border border-[#333] p-6 bg-[#0c0c0c]">
                    <h3 className="font-mono text-xs text-[#9f1239] uppercase tracking-widest mb-4 border-b border-[#333] pb-2">
                        Status
                    </h3>
                    <div className="space-y-4">
                         <div>
                            <span className="block font-serif text-zinc-500 text-sm italic">Deployed at:</span>
                            {project.link ? (
                                <a href={project.link} target="_blank" rel="noreferrer" className="text-white hover:text-[#9f1239] hover:underline break-all font-mono text-xs">
                                    {new URL(project.link).hostname}
                                </a>
                            ) : (
                                <span className="text-zinc-600 font-mono text-xs">Localhost / Offline</span>
                            )}
                         </div>
                         
                         {/* Action Button (Mobile Only) */}
                         <div className="md:hidden pt-4">
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noreferrer">
                                    <Button className="w-full text-xs">OPEN LINK</Button>
                                </a>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- LIGHTBOX MODAL (ZOOM) --- */}
        {isZoomed && project.image && (
            <div 
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out overflow-auto"
                onClick={() => setIsZoomed(false)}
            >
                <div className="relative max-w-[95vw] max-h-[95vh]">
                    <img 
                        src={project.image} 
                        alt="Zoomed" 
                        className="w-auto h-auto max-w-full max-h-screen object-contain border border-[#333] shadow-[0_0_100px_rgba(0,0,0,1)]"
                    />
                    <button className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 font-mono text-xs border border-white/20">
                        [ CLOSE ]
                    </button>
                </div>
            </div>
        )}

      </div>
    </PageTransition>
  );
}