import './_group.css';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

// ---------------------------------------------------------------------------
// This file is a faithful extraction of the LIVE Darklightz homepage
// (darklightz-vercel/src/pages/home.tsx + Navbar.tsx + Footer.tsx) so it can
// be used as the "Current" baseline for redesign comparison. Data-fetching
// hooks (useListServices, etc.), the wouter router, and the react-three-fiber
// SignatureBeam are stubbed with static equivalents; visual output otherwise
// matches production exactly.
// ---------------------------------------------------------------------------

const services = [
  { id: 's1', icon: '✦', title: 'Web & Product Design', summary: 'End-to-end design systems, UI/UX, and premium storefronts built to convert.' },
  { id: 's2', icon: '◆', title: 'Shopify & WordPress Builds', summary: 'Custom e-commerce and CMS builds engineered for speed, scale, and clean checkout flows.' },
  { id: 's3', icon: '●', title: 'Video Editing & UGC', summary: 'Scroll-stopping short-form content and UGC campaigns for paid and organic growth.' },
];

const projects = [
  { id: 'p1', title: 'Northline Apparel', summary: 'A full Shopify rebuild that lifted conversion 38% with a cinematic PDP experience.', tags: ['Shopify', 'E-commerce'], imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80' },
  { id: 'p2', title: 'Verano Realty', summary: 'A WordPress platform for a UAE real-estate group, built for lead generation at scale.', tags: ['WordPress', 'Real Estate'], imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80' },
  { id: 'p3', title: 'Kinfolk Coffee Co.', summary: 'Brand film + UGC series that drove 4.2M organic views in the first quarter.', tags: ['Video', 'UGC'], imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' },
];

function Navbar() {
  const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Work' },
    { href: '/case-studies', label: 'Case Studies' },
    { href: '/about', label: 'Studio' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Journal' },
  ];
  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center h-24">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <a href="#" className="font-bold text-xl tracking-tight text-white flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          <div className="w-4 h-4 bg-white relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 60%)' }} />
            <div className="absolute inset-0 bg-neutral-400" style={{ clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)' }} />
            <div className="w-[150%] h-[1px] bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)] rotate-[-20deg]" />
          </div>
          <span>DARKLIGHTZ</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href="#" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a href="#" className="hidden lg:block text-sm font-medium text-neutral-400 hover:text-white transition-colors">Contact</a>
          <a href="#" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium uppercase tracking-wider h-10 px-6 bg-white text-black hover:bg-neutral-200 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
            Book a call
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <a href="#" className="font-bold text-2xl tracking-tight text-white mb-6 block" style={{ fontFamily: 'Syne, sans-serif' }}>DARKLIGHTZ</a>
            <p className="text-neutral-400 text-sm max-w-xs leading-relaxed mb-6">
              Elite digital product design & engineering studio. We build software that feels inevitable.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs" style={{ fontFamily: 'Syne, sans-serif' }}>Work</h3>
            <ul className="space-y-4">
              {['Services', 'Portfolio', 'Case Studies', 'Pricing Models'].map((t) => (
                <li key={t}><a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">{t}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs" style={{ fontFamily: 'Syne, sans-serif' }}>Studio</h3>
            <ul className="space-y-4">
              {['About Us', 'Journal', 'Contact'].map((t) => (
                <li key={t}><a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">{t}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs" style={{ fontFamily: 'Syne, sans-serif' }}>Engage</h3>
            <a href="#" className="group flex items-center gap-2 text-white font-medium hover:text-neutral-300 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <span>Book a consultation</span>
            </a>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-xs">© 2026 Darklightz Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function Current() {
  return (
    <div className="dlz-scope min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-0" />
          <div className="container mx-auto px-6 relative z-10 pt-32 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 mb-8 uppercase tracking-widest text-[10px]" style={{ fontFamily: 'Syne, sans-serif' }}>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Accepting Q3 Projects
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                  Software that feels <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-600">inevitable.</span>
                </h1>
                <p className="text-lg md:text-xl text-neutral-400 max-w-lg mb-10 leading-relaxed">
                  We are an elite digital product design and engineering studio. We build with quiet confidence, zero fluff, and obsessive craft.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#" className="h-14 px-8 bg-white text-black uppercase tracking-wider text-sm font-semibold flex items-center justify-center hover:bg-neutral-200 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Start a project
                  </a>
                  <a href="#" className="h-14 px-8 border border-white/20 text-white uppercase tracking-wider text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                    View our work <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="w-full flex items-center justify-center relative overflow-hidden" style={{ height: 'clamp(360px, 48vw, 540px)' }}>
                  <div className="relative w-48 h-48" style={{ perspective: '600px' }}>
                    <div className="absolute inset-0 bg-[#1a1a1a] border border-white/5" style={{ transform: 'rotateY(20deg) rotateX(10deg)' }} />
                    <div className="absolute inset-0 w-full h-[1px] top-1/2 bg-white origin-center" style={{ transform: 'rotate(-45deg) scaleX(3)', boxShadow: '0 0 20px 8px rgba(255,255,255,0.5)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="beam-divider" />

        {/* Stats */}
        <section className="py-24 bg-[#0a0a0a]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-white/5 py-16">
              {[
                { label: 'Products Shipped', value: '140+' },
                { label: 'Design Awards', value: '24' },
                { label: 'Client Valuation', value: '$2B+' },
                { label: 'Global Reach', value: '16 Countries' },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm uppercase tracking-widest text-neutral-500" style={{ fontFamily: 'Syne, sans-serif' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-32 bg-black">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Capabilities.</h2>
                <p className="text-neutral-400 text-lg leading-relaxed">
                  We handle the entire product lifecycle from blank canvas to production-ready scale. No handoffs, no lost translation.
                </p>
              </div>
              <a href="#" className="group flex items-center gap-2 text-white font-medium uppercase tracking-wider text-sm hover:text-neutral-300 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                Explore all services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="group p-8 border border-white/10 bg-[#050505] hover:bg-[#0a0a0a] transition-colors">
                  <div className="w-12 h-12 mb-8 bg-white/5 flex items-center justify-center text-white">
                    <span className="font-bold text-xl">{service.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{service.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Work */}
        <section className="py-32 bg-[#050505]">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-16">Selected Work.</h2>
            <div className="space-y-32">
              {projects.map((project, i) => (
                <div key={project.id} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-24 items-center`}>
                  <div className="flex-1 w-full relative group">
                    <img src={project.imageUrl} alt={project.title} className="w-full aspect-[4/3] object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex gap-3 mb-6">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 border border-white/10 text-xs tracking-wider uppercase text-neutral-400" style={{ fontFamily: 'Syne, sans-serif' }}>{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-4xl font-bold mb-6">{project.title}</h3>
                    <p className="text-neutral-400 text-lg leading-relaxed mb-8 max-w-md">{project.summary}</p>
                    <a href="#" className="inline-flex items-center gap-2 border-b border-white pb-1 uppercase tracking-widest text-sm font-semibold hover:text-neutral-300 hover:border-neutral-300 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                      View Project <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-32 flex justify-center">
              <a href="#" className="h-14 px-12 border border-white/20 text-white uppercase tracking-wider text-sm font-semibold flex items-center justify-center hover:bg-white hover:text-black transition-all" style={{ fontFamily: 'Syne, sans-serif' }}>
                View All Projects
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 bg-black border-y border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute w-[200%] h-[1px] bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg]" />
          </div>
          <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-8">Ready to build?</h2>
            <p className="text-xl text-neutral-400 mb-12">
              Let's discuss how we can bring your next product to life with precision and craft.
            </p>
            <a href="#" className="inline-flex h-16 px-12 bg-white text-black uppercase tracking-widest text-sm font-bold items-center justify-center hover:scale-[1.02] transition-transform active:scale-[0.98]" style={{ fontFamily: 'Syne, sans-serif' }}>
              Schedule a Consultation
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Current;
