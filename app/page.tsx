"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [isBooting, setIsBooting] = useState(true);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState(""); // NEW: Tracks which video to play
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false); 
  const [skillIndex, setSkillIndex] = useState(0);
  const [themeMode, setThemeMode] = useState(0); 
  const [time, setTime] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(false);

  const skills = ["Web Development", "Video Editing", "Content Creation", "Digital Systems", "Flutter Apps"];
  const constraintsRef = useRef(null); 

  // --- MOCK DATA: MEDIA PROJECTS ---
  // Notice the YouTube URLs. We add ?autoplay=1&modestbranding=1&rel=0 to hide YouTube's UI
  const videoProjects = [
    { id: 1, title: "2026_Showreel.mp4", size: "142M", url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&modestbranding=1&rel=0&showinfo=0" },
    { id: 2, title: "Tech_Commercial_v2.mov", size: "850M", url: "https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&modestbranding=1&rel=0&showinfo=0" },
    { id: 3, title: "Event_Recap_01.mp4", size: "210M", url: "https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&modestbranding=1&rel=0&showinfo=0" },
  ];

  const canvaProjects = [
    { id: 1, title: "DEV_TIPS_01", type: "CAROUSEL", color: "border-cyan-400", img: "/canva-1.jpg" },
    { id: 2, title: "BRAND_GUIDE_V2", type: "BRANDING", color: "border-fuchsia-400", img: "/canva-2.jpg" },
    { id: 3, title: "HACKATHON_PROMO", type: "POSTER", color: "border-yellow-400", img: "/canva-3.jpg" },
    { id: 4, title: "UI_UX_PRINCIPLES", type: "CAROUSEL", color: "border-emerald-400", img: "/canva-4.jpg" },
    { id: 5, title: "THESIS_INFOGRAPHIC", type: "DATA_VIZ", color: "border-blue-400", img: "/canva-5.jpg" },
  ];

  // --- AUDIO ENGINE ---
  const playSound = (freq: number, type: OscillatorType, duration: number, vol: number = 0.05) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const tickSound = () => playSound(800, 'square', 0.05, 0.01);
  const clickSound = () => playSound(1200, 'sine', 0.15, 0.03);
  const bootSound = () => playSound(300, 'sawtooth', 0.3, 0.02);

  // --- BOOT SEQUENCE LOGIC ---
  useEffect(() => {
    const logs = ["INITIALIZING KERNEL...", "MOUNTING MEDIA_DRIVES [OK]", "LOADING PORTFOLIO.EXE...", "ESTABLISHING SECURE CONNECTION...", "ACCESS GRANTED."];
    let currentIndex = 0;
    const bootInterval = setInterval(() => {
      setBootLogs(prev => [...prev, logs[currentIndex]]);
      bootSound();
      currentIndex++;
      if (currentIndex >= logs.length) { clearInterval(bootInterval); setTimeout(() => setIsBooting(false), 800); }
    }, 400);
    return () => clearInterval(bootInterval);
  }, []);

  // --- TIME & SKILL LOGIC ---
  useEffect(() => {
    const interval = setInterval(() => {
      setSkillIndex((prev) => (prev + 1) % skills.length);
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, [skills.length]);

  // --- EASTER EGG (SUDO) LOGIC ---
  useEffect(() => {
    let keyBuffer = "";
    const targetWord = "sudo";
    const handleKeyDown = (e: KeyboardEvent) => {
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > targetWord.length) keyBuffer = keyBuffer.slice(-targetWord.length);
      if (keyBuffer === targetWord) { setIsTerminalOpen(true); clickSound(); keyBuffer = ""; }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- SCROLL HANDLER ---
  const handleScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 150;
    setIsAtBottom(bottom);
  };

  const themeFilters = ["", "sepia(1) hue-rotate(70deg) saturate(3) contrast(1.2)", "sepia(1) hue-rotate(350deg) saturate(4) contrast(1.1)"];

  if (isBooting) {
    return (
      <div className="min-h-screen bg-black text-[#00ff00] font-mono p-8 text-sm md:text-base flex flex-col justify-end">
        <div className="max-w-3xl space-y-2">{bootLogs.map((log, i) => <div key={i} className="animate-pulse">&gt; {log}</div>)}<div className="w-3 h-5 bg-[#00ff00] animate-ping mt-2"></div></div>
      </div>
    );
  }

  return (
    <div ref={constraintsRef} className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] text-neutral-200 selection:bg-fuchsia-500 selection:text-white font-sans transition-all duration-700" style={{ filter: themeFilters[themeMode] }}>
      <style dangerouslySetInnerHTML={{__html: `
        .glitch-hover { position: relative; display: inline-block; }
        .glitch-hover:hover::before, .glitch-hover:hover::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: inherit; }
        .glitch-hover:hover::before { left: 3px; text-shadow: -2px 0 red; clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); animation: glitch-anim 0.2s linear infinite alternate-reverse; }
        .glitch-hover:hover::after { left: -3px; text-shadow: -2px 0 cyan; clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%); animation: glitch-anim-2 0.3s linear infinite alternate-reverse; }
        @keyframes glitch-anim { 0% { transform: translate(0) } 100% { transform: translate(-3px, 2px) } }
        @keyframes glitch-anim-2 { 0% { transform: translate(0) } 100% { transform: translate(3px, -2px) } }
        .retro-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .retro-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; border: 1px solid #262626; }
        .retro-scrollbar::-webkit-scrollbar-thumb { background: #d946ef; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:linear-gradient(to_bottom,#000_20%,transparent_100%)] pointer-events-none opacity-50"></div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

      {/* BIOS QUICK-NAV */}
      <div className="absolute top-6 left-6 z-[100] flex flex-col gap-2 font-mono text-xs uppercase tracking-widest font-bold">
        <div className="text-neutral-500 mb-1 border-b border-neutral-800 pb-1 w-24">SYS.NAV</div>
        <a href="#hero" onClick={clickSound} onMouseEnter={tickSound} className="text-neutral-400 hover:text-cyan-400 transition-colors">&gt; INDEX</a>
        <a href="#projects" onClick={clickSound} onMouseEnter={tickSound} className="text-neutral-400 hover:text-cyan-400 transition-colors">&gt; DEPLOYS</a>
        <a href="#about" onClick={clickSound} onMouseEnter={tickSound} className="text-neutral-400 hover:text-cyan-400 transition-colors">&gt; BIO</a>
        <a href="#contact" onClick={clickSound} onMouseEnter={tickSound} className="text-neutral-400 hover:text-cyan-400 transition-colors">&gt; COMM</a>
      </div>

      {/* THEME SWITCHER */}
      <div className="absolute top-6 right-6 z-[100] flex flex-col items-end gap-2">
        <button onClick={() => { clickSound(); setThemeMode((prev) => (prev + 1) % 3); }} onMouseEnter={tickSound} className="bg-neutral-900 border-2 border-cyan-400 text-cyan-400 font-mono text-xs font-bold px-3 py-1.5 shadow-[4px_4px_0px_0px_#22d3ee] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all uppercase hover:bg-cyan-400 hover:text-neutral-900">[ TOGGLE_THEME ]</button>
      </div>

      {/* LIVE TELEMETRY */}
      <div className={`absolute bottom-6 right-6 z-[100] bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 p-3 font-mono text-[10px] text-neutral-500 uppercase tracking-widest text-right pointer-events-none transition-opacity duration-300 ${isAtBottom ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-cyan-400 font-bold mb-1">SYS.TELEMETRY_ACTIVE</div>
        <div>UPLINK: SECURE_NODE_01</div>
        <div>DATE: {new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</div>
        <div>TIME: {time}</div>
        <div className="flex items-center justify-end gap-2 mt-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> NETWORK_STABLE</div>
      </div>

      {/* --- SMOKE & MIRRORS VIDEO MODAL --- */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[150] flex items-center justify-center p-4 pointer-events-none">
            <motion.div drag dragConstraints={constraintsRef} dragMomentum={false} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-4xl bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-4 border-r-4 border-black p-1 shadow-2xl pointer-events-auto">
              <div className="bg-blue-800 px-2 py-1 flex justify-between items-center mb-1 cursor-move">
                <span className="text-white font-black font-mono text-sm tracking-wider select-none">MEDIA_PLAYER.EXE</span>
                <button 
                  onClick={() => { clickSound(); setIsVideoModalOpen(false); setActiveVideoUrl(""); }} 
                  className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black px-2 py-0.5 text-black font-bold font-mono text-xs active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-neutral-300"
                >
                  X
                </button>
              </div>
              <div className="w-full aspect-video bg-black border-t-4 border-l-4 border-black border-b-2 border-r-2 border-white flex flex-col items-center justify-center relative overflow-hidden">
                {activeVideoUrl ? (
                  <iframe 
                    src={activeVideoUrl} 
                    title="Secure Video Stream"
                    className="w-full h-full border-0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <span className="text-[#00ff00] font-mono animate-pulse text-lg z-10">AWAITING VIDEO STREAM...</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVaultOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[150] flex items-center justify-center p-4 pointer-events-none">
            <motion.div drag dragConstraints={constraintsRef} dragMomentum={false} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-5xl bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-4 border-r-4 border-black p-1 shadow-2xl pointer-events-auto flex flex-col max-h-[85vh]">
              <div className="bg-blue-800 px-2 py-1 flex justify-between items-center mb-1 cursor-move">
                <span className="text-white font-black font-mono text-sm tracking-wider select-none">VAULT_EXPLORER.EXE - C:/USER/CANVA_ARCHIVE</span>
                <button onClick={() => { clickSound(); setIsVaultOpen(false); }} className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black px-2 py-0.5 text-black font-bold font-mono text-xs active:border-t-black active:border-l-black active:border-b-white active:border-r-white hover:bg-neutral-300">X</button>
              </div>
              <div className="w-full bg-white border-t-4 border-l-4 border-black border-b-2 border-r-2 border-white p-4 overflow-y-auto retro-scrollbar flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {canvaProjects.map((project) => (
                    <div key={project.id} className="bg-[#0a0a0a] border-4 border-neutral-300 p-2 flex flex-col group hover:border-blue-600 transition-colors" onMouseEnter={tickSound}>
                      <div className={`w-full aspect-square bg-neutral-950 border-2 ${project.color} flex items-center justify-center relative overflow-hidden mb-2`}>
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:200%_200%] animate-[gradient_3s_linear_infinite] z-10 pointer-events-none"></div>
                        <img src={project.img} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300" />
                      </div>
                      <span className="font-mono text-xs text-blue-800 font-bold uppercase truncate group-hover:underline">{project.title}.png</span>
                      <span className="font-mono text-[10px] text-neutral-500 uppercase">{project.type} | 1080x1080</span>
                    </div>
                  ))}
                  <div className="bg-neutral-100 border-4 border-dashed border-neutral-300 p-2 flex flex-col items-center justify-center opacity-50 min-h-[200px]">
                     <span className="font-mono text-xs text-neutral-400">AWAITING_UPLOAD...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ADMIN TERMINAL & CMS DASHBOARD --- */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none">
            <motion.div drag dragConstraints={constraintsRef} dragMomentum={false} initial={{ y: -50 }} animate={{ y: 0 }} exit={{ y: -50 }} className="w-full max-w-2xl bg-black border-2 border-[#00ff00] p-1 shadow-[0_0_30px_rgba(0,255,0,0.2)] pointer-events-auto">
              
              {/* Terminal Header */}
              <div className="bg-[#00ff00] px-2 py-1 flex justify-between items-center cursor-move">
                <span className="text-black font-black font-mono text-sm tracking-wider select-none">ROOT_TERMINAL</span>
                <button 
                  onClick={() => { 
                    clickSound(); 
                    setIsTerminalOpen(false); 
                    setTimeout(() => { setIsAuthorized(false); setTerminalInput(""); }, 500);
                  }} 
                  className="text-black font-bold font-mono text-xs hover:bg-black hover:text-[#00ff00] px-1"
                >
                  X
                </button>
              </div>

              {/* Terminal Body */}
              <div className="p-5 font-mono text-[#00ff00] space-y-4 text-sm md:text-base min-h-[250px]">
                {!isAuthorized ? (
                  // LOGIN SCREEN
                  <div className="space-y-4">
                    <p>&gt; WARNING: RESTRICTED SUBSYSTEM.</p>
                    <p>&gt; PLEASE AUTHENTICATE TO ACCESS MEDIA CONFIGURATION.</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span>&gt; PASSWORD:</span>
                      <input 
                        type="password" 
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            clickSound();
                            if (terminalInput === 'admin') {
                              setIsAuthorized(true);
                            } else {
                              setTerminalInput("");
                            }
                          }
                        }}
                        className="bg-transparent border-b border-[#00ff00]/50 text-[#00ff00] outline-none focus:border-[#00ff00] w-48 transition-colors"
                        autoFocus
                      />
                    </div>
                    {terminalInput === "" && <p className="text-neutral-500 text-xs mt-4">Hint: Type 'admin' and press Enter</p>}
                  </div>
                ) : (
                  // ADMIN DASHBOARD
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <p>&gt; AUTHENTICATION SUCCESSFUL.</p>
                    <p>&gt; INITIALIZING MEDIA_DASHBOARD.EXE...</p>
                    
                    <div className="p-4 border border-[#00ff00]/30 bg-[#00ff00]/5 mt-4">
                      <div className="flex justify-between items-center mb-4 border-b border-[#00ff00]/30 pb-2">
                        <p className="font-bold text-white uppercase tracking-widest">SYSTEM CMS // MEDIA MANAGER</p>
                        <span className="text-xs bg-[#00ff00] text-black px-2 font-bold">ONLINE</span>
                      </div>
                      
                      <p className="text-[#00ff00]/70 text-xs mb-6">
                        // Backend database connection required to persist uploads. Currently running in UI configuration mode.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onMouseEnter={tickSound} onClick={clickSound} className="border border-[#00ff00] p-3 text-left hover:bg-[#00ff00] hover:text-black transition-colors group">
                          <span className="font-bold block mb-1">[+] UPLOAD IMAGE</span>
                          <span className="text-xs opacity-70 group-hover:opacity-100">Inject static art to Canva Vault</span>
                        </button>
                        <button onMouseEnter={tickSound} onClick={clickSound} className="border border-[#00ff00] p-3 text-left hover:bg-[#00ff00] hover:text-black transition-colors group">
                          <span className="font-bold block mb-1">[*] ADD VIDEO LINK</span>
                          <span className="text-xs opacity-70 group-hover:opacity-100">Embed YouTube/Vimeo into Archive</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SCROLLING CONTENT --- */}
      <div className="h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth relative z-10" onScroll={handleScroll}>
        
        {/* HERO SECTION */}
        <main id="hero" className="min-h-[90vh] flex flex-col items-center justify-center p-8 pt-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-4xl text-center w-full flex flex-col items-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 border-2 border-fuchsia-500 bg-fuchsia-500/10 mb-8 font-mono text-xs uppercase tracking-widest text-fuchsia-400 shadow-[4px_4px_0px_0px_#d946ef]">
              <span className="w-2.5 h-2.5 bg-fuchsia-500 animate-ping"></span> SYS.STATUS: OPEN_FOR_PROJECTS
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[1.1] uppercase">
              I DO <br className="hidden md:block"/>
              <span className="relative inline-flex items-center w-full justify-center text-cyan-400 h-[1.2em]">
                <AnimatePresence mode="wait">
                  <motion.span key={skillIndex} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="absolute text-center whitespace-nowrap drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] glitch-hover" data-text={skills[skillIndex]}>{skills[skillIndex]}</motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-xl text-neutral-400 mb-10 max-w-xl mx-auto font-medium">Bridging the gap between technical architecture and creative media.</p>
            <a href="#projects" className="inline-flex items-center justify-center px-8 py-4 bg-cyan-400 text-neutral-950 font-bold uppercase tracking-wider transition-all border-2 border-cyan-400 shadow-[6px_6px_0px_0px_#d946ef] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_#d946ef] glitch-hover" data-text="EXPLORE PORTFOLIO" onMouseEnter={tickSound} onClick={clickSound}>Explore Portfolio</a>
            <div className="mt-16 flex flex-wrap justify-center gap-4 text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
              {['Web_Dev', 'Video_Edit', 'Content_Creator'].map(tag => <div key={tag} className="px-3 py-1 border border-neutral-700 bg-neutral-900/80 hover:text-cyan-400 hover:border-cyan-400 transition-colors cursor-default" onMouseEnter={tickSound}>&gt; {tag}</div>)}
            </div>
          </motion.div>
        </main>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-32 px-8 bg-neutral-950/80">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-mono text-cyan-400 tracking-widest uppercase mb-12 flex items-center gap-4"><span className="h-px bg-cyan-400 w-16"></span> FILE://DEPLOYS</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-12">
                <div className="bg-neutral-900 border-2 border-neutral-700 p-8 md:p-12 flex flex-col transition-transform hover:-translate-y-2 hover:-translate-x-2 shadow-[8px_8px_0px_0px_#22d3ee] duration-200 group">
                  <div className="inline-block px-3 py-1 bg-yellow-400 text-neutral-950 text-xs font-black font-mono uppercase tracking-widest self-start mb-8">* FEATURED_SYSTEM</div>
                  <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="w-full md:w-1/2 space-y-6">
                      <h3 className="text-4xl font-black text-white uppercase glitch-hover" data-text="SmartB Portal">SmartB Portal</h3>
                      <p className="text-neutral-400 text-lg leading-relaxed">A digital service portal engineered to digitize local government transactions. Combines robust system architecture with clean, modern web development principles.</p>
                      <div className="flex flex-wrap gap-3 pt-4">
                        {["Web Dev", "Architecture", "Firebase", "Flutter"].map(tech => <span key={tech} className="text-xs font-mono font-bold px-2 py-1 bg-neutral-800 text-cyan-400 border border-neutral-700 cursor-default" onMouseEnter={tickSound}>{tech}</span>)}
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 aspect-video bg-neutral-950 border-2 border-neutral-700 flex items-center justify-center relative overflow-hidden mt-4 md:mt-0 p-2">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,211,238,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[gradient_3s_linear_infinite] z-10 pointer-events-none"></div>
                      <img src="/smartb.jpg" alt="SmartB Portal Interface" className="absolute inset-0 w-full h-full object-cover p-2 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="md:col-span-12">
                <div className="bg-neutral-900 border-2 border-neutral-700 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center shadow-[8px_8px_0px_0px_#10b981] transition-transform hover:-translate-y-2 hover:-translate-x-2 duration-200">
                  <div className="w-full md:w-1/2 space-y-6">
                    <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-black font-mono uppercase tracking-widest border border-emerald-500/50">+ MOBILE_ARCHITECTURE</div>
                    <h3 className="text-4xl font-black text-white uppercase glitch-hover" data-text="Cross-Platform Dev">Cross-Platform Dev</h3>
                    <p className="text-neutral-400 text-lg leading-relaxed">Deploying high-performance native applications across iOS and Android utilizing the Flutter engine. Optimized for fluid animations and seamless backend data synchronization.</p>
                    <div className="flex items-center gap-6 pt-4">
                      <div className="w-24 h-24 bg-neutral-950 border-2 border-neutral-700 p-2 flex flex-wrap gap-1 cursor-crosshair">
                        {[...Array(16)].map((_, i) => <div key={i} className={`w-[18%] h-[18%] ${Math.random() > 0.5 ? 'bg-emerald-400' : 'bg-neutral-800'}`}></div>)}
                      </div>
                      <div className="font-mono text-xs text-neutral-500 uppercase leading-loose"><span className="text-emerald-400 font-bold">&gt; SCAN_TO_DEPLOY</span><br/>LIVE_ENVIRONMENT_AWAITING</div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-[280px] h-[580px] bg-neutral-950 border-4 border-neutral-700 rounded-[3rem] p-4 relative shadow-[16px_16px_0px_0px_rgba(0,0,0,0.5)]">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-700 rounded-b-xl z-20"></div>
                      <div className="w-full h-full bg-neutral-900 rounded-[2rem] border-2 border-neutral-800 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(16,185,129,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[gradient_3s_linear_infinite] z-10 pointer-events-none"></div>
                        <img src="/mobile-app.jpg" alt="Mobile App Interface" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* MEDIA ARCHIVE (Now wires to activeVideoUrl) */}
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="md:col-span-6 flex">
                <div className="bg-neutral-900 border-2 border-neutral-700 p-8 w-full flex flex-col transition-transform hover:-translate-y-2 hover:-translate-x-2 shadow-[8px_8px_0px_0px_#d946ef] duration-200">
                  <div className="inline-block px-3 py-1 bg-fuchsia-500/20 text-fuchsia-400 text-xs font-black font-mono uppercase tracking-widest self-start mb-6 border border-fuchsia-500/50">+ MEDIA_ARCHIVE</div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase glitch-hover" data-text="Video Index">Video Index</h3>
                  <p className="text-neutral-400 mb-4 text-sm font-mono border-b border-neutral-800 pb-2">DIRECTORY OF /MEDIA/RENDERS/2026</p>
                  <div className="flex-grow bg-neutral-950 border border-neutral-800 p-4 font-mono text-xs overflow-y-auto max-h-48 retro-scrollbar flex flex-col gap-1">
                    
                    {videoProjects.map(video => (
                      <button 
                        key={video.id}
                        className="flex justify-between text-neutral-400 hover:text-fuchsia-400 hover:bg-fuchsia-500/10 p-1.5 transition-colors w-full text-left" 
                        onMouseEnter={tickSound} 
                        onClick={() => { clickSound(); setActiveVideoUrl(video.url); setIsVideoModalOpen(true); }}
                      >
                        <span>[STREAM] {video.title}</span><span>{video.size}</span>
                      </button>
                    ))}
                    
                  </div>
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-6 flex">
                <div className="bg-neutral-900 border-2 border-neutral-700 p-8 w-full flex flex-col transition-transform hover:-translate-y-2 hover:-translate-x-2 shadow-[8px_8px_0px_0px_#eab308] duration-200">
                  <div className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-black font-mono uppercase tracking-widest self-start mb-6 border border-yellow-400/50">
                    + VISUAL_DESIGN
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 uppercase glitch-hover" data-text="Canva Carousels & Edits">
                    Canva Carousels & Edits
                  </h3>
                  <p className="text-neutral-400 mb-6 text-sm">
                    Crafting engaging, high-conversion carousel graphics and short-form social media edits.
                  </p>
                  
                  <div className="flex gap-4 overflow-x-auto py-2 mb-8 hide-scroll snap-x cursor-grab active:cursor-grabbing hover:bg-neutral-950/50 transition-colors rounded">
                    {canvaProjects.map(project => (
                      <div key={project.id} className={`flex-shrink-0 w-32 h-24 border-2 ${project.color} bg-black flex flex-col justify-end p-2 snap-center relative overflow-hidden group`} onMouseEnter={tickSound}>
                         <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:200%_200%] animate-[gradient_3s_linear_infinite] z-10 pointer-events-none"></div>
                         <img src={project.img} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300" />
                         <span className="text-[9px] text-neutral-300 bg-black/60 px-1 w-max font-mono z-10">{project.type}</span>
                         <span className="text-[10px] font-bold text-white bg-black/60 px-1 font-mono truncate z-10">{project.title}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => { clickSound(); setIsVaultOpen(true); }} 
                    onMouseEnter={tickSound} 
                    className="inline-flex items-center text-sm font-black font-mono text-yellow-400 hover:text-white transition-colors mt-auto uppercase tracking-widest w-max"
                  >
                    View Design Vault <span className="ml-2">→</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-32 px-8 bg-[#0a0a0a]/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-mono text-fuchsia-400 tracking-widest uppercase mb-12 flex items-center gap-4">
              <span className="h-px bg-fuchsia-400 w-16"></span> USER_BIO.TXT
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="col-span-1 md:row-span-2 relative bg-neutral-900 border-2 border-neutral-700 min-h-[300px] shadow-[8px_8px_0px_0px_#22d3ee] p-4 flex flex-col group hover:-translate-y-2 hover:-translate-x-2 transition-transform duration-200">
                <div className="w-full h-full border-2 border-neutral-800 bg-neutral-950 flex items-center justify-center relative overflow-hidden flex-grow">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 pointer-events-none"></div>
                  <img src="/avatar.jpg" alt="Developer Avatar" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="pt-4 font-mono text-xs text-neutral-500 uppercase flex justify-between">
                  <span>LOC: ONLINE</span>
                  <span>ID: 001</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="col-span-1 md:col-span-2 bg-neutral-900 border-2 border-neutral-700 p-8 shadow-[8px_8px_0px_0px_#d946ef]">
                <h3 className="text-2xl font-black mb-6 text-white uppercase tracking-tight glitch-hover" data-text="Code. Edit. Create.">Code. Edit. Create.</h3>
                <p className="text-neutral-400 text-lg leading-relaxed mb-4">I don't just write code; I craft digital experiences. As a multidisciplinary creator, I blend the rigorous logic of <span className="text-cyan-400 font-bold">Web Development</span> and System Architecture with the visual storytelling of <span className="text-fuchsia-400 font-bold">Video Editing</span> and <span className="text-yellow-400 font-bold">Content Creation</span>.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="col-span-1 md:col-span-2 bg-neutral-900 border-2 border-neutral-700 p-8 shadow-[8px_8px_0px_0px_#eab308]">
                <h4 className="font-mono text-xs text-yellow-400 uppercase tracking-widest mb-6">SYSTEM_DIAGNOSTICS // TECH_STACK</h4>
                <div className="font-mono text-sm space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-2 hover:text-white transition-colors" onMouseEnter={tickSound}><span className="text-neutral-500">CPU [Logic & Routing]</span><span className="text-white font-bold">Next.js & React</span></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-2 hover:text-white transition-colors" onMouseEnter={tickSound}><span className="text-neutral-500">RAM [State & Styling]</span><span className="text-white font-bold">Tailwind CSS</span></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-2 hover:text-white transition-colors" onMouseEnter={tickSound}><span className="text-neutral-500">STORAGE [Database]</span><span className="text-white font-bold">Firebase Platform</span></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between hover:text-white transition-colors" onMouseEnter={tickSound}><span className="text-neutral-500">GPU [Mobile Rendering]</span><span className="text-white font-bold">Flutter & Dart Engine</span></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section id="contact" className="py-32 px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
            <div className="bg-cyan-400 p-12 md:p-20 text-center border-4 border-neutral-950 shadow-[12px_12px_0px_0px_#d946ef] relative overflow-hidden">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-neutral-950 tracking-tighter uppercase glitch-hover" data-text="START A NEW PROJECT">Start a New Project</h2>
              <p className="text-neutral-900 font-medium text-lg mb-10 max-w-xl mx-auto">Need a web developer, a video editor, or someone who can do both? Let's build something.</p>
              <a href="mailto:your.email@example.com" className="inline-flex items-center justify-center px-10 py-5 bg-neutral-950 text-cyan-400 font-black font-mono text-lg uppercase tracking-widest border-2 border-neutral-950 hover:text-fuchsia-400 transition-colors" onMouseEnter={tickSound} onClick={clickSound}>&gt; INITIALIZE_CONTACT</a>
            </div>
          </motion.div>
        </section>

        {/* COMPACT FOOTER */}
        <footer className="relative z-10 py-8 px-8 border-t-2 border-neutral-800 bg-neutral-950 text-center">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-xs font-mono uppercase">© {new Date().getFullYear()} • NEXT.JS SYSTEM</p>
            <div className="flex gap-8 text-xs font-mono font-bold text-neutral-400">
              <a href="#" className="hover:text-cyan-400 transition-colors" onMouseEnter={tickSound}>GITHUB.EXE</a>
              <a href="#" className="hover:text-fuchsia-400 transition-colors" onMouseEnter={tickSound}>LINKEDIN.EXE</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
