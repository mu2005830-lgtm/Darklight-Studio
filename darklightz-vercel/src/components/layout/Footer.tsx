import { Link } from "wouter"
import { SilverDivider } from "@/components/effects"

export function Footer() {
  return (
    <footer className="bg-[#020202] pt-24 md:pt-32 pb-12 px-6 border-t border-white/5 relative z-10">
      <SilverDivider />
      <div className="max-w-7xl mx-auto pt-16 md:pt-20">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24 md:mb-32">
          <div className="max-w-sm">
            <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-3 mb-8 font-display">
              <div className="w-5 h-5 bg-white relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-white" style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 60%)" }} />
                <div className="absolute inset-0 bg-neutral-600" style={{ clipPath: "polygon(0 60%, 100% 40%, 100% 100%, 0 100%)" }} />
              </div>
              DARKLIGHTZ
            </Link>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-8">
              An elite digital product design & engineering studio. We build software that feels inevitable.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.04H5.078z" /></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
              <a href="#" aria-label="Dribbble" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm8.483-8.868c-.14-3.14-2.115-5.918-5.234-7.221-1.077-.449-2.22-.68-3.385-.68-1.57 0-3.08.384-4.42 1.114.93-.16 1.884-.24 2.844-.24 3.036 0 5.86 1.127 7.973 3.175.76.736 1.417 1.576 1.954 2.498l.268.46V15.132zm-2.016 4.743c-.887.893-1.928 1.62-3.072 2.148-1.396.643-2.92.977-4.475.977-1.896 0-3.714-.52-5.253-1.503.74-.296 1.505-.536 2.29-.714 3.09-.705 6.27-.478 9.215.656l1.295.496v-2.06zm-10.988-8.82c-.884.9-1.597 1.936-2.106 3.064-.644 1.424-.98 2.97-.98 4.542 0 .546.046 1.09.136 1.625l.23-1.077c.456-2.158 1.4-4.14 2.748-5.78 1.05-1.282 2.302-2.38 3.7-3.23l.186-.113-1.12.19c-.96.16-1.905.412-2.795.78zm5.127 1.834c-1.365.413-2.66.993-3.86 1.725-.636.388-1.25.814-1.838 1.272.766 1.344 1.787 2.518 3.01 3.46 1.25.96 2.705 1.636 4.267 1.98.53-.984.945-2.023 1.238-3.096.384-1.413.567-2.875.54-4.34-.34-.14-.688-.27-1.04-.388-1.066-.358-2.17-.557-3.284-.582z" /></svg>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-12 md:gap-24">
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 font-bold mb-6">Work</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li><Link href="/services" className="hover:text-white transition-colors block">Services</Link></li>
                <li><Link href="/portfolio" className="hover:text-white transition-colors block">Portfolio</Link></li>
                <li><Link href="/case-studies" className="hover:text-white transition-colors block">Case Studies</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors block">Pricing Models</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 font-bold mb-6">Studio</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li><Link href="/about" className="hover:text-white transition-colors block">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors block">Journal</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors block">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.25em] text-neutral-600 font-bold mb-6">Engage</h4>
              <Link href="/book-a-call" className="group flex items-center gap-3 text-white font-medium hover:text-neutral-300 transition-colors text-sm">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                </div>
                <span>Book a consultation</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[9px] font-bold text-neutral-600 uppercase tracking-[0.2em] gap-4">
          <p>© {new Date().getFullYear()} Darklightz Studio. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
            <Link href="/admin" className="hover:text-neutral-300 transition-colors opacity-40 hover:opacity-100">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
