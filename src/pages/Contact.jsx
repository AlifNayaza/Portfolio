import { useState, useEffect, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// === CANVAS: FLOATING CONNECTION PARTICLES (OPTIMIZED) ===
const ConnectionParticles = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const mouseActive = useRef(false);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let frameCount = 0;
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = window.innerWidth < 768 ? 20 : 30;
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          color: Math.random() > 0.7 ? '#9f1239' : '#c2410c',
          alpha: Math.random() * 0.12 + 0.03,
          pulseSpeed: Math.random() * 0.008 + 0.002,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      mouseActive.current = true;
    };

    const handleMouseLeave = () => {
      mouseActive.current = false;
    };

    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const delta = currentTime - lastTime;
      
      if (delta > interval) {
        lastTime = currentTime - (delta % interval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesRef.current.forEach(p => {
          // Interaksi dengan mouse
          if (mouseActive.current) {
            const dx = mousePos.current.x - p.x;
            const dy = mousePos.current.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
              const force = (80 - distance) / 80 * 0.08;
              p.speedX += (dx / distance) * force * 0.03;
              p.speedY += (dy / distance) * force * 0.03;
            }
          }

          // Update posisi
          p.x += p.speedX;
          p.y += p.speedY;
          p.pulsePhase += p.pulseSpeed;
          
          // Batas kanvas dengan bounce lembut
          if (p.x < 0 || p.x > canvas.width) p.speedX *= -0.98;
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -0.98;
          
          // Redaman
          p.speedX *= 0.995;
          p.speedY *= 0.995;
          
          // Gambar partikel
          const pulse = Math.sin(p.pulsePhase) * 0.25 + 0.75;
          ctx.beginPath();
          ctx.globalAlpha = p.alpha * pulse;
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Gambar koneksi (setiap 3 frame untuk performa)
        if (frameCount % 3 === 0) {
          ctx.globalAlpha = 0.03;
          ctx.strokeStyle = '#9f1239';
          ctx.lineWidth = 0.6;
          
          for (let i = 0; i < particlesRef.current.length; i++) {
            for (let j = i + 1; j < particlesRef.current.length; j++) {
              const p1 = particlesRef.current[i];
              const p2 = particlesRef.current[j];
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 80) {
                ctx.globalAlpha = (80 - distance) / 80 * 0.08;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }
        
        frameCount++;
      }
      
      rafIdRef.current = requestAnimationFrame(animate);
    };

    // Event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Start animation with delay
    const startDelay = setTimeout(() => {
      rafIdRef.current = requestAnimationFrame(animate);
    }, 300);

    return () => {
      clearTimeout(startDelay);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-8"
      style={{ willChange: 'transform' }}
    />
  );
};

// === ANIMATION VARIANTS ===
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200
    }
  }
};

const cardHoverVariants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0px 0px 0px rgba(159, 18, 57, 0)"
  },
  hover: {
    scale: 1.02,
    y: -3,
    boxShadow: "0px 8px 24px rgba(159, 18, 57, 0.15)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400
    }
  }
};

