import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

/**
 * Shared cinematic UI primitives used across the Darklightz redesign
 * ("Cinematic Precision"): a spotlight cutting through the void, revealing
 * only what matters. Keep these consistent across every page.
 */

export const NoiseOverlay = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-40 opacity-[0.03] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
)

export const CursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", updateMousePosition)
    return () => window.removeEventListener("mousemove", updateMousePosition)
  }, [])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 hidden md:block mix-blend-screen"
      animate={{
        background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 40%)`,
      }}
      transition={{ duration: 0 }}
    />
  )
}

interface MagneticProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticProps>(
  ({ children, className, onClick, ...props }, forwardedRef) => {
    const innerRef = useRef<HTMLButtonElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
      const node = innerRef.current
      if (!node) return
      const { clientX, clientY } = e
      const { height, width, left, top } = node.getBoundingClientRect()
      const middleX = clientX - (left + width / 2)
      const middleY = clientY - (top + height / 2)
      setPosition({ x: middleX * 0.25, y: middleY * 0.25 })
    }

    const reset = () => setPosition({ x: 0, y: 0 })

    return (
      <motion.button
        ref={(node) => {
          ;(innerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
          if (typeof forwardedRef === "function") forwardedRef(node)
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        className={className}
        onClick={onClick}
        {...(props as any)}
      >
        {children}
      </motion.button>
    )
  }
)
MagneticButton.displayName = "MagneticButton"

/**
 * Same magnetic-hover behavior, but renders an <a>/wouter <Link>-compatible
 * element so it can be used for navigation without nesting a <button>.
 */
export const MagneticLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }>(
  ({ children, className, ...props }, forwardedRef) => {
    const innerRef = useRef<HTMLAnchorElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
      const node = innerRef.current
      if (!node) return
      const { clientX, clientY } = e
      const { height, width, left, top } = node.getBoundingClientRect()
      const middleX = clientX - (left + width / 2)
      const middleY = clientY - (top + height / 2)
      setPosition({ x: middleX * 0.2, y: middleY * 0.2 })
    }

    const reset = () => setPosition({ x: 0, y: 0 })

    return (
      <motion.a
        ref={(node) => {
          ;(innerRef as React.MutableRefObject<HTMLAnchorElement | null>).current = node
          if (typeof forwardedRef === "function") forwardedRef(node)
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLAnchorElement | null>).current = node
        }}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        className={className}
        {...(props as any)}
      >
        {children}
      </motion.a>
    )
  }
)
MagneticLink.displayName = "MagneticLink"

export const SilverDivider = () => (
  <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
    <motion.div
      className="absolute top-0 bottom-0 w-[200px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
      animate={{ left: ["-200%", "200%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
    />
  </div>
)

/** Small uppercase eyebrow label used above section headings sitewide. */
export const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-8">
    <span className="w-8 h-[1px] bg-neutral-600" />
    <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-500">{children}</span>
  </div>
)
