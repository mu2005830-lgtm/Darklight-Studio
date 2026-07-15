import * as React from "react"
import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { MagneticLink } from "@/components/effects"
import { useTheme } from "@/lib/theme"

export function Navbar() {
  const [location] = useLocation()
  const { scrollY } = useScroll()
  const { theme, toggle } = useTheme()
  const isDark = theme === "dark"

  // Scroll-driven header styling
  const headerBgDark  = useTransform(scrollY, [0, 100], ["rgba(10,10,10,0)", "rgba(10,10,10,0.88)"])
  const headerBgLight = useTransform(scrollY, [0, 100], ["rgba(247,247,247,0)", "rgba(247,247,247,0.92)"])
  const headerBorder  = useTransform(scrollY, [0, 100], ["rgba(128,128,128,0)", isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"])
  const headerBlur    = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(16px)"])
  const headerHeight  = useTransform(scrollY, [0, 100], ["6rem", "4.5rem"])

  const headerBg = isDark ? headerBgDark : headerBgLight

  const navLinks = [
    { href: "/services",      label: "Services"      },
    { href: "/portfolio",     label: "Work"          },
    { href: "/case-studies",  label: "Case Studies"  },
    { href: "/about",         label: "Studio"        },
    { href: "/pricing",       label: "Pricing"       },
    { href: "/blog",          label: "Journal"       },
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
      className="fixed top-0 left-0 right-0 z-50 flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 h-full w-full flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          data-testid="link-home"
        >
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

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
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
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden xl:block text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-nav-contact"
          >
            Contact
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

          {/* Book a call CTA */}
          <Link href="/book-a-call" data-testid="link-nav-book-a-call">
            <MagneticLink className="hidden md:inline-flex items-center justify-center whitespace-nowrap text-[10px] font-bold uppercase tracking-widest h-11 px-7 bg-foreground text-background hover:opacity-85 transition-opacity rounded-full cursor-pointer">
              Book a call
            </MagneticLink>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
