import * as React from "react"
import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"

export function Navbar() {
  const [location] = useLocation()
  const { scrollY } = useScroll()
  
  const headerHeight = useTransform(scrollY, [0, 100], [96, 64])
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(10, 10, 10, 0)", "rgba(10, 10, 10, 0.8)"])
  const headerBorder = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"])
  const headerBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"])

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Work" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/about", label: "Studio" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Journal" }
  ]

  return (
    <motion.header
      style={{
        height: headerHeight,
        backgroundColor: headerBg,
        borderBottomColor: headerBorder,
        borderBottomWidth: 1,
        backdropFilter: headerBlur,
        WebkitBackdropFilter: headerBlur
      }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-300"
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-2">
          <div className="w-4 h-4 bg-white relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 60%)' }} />
            <div className="absolute inset-0 bg-neutral-400" style={{ clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)' }} />
            <div className="w-[150%] h-[1px] bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.8)] rotate-[-20deg]" />
          </div>
          <span>DARKLIGHTZ</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white relative",
                location.startsWith(link.href) ? "text-white" : "text-neutral-400"
              )}
            >
              {link.label}
              {location.startsWith(link.href) && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 left-0 right-0 h-[1px] bg-white"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/contact" className="hidden lg:block text-sm font-medium text-neutral-400 hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/book-a-call" className={cn(
            "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider font-display h-10 px-6 bg-white text-black hover:bg-neutral-200"
          )}>
            Book a call
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
