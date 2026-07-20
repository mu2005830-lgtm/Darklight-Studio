import * as React from "react"
import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Moon, Sun, Menu, X, LogIn, ChevronDown } from "lucide-react"
import { MagneticLink } from "@/components/effects"
import { useTheme } from "@/lib/theme"

// 3 primary links always visible on desktop
const primaryLinks = [
  { href: "/services",     label: "Services"     },
  { href: "/portfolio",    label: "Work"         },
  { href: "/case-studies", label: "Case Studies" },
]

// All remaining links live in the "More" dropdown on desktop
const moreLinks = [
  { href: "/about",         label: "Studio"         },
  { href: "/pricing",       label: "Pricing"        },
  { href: "/blog",          label: "Journal"        },
  { href: "/contact",       label: "Contact"        },
  { href: "/submit-review", label: "Leave a Review" },
]

// Full list for the mobile full-screen menu
const allNavLinks = [...primaryLinks, ...moreLinks]

export function Navbar() {
  const [location] = useLocation()
  const { scrollY } = useScroll()
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [moreOpen, setMoreOpen] = React.useState(false)
  const moreRef = React.useRef<HTMLDivElement>(null)

  // Close mobile menu on route change
  React.useEffect(() => { setMobileOpen(false); setMoreOpen(false) }, [location])

  // Close "More" dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    if (moreOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [moreOpen])

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  // Scroll-driven header styling
  const headerBgDark  = useTransform(scrollY, [0, 100], ["rgba(10,10,10,0)", "rgba(10,10,10,0.88)"])
  const headerBgLight = useTransform(scrollY, [0, 100], ["rgba(247,247,247,0)", "rgba(247,247,247,0.92)"])
  const headerBorder  = useTransform(scrollY, [0, 100], ["rgba(128,128,128,0)", isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"])
  const headerBlur    = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(16px)"])
  const headerHeight  = useTransform(scrollY, [0, 100], ["6rem", "4.5rem"])

  const headerBg = isDark ? headerBgDark : headerBgLight

  // Is any "More" link currently active?
  const moreIsActive = moreLinks.some(l => location.startsWith(l.href))

  return (
    <>
      {/* ── Desktop + Mobile header bar ─────────────────────────────────── */}
      <motion.header
        style={{
          backgroundColor: mobileOpen
            ? isDark ? "rgba(10,10,10,1)" : "rgba(247,247,247,1)"
            : headerBg,
          borderBottomColor: headerBorder,
          borderBottomWidth: 1,
          backdropFilter: mobileOpen ? "none" : headerBlur,
          WebkitBackdropFilter: mobileOpen ? "none" : headerBlur,
          height: headerHeight,
        }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 h-full w-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" data-testid="link-home">
            <img
              src="/logo.png"
              alt="Darklightz Studio"
              className="h-9 w-9 object-contain group-hover:scale-105 transition-transform duration-500"
              style={{ filter: isDark ? "none" : "invert(1)" }}
            />
            <span className="font-display font-bold text-xl tracking-tight text-foreground opacity-90 group-hover:opacity-100 transition-opacity hidden sm:block">
              DARKLIGHTZ
            </span>
          </Link>

          {/* Desktop nav — 3 primary links + "More" dropdown */}
          <nav className="hidden lg:flex items-center gap-10">
            {/* Primary 3 */}
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "text-[10px] uppercase tracking-widest font-bold transition-colors relative group",
                  location.startsWith(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {location.startsWith(link.href) ? (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-[1px] bg-foreground"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : (
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full group-hover:left-0" />
                )}
              </Link>
            ))}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(o => !o)}
                className={cn(
                  "flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold transition-colors relative group",
                  moreIsActive || moreOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                More
                <ChevronDown
                  className={cn("w-3 h-3 transition-transform duration-200", moreOpen && "rotate-180")}
                />
                {/* Active indicator when a "More" page is current */}
                {moreIsActive && !moreOpen && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-[1px] bg-foreground"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 rounded-[4px] overflow-hidden",
                      "border border-border shadow-2xl",
                      isDark ? "bg-[rgba(14,14,14,0.96)]" : "bg-[rgba(247,247,247,0.96)]",
                      "backdrop-blur-xl"
                    )}
                  >
                    {moreLinks.map((link, i) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        data-testid={`link-nav-more-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                        className={cn(
                          "flex items-center justify-between px-5 py-3.5 text-[10px] uppercase tracking-widest font-bold transition-colors group",
                          i !== moreLinks.length - 1 && "border-b border-border/50",
                          location.startsWith(link.href)
                            ? "text-foreground bg-muted/40"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                      >
                        {link.label}
                        {location.startsWith(link.href) && (
                          <span className="w-1 h-1 rounded-full bg-foreground" />
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Client Portal link */}
            <Link
              href="/portal/login"
              data-testid="link-nav-portal"
              className="hidden md:flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-muted-foreground rounded-full px-4 h-9"
            >
              <LogIn className="w-3 h-3" />
              Client Portal
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={cn(
                "relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
                "border border-border hover:border-muted-foreground",
                "text-muted-foreground hover:text-foreground",
                "bg-background/50 hover:bg-muted/60"
              )}
            >
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                transition={{ duration: 0.25 }}
              >
                {isDark ? <Sun className="w-[15px] h-[15px]" /> : <Moon className="w-[15px] h-[15px]" />}
              </motion.div>
            </button>

            {/* Desktop Book a Call CTA */}
            <Link href="/book-a-call" data-testid="link-nav-book-a-call">
              <MagneticLink className="hidden md:inline-flex items-center justify-center whitespace-nowrap text-[10px] font-bold uppercase tracking-widest h-11 px-7 bg-foreground text-background hover:opacity-85 transition-opacity rounded-full cursor-pointer">
                Book a call
              </MagneticLink>
            </Link>

            {/* Hamburger — visible below lg */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className={cn(
                "lg:hidden relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                "border border-border hover:border-muted-foreground",
                "text-muted-foreground hover:text-foreground",
                "bg-background/50 hover:bg-muted/60"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile full-screen menu overlay ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-40 lg:hidden flex flex-col"
            style={{
              backgroundColor: isDark ? "rgba(10,10,10,0.98)" : "rgba(247,247,247,0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Spacer for the header bar */}
            <div className="h-24" />

            {/* Nav links — all of them on mobile */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
              {allNavLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3, delay: i * 0.045, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    data-testid={`link-mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={cn(
                      "flex items-center justify-between group py-4 border-b border-border",
                      "text-2xl font-display font-bold tracking-tighter",
                      location.startsWith(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                      {link.label}
                    </span>
                    <span className="text-xs font-sans font-normal tracking-widest uppercase text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35, delay: allNavLinks.length * 0.045 + 0.05 }}
              className="px-8 pb-12 flex flex-col gap-3"
            >
              <Link href="/book-a-call" className="block">
                <span className="flex items-center justify-center w-full h-14 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:opacity-85 transition-opacity">
                  Book a Call
                </span>
              </Link>
              <Link href="/portal/login" className="block">
                <span className="flex items-center justify-center gap-2 w-full h-12 border border-border text-foreground text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:border-muted-foreground transition-colors">
                  <LogIn className="w-3.5 h-3.5" />
                  Client Portal
                </span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
