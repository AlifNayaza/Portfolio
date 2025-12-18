// Enhanced Home.jsx - Mobile Optimized Skills Section
// Ganti bagian Skills di Home.jsx dengan kode ini

import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import RevealText from "../components/ui/RevealText";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const { data } = usePortfolio();
  const { home, skills, projects } = data;
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Function untuk mendapatkan projects yang menggunakan skill tertentu
  const getProjectsForSkill = (skillName) => {
    if (!projects) return [];
    return projects.filter(project => 
      project.technologies?.some(tech => 
        tech.toLowerCase() === skillName.toLowerCase()
      )
    );
  };

  // Function untuk menghitung total usage skill
  const getSkillUsageCount = (skillName) => {
    return getProjectsForSkill(skillName).length;
  };

  return (
    <PageTransition>
      <section className="min-h-[85vh] flex flex-col justify-center relative pl-4 md:pl-16">
        
        <div className="absolute top-0 -left-6 md:-left-12 font-mono text-xs text-[#333] rotate-180 select-none" style={{ writingMode: 'vertical-rl' }}>
            PROLOGUE /// THE BEGINNING
        </div>

        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="font-mono text-xs text-[#9f1239] mb-8 tracking-[0.2em] flex items-center gap-4"
        >
            <span className="w-12 h-[1px] bg-[#9f1239]"></span>
            OPEN TO WORK
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-display leading-[1.1] mb-8 text-[#e5e5e5] max-w-6xl">
           <RevealText 
                text={home?.headline || "The Journey Begins"} 
                type="word"
                delay={1.5}
                className="hover-trigger"
           />
           <span className="text-[#9f1239] animate-pulse">_</span>
        </h1>

        <div className="max-w-2xl relative mt-4">
            <motion.div 
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#333]"
            ></motion.div>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="pl-8 text-lg md:text-xl text-zinc-400 italic font-serif leading-loose break-words"
            >
                "{home?.subtitle || "Loading description..."}"
            </motion.p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            className="mt-16 flex items-center gap-8"
        >
            <Link to="/projects" className="group flex items-center gap-6 hover-trigger">
                <div className="w-16 h-16 border border-[#333] rounded-full flex items-center justify-center group-hover:border-[#9f1239] group-hover:bg-[#9f1239] transition-all duration-500 relative overflow-hidden">
                    <span className="font-mono text-sm relative z-10 group-hover:text-white transition-colors">→</span>
                    <div className="absolute inset-0 bg-[#9f1239] transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full origin-center"></div>
                </div>
                <div className="flex flex-col">
                    <span className="font-mono text-xs tracking-widest text-zinc-500 group-hover:text-white transition-colors">READ CHAPTER II</span>
                    <span className="font-display text-sm text-[#9f1239] opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all">Start Reading</span>
                </div>
            </Link>
        </motion.div>

        {/* ===== MOBILE OPTIMIZED SKILLS SECTION ===== */}
        <div className="w-full max-w-6xl mx-auto border-t border-[#333] pt-12 md:pt-20 mt-12 md:mt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-3">
              <div>
                  <h2 className="text-2xl md:text-4xl font-display mb-2">Arsenal & Abilities<span className="text-[#9f1239]">.</span></h2>
                  <p className="font-serif italic text-zinc-500 text-sm md:text-base">Tap any skill to reveal connected projects.</p>
              </div>
              <div className="font-mono text-[10px] md:text-xs text-[#9f1239] tracking-widest">
                  /// INTERACTIVE
              </div>
          </div>
          
          {/* MOBILE: 2 columns, DESKTOP: 3 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {skills?.map((skill, idx) => {
               const skillName = typeof skill === 'string' ? skill : skill.name;
               const skillLevel = typeof skill === 'string' ? "Intermediate" : skill.level;
               const usageCount = getSkillUsageCount(skillName);
               const relatedProjects = getProjectsForSkill(skillName);
               const isSelected = selectedSkill === skillName;

               let levelScore = 2;
               let levelColor = "text-zinc-500";
               let borderColor = "border-[#333]";
               
               if (skillLevel === "Beginner") { levelScore = 1; levelColor = "text-zinc-500"; }
               if (skillLevel === "Intermediate") { levelScore = 2; levelColor = "text-yellow-600"; }
               if (skillLevel === "Advanced") { levelScore = 3; levelColor = "text-orange-500"; borderColor = "group-hover:border-orange-500/50"; }
               if (skillLevel === "Master") { levelScore = 4; levelColor = "text-[#9f1239]"; borderColor = "group-hover:border-[#9f1239]"; }

               return (
                  <motion.div 
                    key={idx}
                    layout
                    className={`group bg-[#0c0c0c] border ${isSelected ? 'border-[#9f1239] shadow-[0_0_20px_rgba(159,18,57,0.3)]' : `border-[#333] ${borderColor}`} p-3 md:p-6 transition-all duration-500 hover:bg-[#111] relative overflow-hidden cursor-pointer ${isSelected ? 'col-span-2 lg:col-span-3' : ''}`}
                    onClick={() => setSelectedSkill(isSelected ? null : skillName)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                      {/* Background Number - Lebih kecil di mobile */}
                      <div className="absolute -right-2 -top-3 md:-right-4 md:-top-6 text-[60px] md:text-[100px] font-display text-[#1a1a1a] opacity-30 md:opacity-50 group-hover:opacity-100 transition-opacity select-none pointer-events-none">
                          {idx + 1}
                      </div>

                      <div className="relative z-10">
                          {/* Skill Header */}
                          <div className="flex justify-between items-start mb-3 gap-2">
                              <div className="flex-1 min-w-0">
                                  <h3 className="text-base md:text-2xl font-display font-bold text-[#e5e5e5] mb-2 group-hover:translate-x-2 transition-transform break-words leading-tight">
                                      {skillName}
                                  </h3>
                                  
                                  {/* Usage Badge - Lebih kompak di mobile */}
                                  {usageCount > 0 && (
                                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#9f1239]/10 border border-[#9f1239]/30 rounded-sm">
                                          <span className="w-1 h-1 bg-[#9f1239] rounded-full animate-pulse"></span>
                                          <span className="font-mono text-[8px] md:text-[9px] text-[#9f1239] uppercase tracking-wider whitespace-nowrap">
                                              {usageCount} proj{usageCount > 1 ? 's' : ''}
                                          </span>
                                      </div>
                                  )}
                              </div>

                              {/* Click Indicator - Hanya tampil jika ada projects */}
                              {!isSelected && usageCount > 0 && (
                                  <motion.div 
                                      className="text-zinc-600 group-hover:text-[#9f1239] transition-colors font-mono text-[9px] md:text-xs flex-shrink-0"
                                      animate={{ opacity: [0.5, 1, 0.5] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                  >
                                      CLICK
                                  </motion.div>
                              )}
                          </div>

                          <div className="w-8 md:w-12 h-[1px] bg-[#333] group-hover:w-full group-hover:bg-[#9f1239] transition-all duration-700 my-2 md:my-3"></div>

                          {/* Level Info - Lebih kompak di mobile */}
                          <div className="flex items-end justify-between gap-2">
                              <div className="flex flex-col">
                                  <span className="font-mono text-[7px] md:text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5 md:mb-1">Rank</span>
                                  <span className={`font-mono text-[10px] md:text-sm font-bold uppercase tracking-wider ${levelColor}`}>
                                      {skillLevel}
                                  </span>
                              </div>

                              {/* Diamond Indicators */}
                              <div className="flex gap-0.5 md:gap-1.5">
                                  {[1, 2, 3, 4].map((diamond) => (
                                      <span 
                                        key={diamond} 
                                        className={`text-xs md:text-base transition-all duration-300 transform ${diamond <= levelScore ? `${levelColor} scale-110` : "text-[#222]"}`}
                                      >
                                          ◆
                                      </span>
                                  ))}
                              </div>
                          </div>

                          {/* Expanded Projects List - Optimized untuk mobile */}
                          <AnimatePresence>
                              {isSelected && relatedProjects.length > 0 && (
                                  <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.4 }}
                                      className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[#333]"
                                  >
                                      <div className="flex items-center justify-between mb-4">
                                          <h4 className="font-mono text-[10px] md:text-xs text-[#9f1239] uppercase tracking-widest">
                                              Connected Archives
                                          </h4>
                                          <button
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedSkill(null);
                                              }}
                                              className="font-mono text-[9px] md:text-[10px] text-zinc-600 hover:text-white transition-colors px-2 py-1 border border-[#333] hover:border-[#9f1239]"
                                          >
                                              CLOSE
                                          </button>
                                      </div>
                                      
                                      <div className="space-y-2 md:space-y-3">
                                          {relatedProjects.map((project, projIdx) => {
                                              const projectIndex = projects.indexOf(project);
                                              return (
                                                  <Link
                                                      key={projIdx}
                                                      to={`/project/${projectIndex}`}
                                                      onClick={(e) => e.stopPropagation()}
                                                      className="block group/project p-3 md:p-4 bg-[#111] border border-[#222] hover:border-[#9f1239] transition-all"
                                                  >
                                                      <div className="flex justify-between items-start gap-3">
                                                          <div className="flex-1 min-w-0">
                                                              <div className="font-mono text-[8px] md:text-[9px] text-zinc-600 mb-1">
                                                                  FILE #{String(projectIndex + 1).padStart(2, '0')}
                                                              </div>
                                                              <h5 className="font-display text-base md:text-lg text-white group-hover/project:text-[#9f1239] transition-colors mb-1 md:mb-2 break-words">
                                                                  {project.name}
                                                              </h5>
                                                              <p className="text-zinc-500 text-xs md:text-sm font-serif line-clamp-2 leading-relaxed">
                                                                  {project.description}
                                                              </p>
                                                          </div>
                                                          <div className="text-zinc-600 group-hover/project:text-[#9f1239] transition-colors font-mono text-xs md:text-sm flex-shrink-0">
                                                              →
                                                          </div>
                                                      </div>
                                                  </Link>
                                              );
                                          })}
                                      </div>
                                  </motion.div>
                              )}

                              {isSelected && relatedProjects.length === 0 && (
                                  <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[#333] text-center"
                                  >
                                      <p className="text-zinc-600 font-mono text-xs italic">
                                          No projects found using this skill yet.
                                      </p>
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>
                  </motion.div>
               )
            })}
          </div>

          {/* Legend - Lebih kompak di mobile */}
          <div className="mt-6 md:mt-8 p-3 md:p-4 border border-[#333] bg-[#0c0c0c]">
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-6 items-start sm:items-center justify-between text-[10px] md:text-xs font-mono text-zinc-600">
                  <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#9f1239] rounded-full animate-pulse"></span>
                      <span>Active Usage</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <span>◆◆◆◆</span>
                      <span>Proficiency</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="text-[#9f1239]">CLICK</span>
                      <span>View Projects</span>
                  </div>
              </div>
          </div>
        </div>

      </section>
    </PageTransition>
  );
}