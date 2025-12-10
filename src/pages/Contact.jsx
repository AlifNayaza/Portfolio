import { useState, useEffect, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import PageTransition from "../components/layout/PageTransition";
import { motion } from "framer-motion";

// Komponen untuk menampilkan output per baris (tidak berubah)
const OutputLine = ({ text, isUserInput = false }) => {
    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.01, delayChildren: 0.1 } },
    };
    const letter = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

    const promptSymbol = <span className="text-zinc-500 mr-2">§</span>;

    return (
        <motion.p
            className={`whitespace-pre-wrap break-words ${isUserInput ? 'font-mono text-white text-sm md:text-base' : 'font-serif text-zinc-400 text-base md:text-lg italic'}`}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {isUserInput && promptSymbol}
            {text.split('').map((char, index) => (
                <motion.span key={index} variants={letter}>
                    {char}
                </motion.span>
            ))}
        </motion.p>
    );
};

export default function Contact() {
    const { data } = usePortfolio();
    const { contact } = data;

    const [lines, setLines] = useState([]);
    const [input, setInput] = useState('');
    const [isReady, setIsReady] = useState(false);
    const pageRef = useRef(null);
    const inputRef = useRef(null);
    
    // --- PERBAIKAN BUG DI SINI ---
    // Ref ini akan memastikan sequence pembuka hanya berjalan sekali
    const hasBooted = useRef(false);

    const socialLinks = contact 
        ? Object.entries(contact).filter(([key, value]) => key !== 'email' && value) 
        : [];

    useEffect(() => {
        // Hanya jalankan jika belum pernah dijalankan sebelumnya
        if (!hasBooted.current) {
            const openingSequence = [
                { text: "The ink settles on the final page...", delay: 100 },
                { text: "The author awaits your correspondence.", delay: 1200 },
                { text: "You may begin. (See the Author's Note below for guidance)", delay: 2200 },
            ];
            
            let delay = 500;
            openingSequence.forEach(line => {
                setTimeout(() => {
                    setLines(prev => [...prev, { text: line.text }]);
                }, delay);
                delay += line.delay;
            });

            setTimeout(() => {
                setIsReady(true);
                inputRef.current?.focus();
            }, delay + 300);

            // Tandai bahwa sequence sudah berjalan
            hasBooted.current = true;
        }
    }, []);

    useEffect(() => {
        pageRef.current?.scrollTo({ top: pageRef.current.scrollHeight, behavior: 'smooth' });
    }, [lines]);

    const processInquiry = (inquiry) => {
        const parts = inquiry.toLowerCase().split(' ');
        const command = parts[0];
        const arg = parts[1];
        let response = [];

        switch (command) {
            case 'inquiries':
                response = [
                    "The author will respond to the following inquiries:",
                    "  'correspond'      - Draft a new letter via email.",
                    `  'dispatch <arg>'  - Send a courier. Args: ${socialLinks.map(s => s[0]).join(', ')}`,
                    "  'new-page'        - Turn to a fresh page.",
                ];
                break;
            case 'correspond':
                if (!contact?.email) {
                    response = ["Alas, the author's inkwell for email is dry."];
                } else {
                    response = ["A new letter is being prepared...", "The parchment will be ready in a moment."];
                    setTimeout(() => {
                        window.location.href = `mailto:${contact.email}`;
                    }, 2500);
                }
                break;
            case 'dispatch':
                const social = socialLinks.find(([key]) => key.toLowerCase() === arg);
                if (social) {
                    response = [`A courier has been dispatched to ${social[0].toUpperCase()}...`];
                    setTimeout(() => window.open(social[1], '_blank'), 1500);
                } else {
                    response = [`The archives hold no route for '${arg}'. Available dispatch routes: ${socialLinks.map(s => s[0]).join(', ')}`];
                }
                break;
            case 'new-page':
                setLines([]);
                return;
            default:
                response = [`The words '${inquiry}' echo without meaning. (Type 'inquiries' for guidance)`];
                break;
        }

        let delay = 100;
        response.forEach(line => {
            setTimeout(() => {
                setLines(prev => [...prev, { text: line }]);
            }, delay);
            delay += 100;
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setLines(prev => [...prev, { text: input, isUserInput: true }]);
        setTimeout(() => processInquiry(input), 300);
        setInput('');
    };
    
    const focusInput = () => inputRef.current?.focus();

    return (
        <PageTransition>
            <div className="min-h-[70vh] flex flex-col justify-center items-center text-center relative px-4 md:px-6 overflow-hidden">
                {/* Antarmuka Interaktif */}
                <div 
                    ref={pageRef} 
                    className="w-full max-w-4xl h-[55vh] md:h-[50vh] bg-transparent p-4 flex flex-col border border-[#333] mb-8"
                    onClick={focusInput}
                >
                    <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                        {lines.map((line, index) => (
                            <OutputLine key={index} text={line.text} isUserInput={line.isUserInput} />
                        ))}
                    </div>

                    {isReady && (
                        <form onSubmit={handleFormSubmit} className="flex items-center mt-4 flex-shrink-0">
                            <span className="text-zinc-500 font-mono text-sm md:text-base mr-2">§</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="bg-transparent border-none text-white font-mono text-sm md:text-base w-full focus:outline-none"
                                spellCheck="false"
                                autoComplete="off"
                                placeholder="Type your inquiry..."
                            />
                            <span className="w-2.5 h-5 md:h-6 bg-[#9f1239] animate-pulse"></span>
                        </form>
                    )}
                </div>

                {/* --- BAGIAN PANDUAN BARU --- */}
                <motion.div 
                    className="w-full max-w-4xl text-left font-serif text-zinc-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isReady ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <h2 className="font-display text-xl text-zinc-300 mb-4 border-b border-[#333] pb-2">Author's Note</h2>
                    <p className="mb-4 text-sm md:text-base">
                        This is the final page of the manuscript. You may communicate with the author by typing an inquiry above and pressing Enter. Below is a guide to the available inquiries.
                    </p>
                    <div className="text-sm md:text-base space-y-2">
                        <p>• Type <code className="text-[#9f1239] font-mono mx-1">inquiries</code> to see this list again.</p>
                        <p>• Type <code className="text-[#9f1239] font-mono mx-1">correspond</code> to begin drafting a personal letter to the author.</p>
                        <p>• Type <code className="text-[#9f1239] font-mono mx-1">dispatch</code> followed by a destination (e.g., <code className="font-mono">dispatch github</code>) to be sent to other archives.</p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}