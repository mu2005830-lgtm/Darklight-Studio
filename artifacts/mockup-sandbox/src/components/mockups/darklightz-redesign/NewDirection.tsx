import React, { useEffect, useRef, useState } from 'react';
import './_group.css';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Play, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- UTILS & MICRO-COMPONENTS ---

const NoiseOverlay = () => (
  <div 
    className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay" 
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

const CursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-300 mix-blend-screen"
      animate={{
        background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 40%)`
      }}
    />
  );
};

const MagneticButton = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const SilverDivider = () => (
  <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
    <motion.div 
      className="absolute top-0 bottom-0 w-[200px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
      animate={{ left: ['-200%', '200%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
    />
  </div>
);


// --- SECTIONS ---

function Navbar() {
  const navLinks = ['Services', 'Work', 'Case Studies', 'Studio', 'Pricing', 'Journal'];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-24 bg-gradient-to-b from-[#030303] to-transparent backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-6 h-full w-full flex items-center justify-between">
        <a href="#" className="font-bold text-xl tracking-tight text-white flex items-center gap-3 group" style={{ fontFamily: 'Syne, sans-serif' }}>
          <div className="w-5 h-5 bg-white relative overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 60%)' }} />
            <div className="absolute inset-0 bg-neutral-500" style={{ clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)' }} />
            <div className="w-[150%] h-[1px] bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)] rotate-[-20deg] absolute group-hover:translate-x-full transition-transform duration-700 -translate-x-full" />
          </div>
          <span className="opacity-90 group-hover:opacity-100 transition-opacity">DARKLIGHTZ</span>
        </a>
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((label) => (
            <a key={label} href="#" className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-white transition-colors relative group">
              {label}
              <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <MagneticButton className="hidden md:inline-flex items-center justify-center whitespace-nowrap text-[10px] font-bold uppercase tracking-widest h-12 px-8 bg-white text-black hover:bg-neutral-200 transition-colors rounded-full">
            Book a call
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text-line", {
        y: 120,
        opacity: 0,
        rotateZ: 2,
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.1
      });
      gsap.from(".hero-sub", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        delay: 0.8,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] flex flex-col justify-center items-center text-center overflow-hidden pt-28 pb-24 px-6">
      {/* Cinematic Spotlight Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <motion.div 
          className="absolute w-[60vw] h-[60vw] rounded-full bg-white/[0.02] blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[50vh] bg-gradient-to-b from-white/[0.05] to-transparent blur-3xl opacity-50" />
      </div>
      
      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col items-center my-auto">
        <div className="mb-8 overflow-hidden">
          <div className="hero-text-line inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[9px] tracking-[0.25em] uppercase text-neutral-300 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
            Accepting Q3 Projects
          </div>
        </div>
        
        <h1 className="text-[10vw] md:text-7xl lg:text-[6.5rem] font-bold tracking-tighter leading-[0.9] mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>
          <div className="overflow-hidden pb-3"><div className="hero-text-line origin-left">CRAFTING</div></div>
          <div className="overflow-hidden pb-3"><div className="hero-text-line text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-700">INEVITABLE</div></div>
          <div className="overflow-hidden pb-3"><div className="hero-text-line">FUTURES.</div></div>
        </h1>
        
        <p className="hero-sub text-base md:text-xl text-neutral-400 max-w-2xl mb-10 font-light leading-relaxed">
          Elite digital product design & engineering. We build with quiet confidence, zero fluff, and obsessive craft.
        </p>
        
        <div className="hero-sub flex flex-col sm:flex-row gap-6 items-center">
          <MagneticButton className="relative group overflow-hidden rounded-full bg-white text-black px-10 py-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold">
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Start a Project</span>
            <div className="absolute inset-0 bg-neutral-900 transform translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          </MagneticButton>
          
          <MagneticButton className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-white hover:text-neutral-300 transition-colors">
            View Showreel 
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
              <Play className="w-3 h-3 ml-0.5 fill-current" />
            </div>
          </MagneticButton>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 text-neutral-500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-neutral-500 to-transparent relative overflow-hidden">
          <motion.div 
            className="absolute top-0 w-full h-1/2 bg-white"
            animate={{ top: ['-50%', '150%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

const Capabilities = () => {
  const containerRef = useRef<HTMLElement>(null);

  const services = [
    { id: '01', title: 'Web & Product Design', desc: 'End-to-end design systems, UI/UX, and premium storefronts built to convert. We craft digital experiences that command attention and elevate brand perception.' },
    { id: '02', title: 'Shopify & WordPress', desc: 'Custom e-commerce and CMS builds engineered for speed, scale, and clean checkout flows. Headless or native, architecture built for growth.' },
    { id: '03', title: 'Video & UGC Campaigns', desc: 'Scroll-stopping short-form content and UGC campaigns for paid and organic growth. We turn passive viewers into loyal brand advocates.' },
  ];

  return (
    <section className="py-32 md:py-48 px-6 bg-[#030303] relative z-10" ref={containerRef}>
      <SilverDivider />
      
      <div className="max-w-7xl mx-auto pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <div className="lg:col-span-5 relative">
            <div className="sticky top-40">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-[1px] bg-neutral-600" />
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-500">Expertise</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.1] mb-8 text-neutral-300" style={{ fontFamily: 'Syne, sans-serif' }}>
                SYSTEMS THAT <br/> <span className="text-white">DRIVE</span> <br/> OUTCOMES.
              </h2>
              <p className="text-neutral-500 text-lg leading-relaxed max-w-sm">
                We handle the entire product lifecycle from blank canvas to production-ready scale. No handoffs, no lost translation.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-7 flex flex-col border-t border-white/5 mt-10 lg:mt-0">
            {services.map((service) => (
              <div key={service.id} className="group relative border-b border-white/5 py-12 md:py-16 hover:pl-10 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer">
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 md:items-baseline">
                  <span className="text-xs font-bold tracking-[0.2em] text-neutral-600 group-hover:text-neutral-400 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>{service.id}</span>
                  <div className="flex-1 pr-12 md:pr-0">
                    <h3 className="text-2xl md:text-4xl font-medium tracking-tight mb-4 group-hover:text-white transition-colors text-neutral-300" style={{ fontFamily: 'Syne, sans-serif' }}>{service.title}</h3>
                    <p className="text-neutral-500 text-base leading-relaxed max-w-md group-hover:text-neutral-400 transition-colors">
                      {service.desc}
                    </p>
                  </div>
                </div>
                
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SelectedWork = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.work-card').forEach((card: any) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out"
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const projects = [
    { id: 'p1', title: 'Northline Apparel', category: 'E-commerce', role: 'Design & Development', year: '2024', imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80' },
    { id: 'p2', title: 'Verano Realty', category: 'Platform', role: 'End-to-End Build', year: '2023', imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80' },
    { id: 'p3', title: 'Kinfolk Coffee Co.', category: 'Campaign', role: 'Art Direction & Video', year: '2023', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80' },
  ];

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 bg-[#030303] relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-neutral-600" />
              <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-500">Portfolio</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>
              SELECTED<br/>
              <span className="text-neutral-600">ARCHIVE.</span>
            </h2>
          </div>
          <MagneticButton className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 hover:text-white transition-colors pb-2 border-b border-white/20 hover:border-white">
            View All Work <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </MagneticButton>
        </div>
        
        <div className="flex flex-col gap-16 md:gap-40">
          {projects.map((project) => (
            <div key={project.id} className="work-card group relative cursor-pointer block w-full">
              <div className="relative aspect-[4/3] md:aspect-[21/9] overflow-hidden rounded-[2px] bg-neutral-900 border border-white/5">
                <motion.div
                  className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/10 transition-colors duration-700 pointer-events-none"
                />
                <motion.img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-[0.2em] translate-y-12 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
                    Explore
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>{project.title}</h3>
                  <p className="text-neutral-500 text-sm">{project.role}</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">
                  <span>{project.category}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-700" />
                  <span>{project.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialProof = () => {
  return (
    <section className="py-32 md:py-48 px-6 bg-[#020202] relative overflow-hidden flex items-center justify-center border-y border-white/5">
      {/* Ambient background light */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-[80vw] bg-white/[0.015] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <div className="flex justify-center gap-2 mb-12">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-white/30 fill-white/30" />)}
        </div>
        
        <h3 className="text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.4] md:leading-[1.4] text-neutral-500 mb-16 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          "They don't just build websites. They engineer <span className="text-white">trust and authority</span> from the very first scroll. Working with Darklightz felt like an unfair advantage."
        </h3>
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-6 border border-white/10 p-1">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80" alt="Client" className="w-full h-full object-cover grayscale opacity-80" />
            </div>
          </div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white mb-2">Marcus Thorne</p>
          <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-[0.2em]">Founder, Northline Apparel</p>
        </div>
      </div>
    </section>
  );
};

const Engagement = () => {
  return (
    <section className="py-32 md:py-48 px-6 bg-[#030303] relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 md:mb-32">
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="w-8 h-[1px] bg-neutral-600" />
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-500">Partnership</span>
            <span className="w-8 h-[1px] bg-neutral-600" />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>ENGAGEMENT.</h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
            We partner with a select number of clients each quarter to ensure uncompromising quality and focused attention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="group relative p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2px] overflow-hidden hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />
            <div className="relative h-full bg-[#050505] p-10 md:p-12 flex flex-col items-start rounded-[1px] z-10">
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.25em] mb-8">Retainer</div>
              <h3 className="text-2xl md:text-4xl font-medium mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Growth Partner</h3>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-12 flex-grow">
                Ongoing design, development, and strategic execution. Acting as your elite in-house digital team without the overhead.
              </p>
              <div className="flex items-end gap-3 mb-10 border-t border-white/10 pt-8 w-full">
                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">Starting at</span>
                <span className="text-3xl text-white font-medium">$5k<span className="text-xs text-neutral-500 ml-1 font-normal">/mo</span></span>
              </div>
              <MagneticButton className="w-full py-4 border border-white/20 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-white hover:text-black transition-colors text-center">
                Inquire Status
              </MagneticButton>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative p-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[2px] overflow-hidden hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />
            <div className="relative h-full bg-[#080808] p-10 md:p-12 flex flex-col items-start rounded-[1px] z-10">
              <div className="px-4 py-1.5 bg-white text-black text-[9px] font-bold uppercase tracking-[0.25em] mb-8">Project</div>
              <h3 className="text-2xl md:text-4xl font-medium mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Dedicated Build</h3>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-12 flex-grow">
                End-to-end delivery of a specific digital product, website, or campaign. Fixed scope, defined timeline, guaranteed excellence.
              </p>
              <div className="flex items-end gap-3 mb-10 border-t border-white/10 pt-8 w-full">
                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">Starting at</span>
                <span className="text-3xl text-white font-medium">$15k<span className="text-xs text-neutral-500 ml-1 font-normal">/project</span></span>
              </div>
              <MagneticButton className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-neutral-200 transition-colors text-center">
                Start a Conversation
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FinalCTA = () => {
  return (
    <section className="py-32 md:py-48 px-6 bg-black relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <motion.div 
          className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg]"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[25deg]"
          animate={{ opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <h2 className="text-4xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-700 leading-[0.9]" style={{ fontFamily: 'Syne, sans-serif' }}>
          READY TO SHIFT <br/> THE PARADIGM?
        </h2>
        <p className="text-base md:text-xl text-neutral-400 mb-12 max-w-2xl mx-auto font-light">
          We are currently accepting new engagements. Let's discuss how we can elevate your digital presence.
        </p>
        <MagneticButton className="inline-flex h-16 px-10 md:h-20 md:px-14 bg-white text-black uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold items-center justify-center hover:bg-neutral-200 transition-colors rounded-full">
          Book Your Discovery Call
        </MagneticButton>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#020202] pt-24 md:pt-32 pb-12 px-6 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24 md:mb-32">
          <div className="max-w-sm">
            <a href="#" className="font-bold text-xl tracking-tight text-white flex items-center gap-3 mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>
              <div className="w-5 h-5 bg-white relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 60%)' }} />
                <div className="absolute inset-0 bg-neutral-600" style={{ clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)' }} />
              </div>
              DARKLIGHTZ
            </a>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed">
              An elite digital product design & engineering studio. We build software that feels inevitable.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-12 md:gap-32">
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 font-bold mb-6">Navigation</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                {['Services', 'Archive', 'Case Studies', 'Studio', 'Pricing'].map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors block">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 font-bold mb-6">Socials</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                {['Instagram', 'Twitter / X', 'LinkedIn', 'Dribbble'].map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors block">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[9px] font-bold text-neutral-600 uppercase tracking-[0.2em] gap-4">
          <p>© {new Date().getFullYear()} DARKLIGHTZ STUDIO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function NewDirection() {
  return (
    <div className="dlz-scope min-h-screen bg-[#030303] text-white selection:bg-white selection:text-black font-sans relative">
      <NoiseOverlay />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <Capabilities />
        <SelectedWork />
        <SocialProof />
        <Engagement />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default NewDirection;
