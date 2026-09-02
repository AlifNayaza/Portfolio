/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";

export default function Projects() {
  const { data, loading } = usePortfolio();
  const [selectedTech, setSelectedTech] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const projects = data?.projects || [];

  // Extract all unique technologies
  const allTechs = useMemo(() => {
    const set = new Set();
    if (data?.projects) {
      data.projects.forEach((p) => {
        p.technologies?.forEach((t) => set.add(t));
      });
    }
    return Array.from(set).sort();
  }, [data]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (!data?.projects) return [];
    return data.projects.filter((project) => {
      const matchesTech =
        selectedTech === "all" ||
        project.technologies?.some(
          (t) => t.toLowerCase() === selectedTech.toLowerCase()
        );
      const matchesSearch =
        searchQuery === "" ||
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies?.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesTech && matchesSearch;
    });
  }, [data, selectedTech, searchQuery]);

  return (
    <PageTransition>
      <div className="relative pb-4 sm:pb-8">
        
        {/* === HEADER SECTION === */}
        <section className="pt-6 pb-10">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--color-crimson)] tracking-widest uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-crimson)]" />
            <span>PROJECTS</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[var(--color-paper)] leading-[1.08] max-w-3xl">
            Things I've Built.
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-muted)] mt-3 max-w-2xl font-normal">
            A collection of web applications, client work, and personal projects.
          </p>
        </section>

        {/* === CONTROLS & FILTER BAR === */}
        <section className="mb-10 space-y-6">
          
          {/* Search & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search projects or technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)] text-xs font-mono text-[var(--color-paper)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-crimson)] transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--color-muted)] hover:text-[var(--color-paper)]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)] self-start sm:self-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                  viewMode === "grid"
                    ? "bg-[var(--color-crimson)] text-white font-bold"
                    : "text-[var(--color-muted)] hover:text-[var(--color-paper)]"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                  viewMode === "list"
                    ? "bg-[var(--color-crimson)] text-white font-bold"
                    : "text-[var(--color-muted)] hover:text-[var(--color-paper)]"
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setSelectedTech("all")}
              className={`px-4 py-2 rounded-full font-mono text-xs transition-all ${
                selectedTech === "all"
                  ? "bg-[var(--color-crimson)] text-white font-bold shadow-md"
                  : "border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-muted)] hover:border-[var(--color-crimson)] hover:text-[var(--color-paper)]"
              }`}
            >
              All ({projects.length})
            </button>

            {allTechs.map((tech) => {
              const count = projects.filter((p) =>
                p.technologies?.includes(tech)
              ).length;
              return (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition-all ${
                    selectedTech === tech
                      ? "bg-[var(--color-crimson)] text-white font-bold shadow-md"
                      : "border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-muted)] hover:border-[var(--color-crimson)] hover:text-[var(--color-paper)]"
                  }`}
                >
                  {tech} <span className="opacity-60 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* === PROJECTS SHOWCASE === */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)]">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-display text-xl font-bold text-[var(--color-paper)] mb-2">
              No matching projects found
            </h3>
            <p className="text-xs font-mono text-[var(--color-muted)] mb-6">
              Try adjusting your search query or technology filter.
            </p>
            <button
              onClick={() => {
                setSelectedTech("all");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-full bg-[var(--color-crimson)] text-white font-mono text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 md:gap-6 lg:gap-8">
            {filteredProjects.map((project) => {
              const originalIndex = projects.indexOf(project);
              const projectImages = Array.isArray(project.images) && project.images.length > 0 
                ? project.images 
                : (project.image ? [project.image] : []);
              const coverImage = projectImages[0] || project.image || "";

              return (
                <motion.div
                  key={originalIndex}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="h-full"
                >
                  <Link
                    to={`/project/${originalIndex}`}
                    className="group relative block rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--card-bg)] hover:border-[var(--color-crimson)]/80 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col justify-between h-full p-3 sm:p-5 md:p-6"
                  >
                    {/* Number Watermark */}
                    <span className="absolute -bottom-3 -right-2 font-display text-5xl sm:text-7xl md:text-8xl font-black text-[var(--color-border)]/20 pointer-events-none select-none z-0 group-hover:text-[var(--color-crimson)]/15 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500">
                      0{originalIndex + 1}
                    </span>

                    <div className="relative z-10">
                      {/* Top Header Pill Bar */}
                      <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                        <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-mono text-[9px] sm:text-[11px] font-bold bg-[var(--color-line)] text-[var(--color-crimson)] border border-[var(--color-border)] shadow-sm">
                          PROJ // 0{originalIndex + 1}
                        </span>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-line)] flex items-center justify-center text-[10px] sm:text-xs text-[var(--color-paper)] group-hover:bg-[var(--color-crimson)] group-hover:text-white group-hover:border-[var(--color-crimson)] group-hover:rotate-45 transition-all duration-300 shadow-sm">
                          ↗
                        </div>
                      </div>

                      {/* Image Stage */}
                      <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--color-line)] relative mb-3 sm:mb-4">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-display text-2xl sm:text-4xl text-[var(--color-muted)]">
                            ⚡
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Multi-Image Counter Badge */}
                        {projectImages.length > 1 && (
                          <div className="absolute top-2 right-2 z-10">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-sm">
                              📷 {projectImages.length}
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                            VIEW CASE STUDY
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="font-display text-sm sm:text-lg md:text-xl font-bold text-[var(--color-paper)] group-hover:text-[var(--color-crimson)] transition-colors line-clamp-1 mb-1 sm:mb-2">
                          {project.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs md:text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed mb-3 hidden sm:block font-normal">
                          {project.description || "Web application with clean interface and modern stack."}
                        </p>
                      </div>
                    </div>

                    {/* Tech Badges Footer */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="relative z-10 flex flex-wrap gap-1 sm:gap-1.5 pt-2 sm:pt-3 border-t border-[var(--color-border)]/60">
                        {project.technologies.slice(0, 2).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono bg-[var(--color-line)] text-[var(--color-muted)] border border-[var(--color-border)] font-medium group-hover:border-[var(--color-crimson)]/30 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 2 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono text-[var(--color-muted)]">
                            +{project.technologies.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {filteredProjects.map((project) => {
              const originalIndex = projects.indexOf(project);
              return (
                <Link
                  key={originalIndex}
                  to={`/project/${originalIndex}`}
                  className="group py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--color-line)]/30 px-4 rounded-2xl transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs text-[var(--color-crimson)] font-bold">
                        #{originalIndex + 1}
                      </span>
                      <h3 className="font-display text-xl font-bold text-[var(--color-paper)] group-hover:text-[var(--color-crimson)] transition-colors truncate">
                        {project.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--color-muted)] line-clamp-1">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="hidden md:flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--color-line)] text-[var(--color-muted)] border border-[var(--color-border)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-sm text-[var(--color-crimson)] group-hover:translate-x-1 transition-transform">
                      View Case Study →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </PageTransition>
  );
}