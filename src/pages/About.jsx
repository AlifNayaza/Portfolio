import { useState, useRef, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// === ANIMATION VARIANTS ===
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 }
  }
};

// === SKILL CARD WITH PROJECTS ===
const SkillCard = ({ skill, projects, index }) => {
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
      variants={itemVariants}
      whileHover={{ y: -3 }}
      className="group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={`bg-[#111] border rounded-lg p-4 transition-all duration-300 ${
        isExpanded ? 'border-[#9f1239]' : 'border-[#333]'
      }`}>
        
        {/* Skill Header */}
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
            
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${levelColor} bg-opacity-20 text-${levelColor.replace('bg-', 'text-')}`}>
                {skillLevel}
              </span>
            </div>
          </div>
          
          {/* Expand Button */}
          <button className="text-zinc-600 hover:text-white transition-colors text-lg">
            {isExpanded ? '−' : '+'}
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-[#333] rounded-full overflow-hidden mb-2">
          <div 
            className={`h-full ${levelColor}`}
            style={{
              width: skillLevel === 'Beginner' ? '25%' :
                     skillLevel === 'Intermediate' ? '50%' :
                     skillLevel === 'Advanced' ? '75%' : '100%'
            }}
          />
        </div>
        
        {/* Expanded Projects View */}
        <AnimatePresence>
          {isExpanded && projectCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-[#333]">
                <div className="space-y-2">
                  {projectsUsingSkill.map((project, idx) => (
                    <Link
                      key={idx}
                      to={`/project/${projects.indexOf(project)}`}
                      className="block group/project"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2 p-2 rounded hover:bg-[#1a1a1a] transition-colors">
                        <div className="w-6 h-6 bg-[#1a1a1a] border border-[#333] rounded flex items-center justify-center flex-shrink-0">
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
          <div className="text-xs text-zinc-600 text-center pt-1">
            No projects yet
          </div>
        )}
      </div>
    </motion.div>
  );
};

// === EXPERIENCE TIMELINE ===
const ExperienceTimeline = ({ experience }) => {
  if (!experience || experience.length === 0) return null;
  
  return (
    <div className="space-y-6">
      {experience.map((exp, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative pl-8 pb-6 last:pb-0 border-l border-[#333]"
        >
          <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#0c0c0c] border-2 border-[#9f1239] rounded-full"></div>
          
          <div className="bg-[#111] border border-[#333] p-5 hover:border-[#9f1239]/50 transition-all">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xl font-display text-white mb-1">
                  {exp.role || "Position"}
                </h3>
                <p className="text-zinc-400">
                  {exp.company || "Company"}
                </p>
              </div>
              <div className="font-mono text-sm text-[#9f1239] bg-[#9f1239]/10 px-3 py-1 rounded">
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
  const { profile, experience, skills, projects, contact } = data || {};
  const [activeTab, setActiveTab] = useState("about");
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate total years of experience
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

  // Get skill level distribution
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

  return (
    <PageTransition>
      <div className="min-h-screen py-8 md:py-12 px-4 md:px-8">
        {/* Header Section */}
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

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-12 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { 
              label: "Experience", 
              value: totalExperience, 
              desc: "Years professional",
              color: "#9f1239"
            },
            { 
              label: "Projects", 
              value: projects?.length || 0, 
              desc: "Completed works",
              color: "#c2410c"
            },
            { 
              label: "Skills", 
              value: skills?.length || 0, 
              desc: "Technologies mastered",
              color: "#d97706"
            },
            { 
              label: "Status", 
              value: "Available", 
              desc: "For opportunities",
              color: "#e5e5e5"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-[#111]/80 border border-[#333] p-4 group hover:border-[#9f1239]/50 transition-all duration-300"
            >
              <div 
                className="text-2xl md:text-3xl font-display mb-2"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-zinc-500">{stat.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile & Contact */}
          <motion.div 
            className="lg:col-span-4 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Profile Image */}
            <div className="relative group">
              <div className="aspect-square border-2 border-[#333] rounded-lg overflow-hidden bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a]">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    onLoad={() => setImageLoaded(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono">
                    [ Profile Image ]
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="bg-[#111] border border-[#333] p-6 space-y-4">
              <h3 className="font-display text-lg text-white mb-4 pb-2 border-b border-[#333]">
                Quick Info
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Availability</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Open for work</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Location</div>
                  <span className="text-white font-medium">Remote • Worldwide</span>
                </div>
                
                <div>
                  <div className="text-sm text-zinc-500 mb-1">Specialization</div>
                  <span className="text-[#9f1239] font-medium">Full-Stack Development</span>
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

              {/* Social Links */}
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

            {/* Skill Level Overview */}
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

          {/* Right Column: Content Tabs */}
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-[#333] overflow-x-auto mb-8">
              {[
                { id: "about", label: "My Story" },
                { id: "experience", label: "Journey" },
                { id: "skills", label: "Capabilities" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm md:text-base transition-all whitespace-nowrap ${
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
                    <h2 className="text-2xl font-display text-white">
                      About Me
                    </h2>
                    
                    <div className="prose prose-invert max-w-none">
                      {profile?.about ? (
                        <div className="text-zinc-300 leading-relaxed space-y-4">
                          {profile.about.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-4 last:mb-0">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-[#333] rounded-lg">
                          <p className="text-zinc-500 mb-2">
                            No about information yet
                          </p>
                          <p className="text-zinc-600 text-sm">
                            Add your biography in the admin panel
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Core Values */}
                    <div className="pt-6 border-t border-[#333]">
                      <h3 className="text-xl font-display text-white mb-4">My Approach</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            title: "Problem Solving",
                            desc: "Breaking down complex challenges into manageable solutions",
                            icon: "🔍"
                          },
                          {
                            title: "Clean Code",
                            desc: "Writing maintainable, scalable, and well-documented code",
                            icon: "✨"
                          },
                          {
                            title: "Continuous Learning",
                            desc: "Staying updated with latest technologies and best practices",
                            icon: "📚"
                          },
                          {
                            title: "User Focus",
                            desc: "Building with the end-user experience as priority",
                            icon: "🎯"
                          }
                        ].map((value, idx) => (
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
                    <h2 className="text-2xl font-display text-white mb-6">
                      Professional Journey
                    </h2>
                    
                    {experience && experience.length > 0 ? (
                      <ExperienceTimeline experience={experience} />
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-[#333] rounded-lg">
                        <p className="text-zinc-500 mb-2">
                          No experience added yet
                        </p>
                        <p className="text-zinc-600 text-sm">
                          Add your work experience in the admin panel
                        </p>
                      </div>
                    )}

                    {/* Additional Experience Info */}
                    <div className="mt-8 p-6 border border-[#333] rounded-lg bg-[#111]">
                      <h3 className="text-lg font-display text-white mb-4">What I Bring</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#9f1239] rounded-full"></div>
                            <span className="text-sm text-white">Project Leadership</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#c2410c] rounded-full"></div>
                            <span className="text-sm text-white">Technical Strategy</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#d97706] rounded-full"></div>
                            <span className="text-sm text-white">Team Collaboration</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-white">Agile Development</span>
                          </div>
                        </div>
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
                        <h2 className="text-2xl font-display text-white">
                          Technical Capabilities
                        </h2>
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
                          <SkillCard
                            key={idx}
                            skill={skill}
                            projects={projects}
                            index={idx}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-[#333] rounded-lg">
                        <p className="text-zinc-500 mb-2">
                          No skills added yet
                        </p>
                        <p className="text-zinc-600 text-sm">
                          Add your skills in the admin panel
                        </p>
                      </div>
                    )}

                    {/* Skills Summary */}
                    <div className="mt-8 p-6 border border-[#333] rounded-lg bg-[#111]">
                      <h3 className="text-lg font-display text-white mb-4">Skill Utilization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <div className="text-3xl font-display text-[#9f1239] mb-2">
                            {skills?.length || 0}
                          </div>
                          <div className="text-sm text-zinc-500">Total Skills</div>
                        </div>
                        <div>
                          <div className="text-3xl font-display text-[#c2410c] mb-2">
                            {projects?.filter(p => p.technologies?.length > 0).length || 0}
                          </div>
                          <div className="text-sm text-zinc-500">Projects with Tech</div>
                        </div>
                        <div>
                          <div className="text-3xl font-display text-white mb-2">
                            {Array.from(new Set(projects?.flatMap(p => p.technologies || []))).length || 0}
                          </div>
                          <div className="text-sm text-zinc-500">Technologies Used</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Call to Action */}
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