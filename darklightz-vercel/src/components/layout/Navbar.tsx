import * as React from "react"
import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"
import { MagneticLink } from "@/components/effects"

export function Navbar() {
  const [location] = useLocation()
  const { scrollY } = useScroll()

  const headerBg = useTransform(scrollY, [0, 100], ["rgba(3, 3, 3, 0)", "rgba(3, 3, 3, 0.85)"])
  const headerBorder = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.08)"])
  const headerBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"])
  const headerHeight = useTransform(scrollY, [0, 100], ["6rem", "4.5rem"])

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Work" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/about", label: "Studio" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Journal" },
  ]

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        borderBottomColor: headerBorder,
        borderBottomWidth: 1,
        backdropFilter: headerBlur,
        WebkitBackdropFilter: headerBlur,
        height: headerHeight,
      }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-full w-full flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-xl tracking-tight text-white flex items-center gap-3 group font-display"
          data-testid="link-home"
        >
          <div className="w-5 h-5 bg-white relative overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-white" style={{ clipPath: "polygon(0 0, 100% 0, 100% 40%, 0 60%)" }} />
            <div className="absolute inset-0 bg-neutral-500" style={{ clipPath: "polygon(0 60%, 100% 40%, 100% 100%, 0 100%)" }} />
            <div className="w-[150%] h-[1px] bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)] rotate-[-20deg] absolute -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </div>
          <span className="opacity-90 group-hover:opacity-100 transition-opacity">DARKLIGHTZ</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "text-[10px] uppercase tracking-widest font-bold transition-colors relative group",
                location.startsWith(link.href) ? "text-white" : "text-neutral-400 hover:text-white"
              )}
            >
              {link.label}
              {location.startsWith(link.href) ? (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 left-0 right-0 h-[1px] bg-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              ) : (
                <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link href="/contact" className="hidden xl:block text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-white transition-colors" data-testid="link-nav-contact">
            Contact
          </Link>
          <Link href="/book-a-call" data-testid="link-nav-book-a-call">
            <MagneticLink className="hidden md:inline-flex items-center justify-center whitespace-nowrap text-[10px] font-bold uppercase tracking-widest h-12 px-8 bg-white text-black hover:bg-neutral-200 transition-colors rounded-full cursor-pointer">
              Book a call
            </MagneticLink>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