const terminalLineVariants = {
  hidden: { 
    opacity: 0, 
    x: -10,
    filter: "blur(2px)"
  },
  visible: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

/// === QUICK ACCESS PANEL ===
const QuickAccessPanel = ({ contact, onCommandClick }) => {
  const socialLinks = contact 
    ? Object.entries(contact).filter(([key, value]) => key !== 'email' && value) 
    : [];

  const quickCommands = [
    { 
      cmd: 'email', 
      label: 'Send Email', 
      icon: '📧', 
      description: 'Compose a message',
      color: 'from-[#9f1239]/20 to-[#9f1239]/5',
      borderColor: 'border-[#9f1239]/40'
    },
    ...socialLinks.map(([key, value]) => ({
      cmd: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      icon: key === 'github' ? '💻' : 
            key === 'linkedin' ? '💼' : 
            key === 'instagram' ? '📸' : '🐦',
      description: `Navigate to ${key}`,
      color: 'from-[#333]/10 to-transparent',
      borderColor: 'border-[#333]/60 hover:border-[#9f1239]/60'
    }))
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-3"
    >
      {quickCommands.map((cmd, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          initial="rest"
          animate="rest"
          onClick={() => onCommandClick(cmd.cmd)}
          className={`group relative overflow-hidden bg-gradient-to-br ${cmd.color} border ${cmd.borderColor} rounded-xl p-5 cursor-pointer transition-all duration-300 min-h-[110px] flex flex-col items-center justify-center`}
        >
          {/* Background glow effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#9f1239]/5 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          
          {/* Icon */}
          <motion.span 
            className="text-3xl mb-3 z-10"
            whileHover={{ 
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 }
            }}
          >
            {cmd.icon}
          </motion.span>
          
          {/* Content */}
          <div className="text-center z-10">
            <div className="font-medium text-white mb-1 tracking-wide text-sm">
              {cmd.label}
            </div>
            <motion.div 
              className="text-xs text-zinc-500 group-hover:text-[#9f1239]/80 transition-colors"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              {cmd.description}
            </motion.div>
          </div>
          
          {/* Active indicator dot */}
          <motion.div 
            className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#9f1239]/50"
            whileHover={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
              transition: { duration: 0.8, repeat: Infinity }
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

// === TERMINAL OUTPUT LINE ===
const TerminalLine = ({ text, isUserInput = false, isCommand = false, index }) => {
  return (
    <motion.div
      variants={terminalLineVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className={`${isUserInput ? 'flex items-start gap-2 text-white' : isCommand ? 'text-[#9f1239] text-sm' : 'text-zinc-400'} font-mono text-sm tracking-wide`}
    >
      {isUserInput && (
        <motion.span 
          className="text-[#9f1239] flex-shrink-0"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          $
        </motion.span>
      )}
      <motion.span 
        className="break-words"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

// === ANIMATED TYPING CURSOR ===
const TypingCursor = () => {
  return (
    <motion.span
      animate={{ 
        opacity: [1, 0, 1],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 0.8, 
        repeat: Infinity,
        times: [0, 0.5, 1]
      }}
      className="inline-block w-2 h-5 bg-[#9f1239] ml-1"
    />
  );
};

// === MAIN CONTACT COMPONENT ===
export default function Contact() {
  const { data } = usePortfolio();
  const { contact } = data;

  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const hasBooted = useRef(false);

  const socialLinks = contact 
    ? Object.entries(contact).filter(([key, value]) => key !== 'email' && value) 
    : [];

  // Scroll-based animations
  const { scrollYProgress } = useScroll();
  const opacityTransform = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scaleTransform = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  useEffect(() => {
    if (!hasBooted.current) {
      const openingSequence = [
        { text: "Initializing connection protocols...", delay: 400 },
        { text: "Contact terminal ready", delay: 300 },
        { text: "Welcome, traveler.", delay: 500 },
        { text: "Multiple pathways available below.", delay: 400 },
        { text: "Type 'help' to unveil commands", delay: 300 },
      ];
      
      let delay = 200;
      openingSequence.forEach((line, idx) => {
        setTimeout(() => {
          setLines(prev => [...prev, { 
            text: line.text, 
            isCommand: true,
            id: Date.now() + idx 
          }]);
        }, delay);
        delay += line.delay;
      });

      setTimeout(() => {
        setIsReady(true);
        setIsTyping(true);
        inputRef.current?.focus();
      }, delay + 200);

      hasBooted.current = true;
    }
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollTo({ 
      top: terminalRef.current.scrollHeight, 
      behavior: 'smooth' 
    });
  }, [lines]);

  const processCommand = (cmd) => {
    const command = cmd.toLowerCase().trim();
    let response = [];

    switch (command) {
      case 'help':
        response = [
          "Available commands:",
          "  email        - Open email client to send me a message",
          "  github       - Visit my GitHub profile",
          "  linkedin     - Visit my LinkedIn profile",
          "  instagram    - Visit my Instagram profile",
          "  twitter      - Visit my Twitter/X profile",
          "  clear        - Clear terminal screen",
          "  help         - Show this help message",
        ];
        break;

      case 'email':
        if (!contact?.email) {
          response = ["Email address not configured at the moment."];
        } else {
          response = ["Opening email client..."];
          setTimeout(() => window.location.href = `mailto:${contact.email}?subject=Message from portfolio visitor`, 800);
        }
        break;

      case 'github':
      case 'linkedin':
      case 'instagram':
      case 'twitter':
        const social = socialLinks.find(([key]) => key.toLowerCase() === command);
        if (social) {
          response = [`Redirecting to ${social[0]}...`];
          setTimeout(() => window.open(social[1], '_blank'), 600);
        } else {
          response = [`${command} link unavailable.`];
        }
        break;

      case 'clear':
        setLines([]);
        return;

      default:
        response = [`Command '${cmd}' not recognized. Type 'help' for available commands.`];
        break;
    }

    let delay = 50;
    response.forEach((line, idx) => {
      setTimeout(() => {
        setLines(prev => [...prev, { 
          text: line, 
          isCommand: true,
          id: Date.now() + idx 
        }]);
      }, delay);
      delay += 60;
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    
    setLines(prev => [...prev, { 
      text: input, 
      isUserInput: true,
      id: Date.now() 
    }]);
    
    setTimeout(() => processCommand(input), 120);
    setInput('');
    setIsTyping(false);
    setTimeout(() => setIsTyping(true), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleQuickCommand = (cmd) => {
    setInput(cmd);
    setTimeout(() => {
      setLines(prev => [...prev, { 
        text: cmd, 
        isUserInput: true,
        id: Date.now() 
      }]);
      processCommand(cmd);
      setInput('');
    }, 80);
  };

  // Animated characters for terminal input
  const inputCharacters = input.split('');
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col justify-center items-center py-8 md:py-12 px-4 relative overflow-hidden">
        
        <ConnectionParticles />

        <motion.div 
          style={{ opacity: opacityTransform, scale: scaleTransform }}
          className="w-full max-w-5xl relative z-10 space-y-10 md:space-y-12"
        >
          
          {/* Header with animated underline */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-display text-white mb-4 tracking-tight"
              initial={{ letterSpacing: "0.05em" }}
              animate={{ letterSpacing: "0.02em" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Establish Connection
            </motion.h1>
            
            <motion.div 
              className="relative inline-block"
              initial={{ width: 0 }}
              animate={{ width: "180px" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="h-1 bg-gradient-to-r from-transparent via-[#9f1239] to-transparent rounded-full" />
              <motion.div 
                className="absolute -top-1 left-1/2 w-3 h-3 rounded-full bg-[#9f1239]"
                animate={{ 
                  x: ["-50%", "-50%"],
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  scale: { duration: 1.5, repeat: Infinity },
                }}
                style={{ x: "-50%" }}
              />
            </motion.div>
            
            <motion.p 
              className="text-zinc-400 max-w-2xl mx-auto mt-6 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Select an interface below or engage directly with the terminal. 
              Responses are typically within 24 cycles.
            </motion.p>
          </motion.div>

          {/* Quick Access Panel */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-4 h-4 bg-[#9f1239] rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  boxShadow: ["0 0 0px #9f1239", "0 0 8px #9f1239", "0 0 0px #9f1239"]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <h2 className="font-medium text-white tracking-wider text-lg">Direct Channels</h2>
            </div>
            <QuickAccessPanel contact={contact} onCommandClick={handleQuickCommand} />
          </motion.section>

          {/* Terminal Window */}
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", damping: 25 }}
            className="bg-[#0c0c0c]/95 backdrop-blur-sm border border-[#222] rounded-xl overflow-hidden shadow-2xl shadow-black/30"
          >
            {/* Terminal Header */}
            <motion.div 
              className="flex items-center justify-between px-6 py-4 border-b border-[#222] bg-gradient-to-r from-[#0a0a0a] to-[#111]"
              whileHover={{ backgroundColor: "rgba(10, 10, 10, 0.9)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {['#9f1239', '#c2410c', '#d97706'].map((color, idx) => (
                    <motion.div
                      key={idx}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                      animate={{ 
                        y: [0, -2, 0],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 1.5,
                        delay: idx * 0.2,
                        repeat: Infinity
                      }}
                    />
                  ))}
                </div>
                <motion.span 
                  className="font-mono text-sm text-zinc-300 tracking-wide"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  contact-terminal
                </motion.span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHelp(!showHelp)}
                className="text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1 rounded border border-transparent hover:border-[#333]"
              >
                {showHelp ? 'Hide Guide' : 'Show Guide'}
              </motion.button>
            </motion.div>

            {/* Terminal Content */}
            <motion.div 
              ref={terminalRef}
              className="p-6 min-h-[280px] max-h-[360px] overflow-y-auto space-y-3 home-scroll"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {lines.map((line, idx) => (
                <TerminalLine 
                  key={line.id || idx}
                  text={line.text} 
                  isUserInput={line.isUserInput}
                  isCommand={line.isCommand}
                  index={idx}
                />
              ))}
            </motion.div>

            {/* Input Area */}
            {isReady && (
              <motion.div 
                className="border-t border-[#222] bg-[#0a0a0a]/80 p-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <motion.span 
                    className="text-[#9f1239] font-bold"
                    animate={{ 
                      opacity: [1, 0.6, 1],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 1.2, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    $
                  </motion.span>
                  <div className="flex-1 flex items-center min-h-[24px]">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        setIsTyping(true);
                      }}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-transparent border-none text-white placeholder:text-zinc-600 focus:outline-none font-mono tracking-wide"
                      placeholder="Enter command..."
                      spellCheck="false"
                      autoComplete="off"
                    />
                    {isTyping && input.length === 0 && <TypingCursor />}
                    
                    {/* Animated input characters */}
                    {input.length > 0 && (
                      <div className="flex">
                        {inputCharacters.map((char, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className="inline-block"
                          >
                            {char}
                          </motion.span>
                        ))}
                        <TypingCursor />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.section>

          {/* Help Guide */}
          <AnimatePresence>
            {showHelp && (
              <motion.section
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: "auto",
                  marginTop: "1.5rem"
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0,
                  marginTop: 0
                }}
                transition={{ 
                  opacity: { duration: 0.3 },
                  height: { type: "spring", damping: 25 }
                }}
                className="bg-gradient-to-b from-[#111]/80 to-[#0a0a0a]/80 border border-[#222] rounded-xl p-6 overflow-hidden backdrop-blur-sm"
              >
                <motion.div 
                  className="flex items-center gap-3 mb-6"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div 
                    className="w-6 h-6 bg-gradient-to-br from-[#9f1239] to-[#c2410c] rounded-full flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="text-xs text-white">?</span>
                  </motion.div>
                  <h3 className="text-xl font-medium text-white tracking-wide">Navigation Guide</h3>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div 
                    className="space-y-4"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="text-white font-medium tracking-wide">Direct Channels</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Each card represents a direct communication pathway. Hover to preview the interaction, 
                      click to initiate connection. Visual feedback confirms successful activation.
                    </p>
                    <motion.div 
                      className="h-1 bg-gradient-to-r from-[#9f1239] to-transparent rounded-full w-24"
                      initial={{ width: 0 }}
                      animate={{ width: "96px" }}
                      transition={{ delay: 0.4 }}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-4"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="text-white font-medium tracking-wide">Terminal Interface</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      For precise control, type commands directly. The terminal responds with real-time feedback. 
                      Experiment with different commands to explore all available functions.
                    </p>
                    <motion.div 
                      className="h-1 bg-gradient-to-r from-[#c2410c] to-transparent rounded-full w-24"
                      initial={{ width: 0 }}
                      animate={{ width: "96px" }}
                      transition={{ delay: 0.5 }}
                    />
                  </motion.div>
                </div>
                
                <motion.div 
                  className="mt-8 pt-6 border-t border-[#222]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.4, 1],
                        boxShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 8px rgba(34, 197, 94, 0.5)", "0 0 0px rgba(34, 197, 94, 0)"]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                    <span className="text-sm text-zinc-500">
                      System active • Response window: 12-24 cycles
                    </span>
                  </div>
                </motion.div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Direct Contact CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="relative overflow-hidden rounded-xl"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-[#9f1239]/10 via-[#c2410c]/5 to-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ 
                backgroundSize: "200% 200%"
              }}
            />
            
            <div className="relative border border-[#222] rounded-xl p-6 md:p-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-medium text-white tracking-wide">Direct Transmission</h3>
                  <p className="text-zinc-400 text-sm max-w-md">
                    For detailed inquiries, collaboration proposals, or secure communication.
                  </p>
                </div>
                
                {contact?.email && (
                  <motion.a
                    href={`mailto:${contact.email}?subject=Portfolio Inquiry`}
                    className="relative overflow-hidden group"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-[#9f1239] to-[#c2410c]"
                      animate={{ 
                        x: ["-100%", "100%"]
                      }}
                      transition={{ 
                        duration: 0.8,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      style={{ opacity: 0.1 }}
                    />
                    <div className="relative px-6 py-3 bg-[#9f1239] text-white font-medium rounded-lg hover:bg-[#7f0e2a] transition-colors">
                      Initiate Transmission
                    </div>
                  </motion.a>
                )}
              </div>
            </div>
          </motion.section>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center pt-8 border-t border-[#222]/30"
          >
            <motion.p 
              className="text-sm text-zinc-500 mb-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Connection established • Awaiting response
            </motion.p>
            <p className="text-xs text-zinc-600 tracking-wide">
              © {new Date().getFullYear()} • All transmission channels secured
            </p>
            
            {/* Decorative dots */}
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3].map((dot) => (
                <motion.div
                  key={dot}
                  className="w-1 h-1 rounded-full bg-zinc-700"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: dot * 0.2,
                    repeat: Infinity
                  }}
                />
              ))}
            </div>
          </motion.footer>
        </motion.div>

        {/* Floating particles background (lightweight alternative) */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[1px] h-[1px] bg-[#9f1239]/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}