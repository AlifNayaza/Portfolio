/* eslint-disable no-unused-vars */
import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";

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

  const handleCopyEmail = () => {
    if (contact.email) {
      if (navigator.vibrate) navigator.vibrate(30);
      navigator.clipboard.writeText(contact.email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard!", { id: "contact-email" });
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Send to contact serverless endpoint
      await axios.post("/.netlify/functions/contact", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "Portfolio Inquiry",
        message: formData.message,
      });

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
    { name: "GitHub", url: contact.github, icon: "🐙" },
    { name: "LinkedIn", url: contact.linkedin, icon: "💼" },
    { name: "Instagram", url: contact.instagram, icon: "📸" },
    { name: "WhatsApp", url: contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}` : null, icon: "💬" },
    { name: "Telegram", url: contact.telegram ? `https://t.me/${contact.telegram.replace('@', '')}` : null, icon: "✈️" },
  ].filter((item) => item.url);

  return (
    <PageTransition>
      <div className="relative pb-4 sm:pb-8 w-full">
        
        {/* === HEADER SECTION === */}
        <section className="pt-6 pb-10">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--color-crimson)] tracking-widest uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-[var(--color-crimson)]" />
            <span>CONTACT</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[var(--color-paper)] leading-[1.05] max-w-5xl">
            Let's connect.
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-muted)] mt-3 max-w-3xl font-normal">
            Got a question, project idea, or just want to say hi? Feel free to drop a message.
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
              <h3 className="font-display text-xl font-bold text-[var(--color-paper)] mb-1">
                Drop an email
              </h3>
              <p className="text-xs text-[var(--color-muted)] mb-5">
                I usually respond within 24 hours.
              </p>

              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-line)]">
                <span className="font-mono text-xs text-[var(--color-paper)] truncate mr-2">
                  {contact.email || "alraf@example.com"}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-xl bg-[var(--color-crimson)] text-white font-mono text-[10px] font-bold tracking-wider hover:opacity-90 transition-all flex-shrink-0"
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
                <h3 className="font-display text-xl font-bold text-[var(--color-paper)] mb-4">
                  Find me on
                </h3>

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
                        <span className="text-base">{item.icon}</span>
                        <span className="font-mono text-xs font-semibold text-[var(--color-paper)]">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-[var(--color-crimson)] group-hover:translate-x-1 transition-transform">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Status Card */}
            <div className="p-6 rounded-3xl border border-[var(--color-border)] bg-[var(--card-bg)] shadow-sm flex items-center gap-3.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <div>
                <h4 className="font-mono text-xs font-bold text-[var(--color-paper)]">
                  AVAILABILITY
                </h4>
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
              <h3 className="font-display text-2xl font-bold text-[var(--color-paper)] mb-5">
                Send a message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-line)] text-xs font-mono text-[var(--color-paper)] placeholder:text-[var(--color-muted)]/60 focus:outline-none focus:border-[var(--color-crimson)] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-line)] text-xs font-mono text-[var(--color-paper)] placeholder:text-[var(--color-muted)]/60 focus:outline-none focus:border-[var(--color-crimson)] transition-all"
                    />
                  </div>
                </div>

                {/* Quick Topic Chips */}
                <div>
                  <label className="block font-mono text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                    Quick Topic (Tap to auto-fill)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "💼 Freelance Project", text: "New Freelance Project Inquiry" },
                      { label: "🏢 Full-Time Role", text: "Full-Time Job Opportunity" },
                      { label: "🤝 Collaboration", text: "Project Collaboration" },
                      { label: "☕ Quick Tech Chat", text: "General Tech Chat & Inquiry" },
                    ].map((topic, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (navigator.vibrate) navigator.vibrate(20);
                          setFormData({ ...formData, subject: topic.text });
                        }}
                        className={`px-3 py-1.5 rounded-full font-mono text-[10px] sm:text-xs transition-all ${
                          formData.subject === topic.text
                            ? "bg-[var(--color-crimson)] text-white font-bold shadow-sm"
                            : "border border-[var(--color-border)] bg-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-paper)] hover:border-[var(--color-crimson)]"
                        }`}
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Project inquiry / Hello"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-line)] text-xs font-mono text-[var(--color-paper)] placeholder:text-[var(--color-muted)]/60 focus:outline-none focus:border-[var(--color-crimson)] transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                      Message *
                    </label>
                    <span className="font-mono text-[10px] text-[var(--color-muted)]">
                      {formData.message.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    placeholder="What's on your mind? Tell me about your project or idea..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-line)] text-xs font-mono text-[var(--color-paper)] placeholder:text-[var(--color-muted)]/60 focus:outline-none focus:border-[var(--color-crimson)] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[var(--color-crimson)] text-white font-mono text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <span>→</span>
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