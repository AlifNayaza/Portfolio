/* eslint-disable no-unused-vars */
import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { ArrowRight, ArrowUpRight, Github, Instagram, Linkedin, MessageCircle, Send } from "lucide-react";
import { copyText } from "../lib/utils";

const LIMITS = { name: 80, email: 120, subject: 140, message: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Contact() {
  const { data } = usePortfolio();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const contact = data?.contact || {};
  const aboutPage = data?.aboutPage || {};

  const handleCopyEmail = async () => {
    if (contact.email && (await copyText(contact.email, "Email copied to clipboard!", "contact-email"))) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };
    if (!payload.name || !payload.email || !payload.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    if (!EMAIL_RE.test(payload.email)) {
      toast.error("That email address doesn't look right.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Send to contact serverless endpoint
      const res = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, subject: payload.subject || "Portfolio Inquiry" }),
      });
      if (!res.ok) throw new Error(`Contact API responded ${res.status}`);

      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please reach out directly via email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { name: "GitHub", url: contact.github, Icon: Github },
    { name: "LinkedIn", url: contact.linkedin, Icon: Linkedin },
    { name: "Instagram", url: contact.instagram, Icon: Instagram },
    { name: "WhatsApp", url: contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}` : null, Icon: MessageCircle },
    { name: "Telegram", url: contact.telegram ? `https://t.me/${contact.telegram.replace('@', '')}` : null, Icon: Send },
  ].filter((item) => item.url);

  return (
    <PageTransition>
      <div className="relative pb-4 sm:pb-8 w-full">
        
        {/* === HEADER SECTION === */}
        <section className="pt-6 pb-10">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--color-crimson)] tracking-widest uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-fill)]" />
            <span>CONTACT</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[var(--color-paper)] leading-[1.05] max-w-5xl">
            Tell me what you're building.
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-muted)] mt-3 max-w-3xl font-normal">
            A rough idea is enough. Share the goal and timeline, and I'll reply with next steps within 24 hours.
          </p>
        </section>

        {/* === MAIN CONTENT GRID === */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Contact Channels Bento (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Email Card */}
            <div className="p-7 sm:p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm">
              <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-wider block mb-2">
                EMAIL
              </span>
              <h2 className="font-display text-xl font-bold text-[var(--color-paper)] mb-1">
                Drop an email
              </h2>
              <p className="text-xs text-[var(--color-muted)] mb-5">
                I usually respond within 24 hours.
              </p>

              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-line)]">
                <span className="font-mono text-xs text-[var(--color-paper)] truncate mr-2">
                  {contact.email || "alraf@example.com"}
                </span>
                <button
                  onClick={handleCopyEmail}
                  aria-label={copiedEmail ? "Email copied" : "Copy email address"}
                  className="px-3.5 py-2 rounded-xl bg-[var(--color-accent-fill)] text-white font-mono text-[11px] font-bold tracking-wider hover:opacity-90 transition-all flex-shrink-0"
                >
                  {copiedEmail ? "COPIED ✓" : "COPY"}
                </button>
              </div>
            </div>

            {/* Social Channels Card */}
            {socialLinks.length > 0 && (
              <div className="p-7 sm:p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm">
                <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-wider block mb-2">
                  ONLINE
                </span>
                <h2 className="font-display text-xl font-bold text-[var(--color-paper)] mb-4">
                  Find me on
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socialLinks.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-line)] hover:border-[var(--color-crimson)] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <item.Icon size={16} aria-hidden="true" className="text-[var(--color-muted)]" />
                        <span className="font-mono text-xs font-semibold text-[var(--color-paper)]">
                          {item.name}
                        </span>
                      </div>
                      <ArrowUpRight size={14} aria-hidden="true" className="text-[var(--color-crimson)] group-hover:translate-x-0.5 transition-transform" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Status Card */}
            <div className="p-6 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm flex items-center gap-3.5">
              <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <div>
                <h2 className="font-mono text-xs font-bold text-[var(--color-paper)]">
                  AVAILABILITY
                </h2>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">
                  {aboutPage.availability || "Open to freelance projects & full-time roles"}
                </p>
              </div>
            </div>

          </div>

          {/* Right: Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm">
              <span className="font-mono text-xs font-bold text-[var(--color-crimson)] uppercase tracking-wider block mb-2">
                MESSAGE
              </span>
              <h2 id="form-title" className="font-display text-2xl font-bold text-[var(--color-paper)] mb-5">
                Send a message
              </h2>

              <form onSubmit={handleSubmit} aria-labelledby="form-title" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-name" className="block font-mono text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                      Your Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={LIMITS.name}
                      required
                      placeholder="e.g. Alex"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-line)] text-xs font-mono text-[var(--color-paper)] placeholder:text-[var(--color-muted)]/70 focus:outline-none focus:border-[var(--color-crimson)] focus:ring-2 focus:ring-[var(--color-crimson)]/25 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="cf-email" className="block font-mono text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                      Your Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      maxLength={LIMITS.email}
                      required
                      placeholder="e.g. alex@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-line)] text-xs font-mono text-[var(--color-paper)] placeholder:text-[var(--color-muted)]/70 focus:outline-none focus:border-[var(--color-crimson)] focus:ring-2 focus:ring-[var(--color-crimson)]/25 transition-all"
                    />
                  </div>
                </div>

                {/* Quick Topic Chips */}
                <div>
                  <span id="cf-topics" className="block font-mono text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                    Quick topic
                  </span>
                  <div role="group" aria-labelledby="cf-topics" className="flex flex-wrap gap-2">
                    {[
                      { label: "Freelance project", text: "New Freelance Project Inquiry" },
                      { label: "Full-time role", text: "Full-Time Job Opportunity" },
                      { label: "Collaboration", text: "Project Collaboration" },
                      { label: "Quick tech chat", text: "General Tech Chat & Inquiry" },
                    ].map((topic, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-pressed={formData.subject === topic.text}
                        onClick={() => {
                          if (navigator.vibrate) navigator.vibrate(20);
                          setFormData({ ...formData, subject: topic.text });
                        }}
                        className={`px-3.5 py-2 rounded-full font-mono text-[11px] sm:text-xs transition-all ${
                          formData.subject === topic.text
                            ? "bg-[var(--color-accent-fill)] text-white font-bold shadow-sm"
                            : "border border-[var(--color-border)] bg-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-paper)] hover:border-[var(--color-crimson)]"
                        }`}
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="cf-subject" className="block font-mono text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    id="cf-subject"
                    name="subject"
                    type="text"
                    maxLength={LIMITS.subject}
                    placeholder="e.g. Project inquiry / Hello"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-line)] text-xs font-mono text-[var(--color-paper)] placeholder:text-[var(--color-muted)]/70 focus:outline-none focus:border-[var(--color-crimson)] focus:ring-2 focus:ring-[var(--color-crimson)]/25 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="cf-message" className="block font-mono text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <span id="cf-count" className="font-mono text-[11px] text-[var(--color-muted)] tabular-nums">
                      {formData.message.length} / {LIMITS.message}
                    </span>
                  </div>
                  <textarea
                    id="cf-message"
                    name="message"
                    rows={5}
                    maxLength={LIMITS.message}
                    aria-describedby="cf-count"
                    required
                    placeholder="What's on your mind? Tell me about your project or idea..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-line)] text-xs font-mono text-[var(--color-paper)] placeholder:text-[var(--color-muted)]/70 focus:outline-none focus:border-[var(--color-crimson)] focus:ring-2 focus:ring-[var(--color-crimson)]/25 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[var(--color-accent-fill)] text-white font-mono text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Send message</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </section>

      </div>
    </PageTransition>
  );
}