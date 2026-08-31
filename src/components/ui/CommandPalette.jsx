/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

export default function CommandPalette({ isOpen, onClose, onOpenPitch, data }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const projects = data?.projects || [];
  const email = data?.contact?.email || data?.aboutPage?.email || "alifhaikal26@gmail.com";

  // Static commands
  const defaultActions = [
    {
      id: "pitch",
      icon: "⚡",
      title: "60-Second Recruiter Pitch",
      subtitle: "Quick executive summary & core highlights",
      category: "Highlights",
      action: () => {
        onClose();
        if (onOpenPitch) onOpenPitch();
      },
    },
    {
      id: "nav-home",
      icon: "🏠",
      title: "Go to Home / Overview",
      subtitle: "Return to the main hero & selected work",
      category: "Navigation",
      action: () => {
        navigate("/");
        onClose();
      },
    },
    {
      id: "nav-about",
      icon: "👤",
      title: "Go to About / Story",
      subtitle: "Read background, principles & bio",
      category: "Navigation",
      action: () => {
        navigate("/about");
        onClose();
      },
    },
    {
      id: "nav-projects",
      icon: "📁",
      title: "Explore All Projects",
      subtitle: "Browse full catalog of web applications",
      category: "Navigation",
      action: () => {
        navigate("/projects");
        onClose();
      },
    },
    {
      id: "nav-contact",
      icon: "💬",
      title: "Get In Touch / Contact",
      subtitle: "Send a message or find social links",
      category: "Navigation",
      action: () => {
        navigate("/contact");
        onClose();
      },
    },
    {
      id: "toggle-theme",
      icon: theme === "dark" ? "☀️" : "🌙",
      title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      subtitle: "Toggle studio lighting theme",
      category: "Actions",
      action: () => {
        toggleTheme();
        toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} mode!`, { id: "theme-cmd" });
        onClose();
      },
    },
    {
      id: "copy-email",
      icon: "📋",
      title: "Copy Email Address",
      subtitle: email,
      category: "Actions",
      action: () => {
        navigator.clipboard.writeText(email);
        toast.success("Email copied to clipboard!", { id: "email-cmd" });
        onClose();
      },
    },
  ];

  // Dynamic project items
  const projectActions = projects.map((p, idx) => ({
    id: `proj-${idx}`,
    icon: "⚡",
    title: p.name,
    subtitle: p.technologies?.slice(0, 3).join(", ") || "Web Application",
    category: "Projects",
    action: () => {
      navigate(`/project/${idx}`);
      onClose();
    },
  }));

  const allItems = [...defaultActions, ...projectActions];

  const filteredItems = query.trim() === ""
    ? allItems
    : allItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] sm:pt-[15vh] p-3 sm:p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Command Palette Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-[var(--card-bg)] border border-[var(--color-border)] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="p-3 sm:p-4 border-b border-[var(--color-border)] flex items-center gap-3 bg-[var(--color-line)]/50">
            <span className="text-base text-[var(--color-muted)] font-mono pl-1">⌘</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Type a command or search project (e.g. projects, pitch, theme)..."
              className="flex-1 bg-transparent border-none outline-none font-mono text-xs sm:text-sm text-[var(--color-paper)] placeholder:text-[var(--color-muted)]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs font-mono text-[var(--color-muted)] hover:text-[var(--color-paper)]"
              >
                Clear
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[var(--card-bg)] text-[var(--color-muted)] border border-[var(--color-border)]">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="p-2 sm:p-3 overflow-y-auto space-y-1">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center font-mono text-xs text-[var(--color-muted)]">
                No matching commands or projects found for "{query}".
              </div>
            ) : (
              filteredItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 transition-all ${
                    idx === selectedIndex
                      ? "bg-[var(--color-crimson)] text-white shadow-md"
                      : "hover:bg-[var(--color-line)] text-[var(--color-paper)]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-xs sm:text-sm truncate">
                        {item.title}
                      </div>
                      <div
                        className={`font-mono text-[10px] sm:text-[11px] truncate ${
                          idx === selectedIndex ? "text-white/80" : "text-[var(--color-muted)]"
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${
                      idx === selectedIndex
                        ? "bg-black/30 text-white"
                        : "bg-[var(--color-line)] text-[var(--color-muted)] border border-[var(--color-border)]"
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-2.5 sm:p-3 border-t border-[var(--color-border)] bg-[var(--color-line)]/40 flex items-center justify-between text-[10px] font-mono text-[var(--color-muted)]">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
            </div>
            <span>Press ESC to close</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
