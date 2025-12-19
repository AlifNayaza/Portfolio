import { useState, useEffect, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

// === CANVAS: SUBTLE PARTICLES ===
const SubtleParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.5 ? '#9f1239' : '#c2410c';
        ctx.globalAlpha = 0.3;
        ctx.fill();
      }
    }

    for (let i = 0; i < 30; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-20" />;
};

// === OUTPUT LINE WITH ANIMATION ===
const OutputLine = ({ text, isUserInput = false, isCommand = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isUserInput ? 'flex items-start gap-2 text-white font-mono' : isCommand ? 'font-mono text-[#9f1239] text-sm' : 'font-serif text-zinc-400 italic'}`}
    >
      {isUserInput && <span className="text-[#9f1239] flex-shrink-0">§</span>}
      <span className="break-words">{text}</span>
    </motion.div>
  );
};

// === QUICK ACCESS BUTTONS ===
const QuickAccessPanel = ({ contact, onCommandClick }) => {
  const socialLinks = contact 
    ? Object.entries(contact).filter(([key, value]) => key !== 'email' && value) 
    : [];

  const quickCommands = [
    { cmd: 'correspond', label: 'Send Email', icon: '✉️', color: 'border-[#9f1239] hover:bg-[#9f1239]/10' },
    ...socialLinks.map(([key]) => ({
      cmd: `dispatch ${key}`,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      icon: key === 'github' ? '📦' : key === 'linkedin' ? '💼' : key === 'instagram' ? '📸' : '🐦',
      color: 'border-[#333] hover:border-[#9f1239] hover:bg-[#9f1239]/5'
    }))
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {quickCommands.map((cmd, idx) => (
        <motion.button
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * idx }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCommandClick(cmd.cmd)}
          className={`group flex items-center gap-2 p-3 bg-[#0a0a0a] border ${cmd.color} transition-all text-left`}
        >
          <span className="text-2xl">{cmd.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-xs text-zinc-500 group-hover:text-[#9f1239] transition-colors truncate">
              {cmd.label}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

// === COMMAND SUGGESTIONS ===
const CommandSuggestions = ({ input, onSelect }) => {
  const commands = ['inquiries', 'correspond', 'dispatch', 'new-page', 'help'];
  const filtered = commands.filter(cmd => cmd.startsWith(input.toLowerCase()) && input.length > 0);

  if (filtered.length === 0 || !input) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-full left-0 right-0 mb-2 bg-[#111] border border-[#333] p-2 space-y-1"
    >
      {filtered.map(cmd => (
        <button
          key={cmd}
          onClick={() => onSelect(cmd)}
          className="w-full text-left px-3 py-2 font-mono text-sm text-zinc-400 hover:text-white hover:bg-[#9f1239]/10 transition-colors"
        >
          {cmd}
        </button>
      ))}
    </motion.div>
  );
};

export default function Contact() {
  const { data } = usePortfolio();
  const { contact } = data;

  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const pageRef = useRef(null);
  const inputRef = useRef(null);
  const hasBooted = useRef(false);

  const socialLinks = contact 
    ? Object.entries(contact).filter(([key, value]) => key !== 'email' && value) 
    : [];

  useEffect(() => {
    if (!hasBooted.current) {
      const openingSequence = [
        { text: "█ CHRONICLE TERMINAL v1.0 INITIALIZED", delay: 100 },
        { text: "Connection established. The author is listening...", delay: 800 },
      ];
      
      let delay = 300;
      openingSequence.forEach(line => {
        setTimeout(() => setLines(prev => [...prev, { text: line.text, isCommand: true }]), delay);
        delay += line.delay;
      });

      setTimeout(() => {
        setIsReady(true);
        inputRef.current?.focus();
      }, delay + 200);

      hasBooted.current = true;
    }
  }, []);

  useEffect(() => {
    pageRef.current?.scrollTo({ top: pageRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  const processCommand = (cmd) => {
    const parts = cmd.toLowerCase().trim().split(' ');
    const command = parts[0];
    const arg = parts[1];
    let response = [];

    switch (command) {
      case 'help':
      case 'inquiries':
        response = [
          "═══ AVAILABLE COMMANDS ═══",
          "  correspond      → Draft email to author",
          `  dispatch <arg>  → Open social link [${socialLinks.map(s => s[0]).join(', ')}]`,
          "  new-page        → Clear terminal",
          "  help            → Show this guide",
        ];
        break;

      case 'correspond':
        if (!contact?.email) {
          response = ["✗ Email channel unavailable"];
        } else {
          response = ["✓ Opening email client..."];
          setTimeout(() => window.location.href = `mailto:${contact.email}`, 1000);
        }
        break;

      case 'dispatch':
        const social = socialLinks.find(([key]) => key.toLowerCase() === arg);
        if (social) {
          response = [`✓ Connecting to ${social[0].toUpperCase()}...`];
          setTimeout(() => window.open(social[1], '_blank'), 1000);
        } else {
          response = [`✗ Unknown destination '${arg}'. Available: ${socialLinks.map(s => s[0]).join(', ')}`];
        }
        break;

      case 'new-page':
        setLines([]);
        return;

      default:
        response = [`✗ Command '${cmd}' not recognized. Type 'help' for available commands.`];
        break;
    }

    let delay = 50;
    response.forEach(line => {
      setTimeout(() => setLines(prev => [...prev, { text: line, isCommand: true }]), delay);
      delay += 100;
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    setLines(prev => [...prev, { text: input, isUserInput: true }]);
    setTimeout(() => processCommand(input), 100);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleQuickCommand = (cmd) => {
    setInput(cmd);
    setTimeout(() => {
      setLines(prev => [...prev, { text: cmd, isUserInput: true }]);
      processCommand(cmd);
      setInput('');
    }, 100);
  };

  const handleSuggestionSelect = (cmd) => {
    setInput(cmd);
    inputRef.current?.focus();
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
        
        <SubtleParticles />

        <div className="w-full max-w-5xl relative z-10 space-y-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-display mb-2 text-[#e5e5e5]">
              Final Page<span className="text-[#9f1239]">.</span>
            </h1>
            <p className="font-mono text-xs md:text-sm text-zinc-600 tracking-widest">
              /// ESTABLISH CONNECTION
            </p>
          </motion.div>

          {/* Quick Access Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[#9f1239] text-sm font-mono">⚡</span>
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">Quick Access</span>
            </div>
            <QuickAccessPanel contact={contact} onCommandClick={handleQuickCommand} />
          </motion.div>

          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0c0c0c]/95 backdrop-blur-sm border-2 border-[#222] relative overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] bg-[#0a0a0a]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#9f1239]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#c2410c]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#d97706]"></div>
                </div>
                <span className="font-mono text-xs text-zinc-600 ml-3">chronicle.terminal</span>
              </div>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="font-mono text-xs text-zinc-600 hover:text-[#9f1239] transition-colors"
              >
                {showHelp ? '[ HIDE HELP ]' : '[ SHOW HELP ]'}
              </button>
            </div>

            {/* Terminal Content */}
            <div 
              ref={pageRef}
              onClick={() => inputRef.current?.focus()}
              className="p-6 min-h-[400px] max-h-[500px] overflow-y-auto space-y-3 cursor-text"
            >
              {lines.map((line, idx) => (
                <OutputLine 
                  key={idx} 
                  text={line.text} 
                  isUserInput={line.isUserInput}
                  isCommand={line.isCommand}
                />
              ))}
            </div>

            {/* Input Area */}
            {isReady && (
              <div className="relative border-t border-[#222] bg-[#0a0a0a] p-4">
                <CommandSuggestions input={input} onSelect={handleSuggestionSelect} />
                <div className="flex items-center gap-2">
                  <span className="text-[#9f1239] font-mono flex-shrink-0">§</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-transparent border-none text-white font-mono text-sm focus:outline-none"
                    placeholder="Type command or use quick access above..."
                    spellCheck="false"
                    autoComplete="off"
                  />
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-5 bg-[#9f1239]"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Help Section */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#111] border border-[#222] p-6 overflow-hidden"
              >
                <h3 className="font-display text-xl text-zinc-300 mb-4 border-b border-[#333] pb-2">
                  Author's Guide
                </h3>
                <div className="font-serif text-sm text-zinc-500 space-y-3">
                  <p>
                    Welcome to the final page. You may communicate with the author through the terminal above.
                  </p>
                  <div className="space-y-2 font-mono text-xs">
                    <p>→ Use <code className="text-[#9f1239] px-1">Quick Access</code> buttons for instant connection</p>
                    <p>→ Type <code className="text-[#9f1239] px-1">help</code> to see available commands</p>
                    <p>→ Type <code className="text-[#9f1239] px-1">correspond</code> to draft an email</p>
                    <p>→ Type <code className="text-[#9f1239] px-1">dispatch [platform]</code> to open social links</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}