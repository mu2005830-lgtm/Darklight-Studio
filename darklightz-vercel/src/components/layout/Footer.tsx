import { Link } from "wouter"
import { SilverDivider } from "@/components/effects"
import { useGetSiteSettings } from "@/lib/api-client"

export function Footer() {
  const { data: settings } = useGetSiteSettings()
  const contactEmail = settings?.contactEmail || "darklightzstudiu@gmail.com"
  const whatsappNumber = settings?.whatsappNumber || "+923350501287"
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`

  return (
    <footer className="bg-background pt-24 md:pt-32 pb-12 px-6 border-t border-border relative z-10">
      <SilverDivider />
      <div className="max-w-7xl mx-auto pt-16 md:pt-20">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24 md:mb-32">
          <div className="max-w-sm">
            <Link href="/" className="font-bold text-xl tracking-tight text-foreground flex items-center gap-3 mb-8 font-display">
              <img src="/logo.png" alt="Darklightz" className="h-8 w-8 object-contain dark:invert-0 invert" />
              DARKLIGHTZ
            </Link>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
              A passionate digital agency based in Lahore, Pakistan. We help businesses build a professional online presence through premium websites, branding, SEO, and digital solutions.
            </p>
            <div className="flex gap-4">
              {/* Instagram — live */}
              <a
                href="https://www.instagram.com/darklightzstudio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* LinkedIn — coming soon */}
              <span
                aria-label="LinkedIn (coming soon)"
                title="LinkedIn — Coming Soon"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground/30 cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.999 23.227 23.999 22.271V1.729C23.999.774 23.2 0 22.222 0h.003z" /></svg>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-12 md:gap-24">
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 font-bold mb-6">Work</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/services" className="hover:text-foreground transition-colors block">Services</Link></li>
                <li><Link href="/portfolio" className="hover:text-foreground transition-colors block">Portfolio</Link></li>
                <li><Link href="/case-studies" className="hover:text-foreground transition-colors block">Case Studies</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors block">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 font-bold mb-6">Studio</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors block">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors block">Journal</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors block">Contact</Link></li>
                <li><Link href="/submit-review" className="hover:text-foreground transition-colors block">Leave a Review</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 font-bold mb-6">Engage</h4>
              <Link href="/book-a-call" className="group flex items-center gap-3 text-foreground font-medium hover:text-muted-foreground transition-colors text-sm">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                </div>
                <span>Book a free consultation</span>
              </Link>
              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <a href={`mailto:${contactEmail}`} className="hover:text-foreground transition-colors block">{contactEmail}</a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors block">{whatsappNumber}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] gap-4">
          <p>© {new Date().getFullYear()} Darklightz Studio. All rights reserved. Lahore, Pakistan.</p>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-muted-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-muted-foreground transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-muted-foreground transition-colors">Refund Policy</Link>
            <Link href="/cookie-policy" className="hover:text-muted-foreground transition-colors">Cookie Policy</Link>
            <Link href="/admin" className="hover:text-muted-foreground transition-colors opacity-40 hover:opacity-100">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
