/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function RecruiterPitchModal({ isOpen, onClose, data }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const homeData = data?.home || {};
  const aboutData = data?.aboutPage || {};
  const profileData = data?.profile || {};
  const projects = data?.projects || [];
  const topProjects = projects.slice(0, 3);
  const email = data?.contact?.email || data?.aboutPage?.email || "alifhaikal26@gmail.com";

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("Email copied to clipboard!", { id: "email-copy" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[88vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-line)]/40">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-crimson)] animate-pulse" />
              <span className="font-mono text-xs font-bold text-[var(--color-paper)] tracking-wider uppercase">
                ⚡ 60-SECOND RECRUITER PITCH
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[var(--color-border)] bg-[var(--card-bg)] hover:bg-[var(--color-crimson)] hover:text-white flex items-center justify-center text-xs font-mono text-[var(--color-muted)] transition-all"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Body Content (Scrollable) */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
            
            {/* Quick Candidate Snapshot */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-line)]/50">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[var(--color-paper)]">
                  {homeData.headline || "Alif Haikal Nayaza"}
                </h3>
                <p className="font-mono text-xs text-[var(--color-crimson)] font-semibold mt-0.5">
                  Software & Full-Stack Developer
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-mono text-[var(--color-muted)]">
                  <span>📍 {aboutData.location || "Indonesia • Remote"}</span>
                  <span>•</span>
                  <span className="text-emerald-500 font-semibold">● {aboutData.availability || "Available for hire"}</span>
                </div>
              </div>

              {/* Action: Copy Email */}
              <button
                onClick={handleCopyEmail}
                className="self-start sm:self-center px-4 py-2 rounded-xl bg-[var(--color-crimson)] text-white font-mono text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <span>{copied ? "✓ Copied!" : "📋 Copy Email"}</span>
              </button>
            </div>

            {/* Why Hire / 3-Bullet Elevator Summary */}
            <div>
              <span className="font-mono text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider block mb-2.5">
                EXECUTIVE SUMMARY
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-[var(--color-paper)]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[var(--color-crimson)] font-bold">✦</span>
                  <span><strong>Full-Stack Versatility:</strong> Experienced in building end-to-end web applications with React, Node.js, Express, and MongoDB.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[var(--color-crimson)] font-bold">✦</span>
                  <span><strong>Performance & UX Focused:</strong> Builds snappy, responsive layouts with clean typography, fast rendering, and zero layout shifts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[var(--color-crimson)] font-bold">✦</span>
                  <span><strong>Clean Architecture:</strong> Writes maintainable code, RESTful APIs, and secure authentication workflows.</span>
                </li>
              </ul>
            </div>

            {/* Core Tech Stack Chips */}
            <div>
              <span className="font-mono text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider block mb-2.5">
                CORE TOOLKIT
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["React", "Node.js", "JavaScript", "TypeScript", "Tailwind CSS", "Express", "MongoDB", "REST APIs", "Git"].map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg font-mono text-xs border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-paper)] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Selected Projects (1-Click Direct Links) */}
            {topProjects.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">
                    FEATURED PROOF OF WORK
                  </span>
                  <Link
                    to="/projects"
                    onClick={onClose}
                    className="font-mono text-xs font-semibold text-[var(--color-crimson)] hover:underline"
                  >
                    View All ({projects.length}) →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {topProjects.map((p, i) => (
                    <Link
                      key={i}
                      to={`/project/${i}`}
                      onClick={onClose}
                      className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-line)]/40 hover:border-[var(--color-crimson)] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[9px] text-[var(--color-crimson)] font-bold">#{i + 1}</span>
                        <span className="text-[10px] text-[var(--color-muted)] group-hover:text-[var(--color-crimson)]">↗</span>
                      </div>
                      <h4 className="font-display text-xs font-bold text-[var(--color-paper)] truncate group-hover:text-[var(--color-crimson)]">
                        {p.name}
                      </h4>
                      <p className="font-mono text-[10px] text-[var(--color-muted)] truncate mt-0.5">
                        {p.technologies?.slice(0, 2).join(" • ") || "Web App"}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-line)]/40 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[11px] text-[var(--color-muted)]">
              Prefer direct chat?
            </span>
            <div className="flex items-center gap-2">
              <Link
                to="/contact"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--color-border)] hover:border-[var(--color-crimson)] text-xs font-mono font-semibold text-[var(--color-paper)] transition-all"
              >
                Send Message →
              </Link>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[var(--color-line)] text-xs font-mono font-semibold text-[var(--color-muted)] hover:text-[var(--color-paper)] transition-all"
              >
                Close (ESC)
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
