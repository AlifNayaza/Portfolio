import { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// === MOBILE-FRIENDLY PROFILE GALLERY ===
const MobileProfileGallery = ({ images, profileName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (images.length <= 1) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next
        setSelectedIndex((prev) => (prev + 1) % images.length);
      } else {
        // Swipe right - previous
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative">
        <div className="aspect-square border-2 border-[#333] rounded-xl overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-[#9f1239]/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-[#9f1239]">+</span>
            </div>
            <p className="text-sm text-zinc-500">Add profile images</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image */}
      <div className="aspect-square border-2 border-[#333] rounded-xl overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={images[selectedIndex]}
            alt={`${profileName || 'Profile'} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === selectedIndex 
                    ? 'bg-[#9f1239]' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {selectedIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex overflow-x-auto gap-2 mt-3 pb-2 scrollbar-hide">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden transition-all ${
                idx === selectedIndex 
                  ? 'border-[#9f1239]' 
                  : 'border-[#333] hover:border-[#9f1239]'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// === MOBILE-FRIENDLY SKILL CARD ===
const MobileSkillCard = ({ skill, projects, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const skillName = typeof skill === 'string' ? skill : skill.name;
  const skillLevel = typeof skill === 'string' ? "Intermediate" : (skill.level || "Intermediate");
  
  const getProjectsUsingSkill = () => {
    if (!projects || !Array.isArray(projects)) return [];
    
    const skillNameLower = skillName.toLowerCase().trim();
    return projects.filter(project => {
      if (!project.technologies || !Array.isArray(project.technologies)) return false;
      
      return project.technologies.some(tech => {
        const techLower = tech.toLowerCase().trim();
        return techLower === skillNameLower || 
               skillNameLower.includes(techLower) ||
               techLower.includes(skillNameLower);
      });
    });
  };
  
  const projectsUsingSkill = getProjectsUsingSkill();
  const projectCount = projectsUsingSkill.length;
  
  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return 'bg-blue-500';
      case 'intermediate': return 'bg-green-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': 
      case 'master': return 'bg-[#9f1239]';
      default: return 'bg-[#9f1239]';
    }
  };
  
  const levelColor = getLevelColor(skillLevel);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={`bg-[#111] border rounded-lg overflow-hidden ${
        isExpanded ? 'border-[#9f1239]' : 'border-[#333]'
      }`}>
        {/* Skill Header */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-medium text-white truncate">
                  {skillName}
                </h3>
                {projectCount > 0 && (
                  <span className="text-xs bg-[#9f1239]/20 text-[#9f1239] px-2 py-0.5 rounded-full">
                    {projectCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full ${levelColor} bg-opacity-20`}>
                  {skillLevel}
                </span>
                <button className="text-zinc-600 hover:text-white transition-colors text-lg">
                  {isExpanded ? '−' : '+'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1.5 bg-[#333] rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full ${levelColor}`}
              style={{
                width: skillLevel === 'Beginner' ? '25%' :
                       skillLevel === 'Intermediate' ? '50%' :
                       skillLevel === 'Advanced' ? '75%' : '100%'
              }}
            />
          </div>
        </div>
        
        {/* Expanded Projects */}
        <AnimatePresence>
          {isExpanded && projectCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[#333]"
            >
              <div className="p-4">
                <div className="text-xs text-zinc-400 mb-2">Used in projects:</div>
                <div className="space-y-2">
                  {projectsUsingSkill.slice(0, 3).map((project, idx) => (
                    <Link
                      key={idx}
                      to={`/project/${projects.indexOf(project)}`}
                      className="block group/project"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 p-2 rounded hover:bg-[#1a1a1a] transition-colors">
                        <div className="w-8 h-8 bg-[#1a1a1a] border border-[#333] rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-[#9f1239]">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate group-hover/project:text-[#9f1239] transition-colors">
                            {project.name}
                          </div>
                        </div>
                        <span className="text-zinc-600 group-hover/project:text-[#9f1239] transition-colors">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {projectCount === 0 && !isExpanded && (
          <div className="text-xs text-zinc-600 text-center pb-4">
            No projects yet
          </div>
        )}
      </div>
    </motion.div>
  );
};

// === MOBILE-FRIENDLY EXPERIENCE TIMELINE ===
const MobileExperienceTimeline = ({ experience }) => {
  if (!experience || experience.length === 0) return null;
  
  return (
    <div className="space-y-4">
      {experience.map((exp, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative pl-6 pb-4 last:pb-0 border-l border-[#333]"
        >
          <div className="absolute -left-2 top-0 w-3 h-3 bg-[#0c0c0c] border-2 border-[#9f1239] rounded-full"></div>
          
          <div className="bg-[#111] border border-[#333] p-4 rounded-lg">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="flex-1">
                <h3 className="text-base font-medium text-white mb-1">
                  {exp.role || "Position"}
                </h3>
                <p className="text-sm text-zinc-400">
                  {exp.company || "Company"}
                </p>
              </div>
              <div className="font-mono text-xs text-[#9f1239] bg-[#9f1239]/10 px-2 py-1 rounded flex-shrink-0">
                {exp.year || "Year"}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// === MAIN ABOUT COMPONENT ===
export default function About() {
  const { data } = usePortfolio();
  const { profile, experience, skills, projects, contact, aboutPage, home } = data || {};
  const [activeTab, setActiveTab] = useState("about");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const calculateTotalExperience = () => {
    if (!experience || experience.length === 0) return "0";
    
    const years = experience.map(exp => {
      const yearMatch = exp.year?.match(/\d+/g);
      if (yearMatch) {
        const years = yearMatch.map(Number);
        if (years.length === 1) return 1;
        if (years.length === 2) return years[1] - years[0];
      }
      return 1;
    });
    
    const totalYears = years.reduce((sum, year) => sum + year, 0);
    return totalYears > 3 ? `${totalYears}+` : totalYears.toString();
  };

  const getSkillStats = () => {
    if (!skills || skills.length === 0) return { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
    
    const stats = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
    
    skills.forEach(skill => {
      const level = typeof skill === 'string' ? 'intermediate' : (skill.level || 'intermediate').toLowerCase();
      if (stats[level] !== undefined) {
        stats[level]++;
      } else {
        stats.intermediate++;
      }
    });
    
    return stats;
  };

  const skillStats = getSkillStats();
  const totalExperience = calculateTotalExperience();

  const displayData = {
    location: aboutPage?.location || "Remote • Worldwide",
    specialization: aboutPage?.specialization || "Full-Stack Development",
    availability: aboutPage?.availability || "Available",
    availabilityStatus: aboutPage?.availabilityStatus || "open",
    coreValues: aboutPage?.coreValues || [
      { title: "Problem Solving", desc: "Breaking down complex challenges into manageable solutions", icon: "🔍" },
      { title: "Clean Code", desc: "Writing maintainable, scalable, and well-documented code", icon: "✨" },
      { title: "Continuous Learning", desc: "Staying updated with latest technologies and best practices", icon: "📚" },
      { title: "User Focus", desc: "Building with the end-user experience as priority", icon: "🎯" }
    ],
    strengths: aboutPage?.strengths || [
      "Project Leadership",
      "Technical Strategy", 
      "Team Collaboration",
      "Agile Development"
    ]
  };

  // Mobile View
  if (isMobile) {
    return (
      <PageTransition>
        <div className="min-h-screen">
          {/* Header Section */}
          <div className="px-4 pt-6 pb-4">
            <h1 className="text-3xl font-display text-white mb-3">
              My Journey
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-[#9f1239] to-transparent mb-4"></div>
            <p className="text-zinc-400">
              A deeper look into who I am, what I've accomplished, and how I can help.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 px-4 mb-6">
            {[
              { label: "Experience", value: totalExperience, desc: "Years", color: "#9f1239" },
              { label: "Projects", value: projects?.length || 0, desc: "Completed", color: "#c2410c" },
              { label: "Skills", value: skills?.length || 0, desc: "Mastered", color: "#d97706" },
              { label: "Images", value: profile?.images?.length || 0, desc: "Gallery", color: "#e5e5e5" }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-[#111]/80 border border-[#333] p-4 rounded-lg"
              >
                <div className="text-2xl font-display mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Profile Gallery */}
          <div className="px-4 mb-6">
            <MobileProfileGallery 
              images={profile?.images || []} 
              profileName={home?.logoName || "Profile"} 
            />
          </div>

          {/* Quick Info */}
          <div className="bg-[#111] border-y border-[#333] p-4 mb-6">
            <h3 className="text-lg font-display text-white mb-4">
              Quick Info
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-zinc-500 mb-1">Availability</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    displayData.availabilityStatus === 'open' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-white text-sm">{displayData.availability}</span>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-zinc-500 mb-1">Location</div>
                <span className="text-white text-sm">{displayData.location}</span>
              </div>
              
              <div>
                <div className="text-xs text-zinc-500 mb-1">Specialization</div>
                <span className="text-[#9f1239] text-sm">{displayData.specialization}</span>
              </div>
              
              {contact?.email && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Email</div>
                  <a 
                    href={`mailto:${contact.email}`}
                    className="text-white text-sm hover:text-[#9f1239] transition-colors truncate block"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            {contact && (
              <div className="pt-4 border-t border-[#333]">
                <div className="text-xs text-zinc-500 mb-3">Connect with me</div>
                <div className="flex flex-wrap gap-2">
                  {contact.github && (
                    <a 
                      href={contact.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-[#1a1a1a] border border-[#333] text-zinc-400 hover:text-white hover:border-[#9f1239] transition-all rounded text-sm"
                    >
                      GitHub
                    </a>
                  )}
                  {contact.linkedin && (
                    <a 
                      href={contact.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-[#1a1a1a] border border-[#333] text-zinc-400 hover:text-white hover:border-[#9f1239] transition-all rounded text-sm"
                    >
                      LinkedIn
                    </a>
                  )}
                  <Link
                    to="/contact"
                    className="px-3 py-2 bg-[#9f1239] text-white hover:bg-[#7f0e2a] transition-colors rounded text-sm"
                  >
                    More →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-[#333] px-4 scrollbar-hide">
            {[
              { id: "about", label: "My Story" },
              { id: "experience", label: "Journey" },
              { id: "skills", label: "Skills" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id 
                    ? 'text-white border-b-2 border-[#9f1239]' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="px-4 py-6">
            <AnimatePresence mode="wait">
              {activeTab === "about" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-display text-white">About Me</h2>
                  
                  {profile?.about ? (
                    <div className="text-zinc-300 leading-relaxed space-y-4">
                      {profile.about.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-[#333] rounded-lg">
                      <p className="text-zinc-500 mb-2">No about information yet</p>
                      <p className="text-zinc-600 text-sm">Add your biography in the admin panel</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#333]">
                    <h3 className="text-lg font-display text-white mb-4">My Approach</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {displayData.coreValues.map((value, idx) => (
                        <div key={idx} className="bg-[#111] border border-[#333] p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xl">{value.icon}</span>
                            <h4 className="font-medium text-white">{value.title}</h4>
                          </div>
                          <p className="text-sm text-zinc-400">{value.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "experience" && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-display text-white mb-4">Professional Journey</h2>
                  
                  {experience && experience.length > 0 ? (
                    <MobileExperienceTimeline experience={experience} />
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-[#333] rounded-lg">
                      <p className="text-zinc-500 mb-2">No experience added yet</p>
                      <p className="text-zinc-600 text-sm">Add your work experience in the admin panel</p>
                    </div>
                  )}

                  <div className="mt-6 p-4 border border-[#333] rounded-lg bg-[#111]">
                    <h3 className="text-base font-display text-white mb-3">What I Bring</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {displayData.strengths.map((strength, idx) => {
                        const colors = ['bg-[#9f1239]', 'bg-[#c2410c]', 'bg-[#d97706]', 'bg-green-500'];
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${colors[idx % colors.length]} rounded-full`}></div>
                            <span className="text-sm text-white">{strength}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "skills" && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-display text-white mb-2">Technical Skills</h2>
                    <p className="text-zinc-400 text-sm">
                      Tap on any skill to see projects where it was used
                    </p>
                  </div>
                  
                  {skills && skills.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {skills.map((skill, idx) => (
                        <MobileSkillCard key={idx} skill={skill} projects={projects} index={idx} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-[#333] rounded-lg">
                      <p className="text-zinc-500 mb-2">No skills added yet</p>
                      <p className="text-zinc-600 text-sm">Add your skills in the admin panel</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skill Stats */}
          <div className="bg-[#111] border-y border-[#333] p-4 mb-6">
            <h3 className="text-lg font-display text-white mb-4">Skill Levels</h3>
            <div className="space-y-3">
              {Object.entries(skillStats).map(([level, count]) => {
                if (count === 0) return null;
                
                const getLevelColor = (lvl) => {
                  switch(lvl) {
                    case 'beginner': return 'bg-blue-500';
                    case 'intermediate': return 'bg-green-500';
                    case 'advanced': return 'bg-orange-500';
                    default: return 'bg-[#9f1239]';
                  }
                };
                
                const percentage = Math.round((count / skills.length) * 100);
                
                return (
                  <div key={level} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-300 capitalize">
                        {level} ({count})
                      </span>
                      <span className="text-xs text-zinc-500">{percentage}%</span>
                    </div>
                    <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getLevelColor(level)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="px-4 pb-8">
            <div className="bg-gradient-to-r from-[#9f1239]/10 to-transparent border border-[#9f1239]/20 rounded-xl p-6">
              <div>
                <h3 className="text-lg font-display text-white mb-2">Ready to Collaborate?</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Let's discuss how we can work together on your next project.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  to="/contact"
                  className="w-full bg-[#9f1239] text-white font-medium py-3 rounded-lg text-center active:scale-95 transition-all"
                >
                  Get in Touch
                </Link>
                <Link
                  to="/projects"
                  className="w-full border-2 border-[#333] text-white font-medium py-3 rounded-lg text-center active:scale-95 transition-all"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Helper */}
          <div className="fixed bottom-6 right-6 z-50">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-full bg-[#9f1239] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
              aria-label="Scroll to top"
            >
              ↑
            </motion.button>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Desktop View (Original with mobile improvements)
  return (
    <PageTransition>
      <div className="min-h-screen py-8 md:py-12 px-4 md:px-8">
        <motion.div 
          className="max-w-6xl mx-auto mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-display text-white mb-4">
            My Journey
          </h1>
          
          <div className="h-1 w-20 bg-gradient-to-r from-[#9f1239] to-transparent mb-6"></div>
          
          <p className="text-lg text-zinc-400 max-w-3xl">
            A deeper look into who I am, what I've accomplished, and how I can help bring your ideas to life.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-12 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            { label: "Experience", value: totalExperience, desc: "Years professional", color: "#9f1239" },
            { label: "Projects", value: projects?.length || 0, desc: "Completed works", color: "#c2410c" },
            { label: "Skills", value: skills?.length || 0, desc: "Technologies mastered", color: "#d97706" },
            { label: "Images", value: profile?.images?.length || 0, desc: "Profile gallery", color: "#e5e5e5" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-[#111]/80 border border-[#333] p-4 group hover:border-[#9f1239]/50 transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-display mb-2" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-zinc-500">{stat.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <motion.div 
            className="lg:col-span-4 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Gallery */}
            <MobileProfileGallery 
              images={profile?.images || []} 
              profileName={home?.logoName || "Profile"} 
            />

            <div className="bg-[#111] border border-[#333] p-6 space-y-4">
              <h3 className="font-display text-lg text-white mb-4 pb-2 border-b border-[#333]">
                Quick Info
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Availability</div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      displayData.availabilityStatus === 'open' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-white font-medium">{displayData.availability}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Location</div>
                  <span className="text-white font-medium">{displayData.location}</span>
                </div>
                
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Specialization</div>
                  <span className="text-[#9f1239] font-medium">{displayData.specialization}</span>
                </div>
                
                {contact?.email && (
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">Email</div>
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-white font-medium text-sm hover:text-[#9f1239] transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
              </div>

              {contact && (
                <div className="pt-4 border-t border-[#333]">
                  <div className="text-sm text-zinc-500 mb-3">Connect with me</div>
                  <div className="flex flex-wrap gap-2">
                    {contact.github && (
                      <a 
                        href={contact.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#1a1a1a] border border-[#333] text-zinc-400 hover:text-white hover:border-[#9f1239] transition-all rounded text-sm"
                      >
                        GitHub
                      </a>
                    )}
                    {contact.linkedin && (
                      <a 
                        href={contact.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-[#1a1a1a] border border-[#333] text-zinc-400 hover:text-white hover:border-[#9f1239] transition-all rounded text-sm"
                      >
                        LinkedIn
                      </a>
                    )}
                    <Link
                      to="/contact"
                      className="px-3 py-2 bg-[#9f1239] text-white hover:bg-[#7f0e2a] transition-colors rounded text-sm"
                    >
                      More →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#111] border border-[#333] p-6">
              <h3 className="font-display text-lg text-white mb-4">Skill Levels</h3>
              <div className="space-y-3">
                {Object.entries(skillStats).map(([level, count]) => {
                  if (count === 0) return null;
                  
                  const getLevelColor = (lvl) => {
                    switch(lvl) {
                      case 'beginner': return 'bg-blue-500';
                      case 'intermediate': return 'bg-green-500';
                      case 'advanced': return 'bg-orange-500';
                      default: return 'bg-[#9f1239]';
                    }
                  };
                  
                  const percentage = Math.round((count / skills.length) * 100);
                  
                  return (
                    <div key={level} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-300 capitalize">
                          {level} ({count})
                        </span>
                        <span className="text-xs text-zinc-500">{percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getLevelColor(level)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex border-b border-[#333] overflow-x-auto mb-8 scrollbar-hide">
              {[
                { id: "about", label: "My Story" },
                { id: "experience", label: "Journey" },
                { id: "skills", label: "Capabilities" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm md:text-base transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id 
                      ? 'text-white border-b-2 border-[#9f1239]' 
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "about" && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-display text-white">About Me</h2>
                    
                    <div className="prose prose-invert max-w-none">
                      {profile?.about ? (
                        <div className="text-zinc-300 leading-relaxed space-y-4">
                          {profile.about.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-[#333] rounded-lg">
                          <p className="text-zinc-500 mb-2">No about information yet</p>
                          <p className="text-zinc-600 text-sm">Add your biography in the admin panel</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-[#333]">
                      <h3 className="text-xl font-display text-white mb-4">My Approach</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayData.coreValues.map((value, idx) => (
                          <div key={idx} className="bg-[#111] border border-[#333] p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xl">{value.icon}</span>
                              <h4 className="font-medium text-white">{value.title}</h4>
                            </div>
                            <p className="text-sm text-zinc-400">{value.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "experience" && (
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-display text-white mb-6">Professional Journey</h2>
                    
                    {experience && experience.length > 0 ? (
                      <MobileExperienceTimeline experience={experience} />
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-[#333] rounded-lg">
                        <p className="text-zinc-500 mb-2">No experience added yet</p>
                        <p className="text-zinc-600 text-sm">Add your work experience in the admin panel</p>
                      </div>
                    )}

                    <div className="mt-8 p-6 border border-[#333] rounded-lg bg-[#111]">
                      <h3 className="text-lg font-display text-white mb-4">What I Bring</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayData.strengths.map((strength, idx) => {
                          const colors = ['bg-[#9f1239]', 'bg-[#c2410c]', 'bg-[#d97706]', 'bg-green-500'];
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              <div className={`w-2 h-2 ${colors[idx % colors.length]} rounded-full`}></div>
                              <span className="text-sm text-white">{strength}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "skills" && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                      <div>
                        <h2 className="text-2xl font-display text-white">Technical Capabilities</h2>
                        <p className="text-zinc-400 mt-2">
                          Skills backed by real project implementation. Click any skill to see projects.
                        </p>
                      </div>
                      <div className="text-sm text-zinc-500 bg-[#111] border border-[#333] px-3 py-2 rounded">
                        {skills?.length || 0} skills • {projects?.length || 0} projects
                      </div>
                    </div>
                    
                    {skills && skills.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {skills.map((skill, idx) => (
                          <MobileSkillCard key={idx} skill={skill} projects={projects} index={idx} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-[#333] rounded-lg">
                        <p className="text-zinc-500 mb-2">No skills added yet</p>
                        <p className="text-zinc-600 text-sm">Add your skills in the admin panel</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 pt-8 border-t border-[#333]"
            >
              <div className="bg-gradient-to-r from-[#9f1239]/10 to-transparent border border-[#9f1239]/20 rounded-xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-xl font-display text-white mb-2">Ready to Collaborate?</h3>
                    <p className="text-zinc-400 text-sm">
                      Let's discuss how we can work together on your next project.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/contact"
                      className="px-6 py-3 bg-[#9f1239] text-white font-medium rounded-lg hover:bg-[#7f0e2a] transition-colors"
                    >
                      Get in Touch
                    </Link>
                    <Link
                      to="/projects"
                      className="px-6 py-3 border-2 border-[#333] text-white font-medium rounded-lg hover:border-[#9f1239] transition-all"
                    >
                      View Projects
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}