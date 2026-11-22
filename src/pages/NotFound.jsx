import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";

export default function NotFound() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = "Page not found — Alif Haikal Nayaza";
  }, []);

  return (
    <PageTransition>
      <section className="min-h-[60vh] flex flex-col justify-center py-16">
        <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-widest mb-3">
          Error 404
        </span>
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[var(--color-paper)] leading-[1.05] max-w-3xl">
          This page wandered off.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-[var(--color-muted)] max-w-xl">
          Nothing lives at <code className="font-mono text-[var(--color-paper)] break-all">{pathname}</code>. The link may be outdated, or the address has a typo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-accent-fill)] text-white font-mono text-xs font-bold tracking-wider hover:opacity-90 transition-all"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to home
          </Link>
          <Link
            to="/projects"
            className="px-6 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-paper)] font-mono text-xs font-semibold tracking-wider hover:border-[var(--color-crimson)] transition-all"
          >
            Browse projects
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
