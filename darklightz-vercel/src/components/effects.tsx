import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useInView, useAnimation, useScroll, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

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

/**
 * ScrollFollowLight creates a subtle light glow moving with the scroll.
 * We position it relative to the viewport based on scroll percentage.
 */
export const ScrollFollowLight = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "100vh"])
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0.3, 0.3, 0])
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 })

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 z-20 h-[300px] mix-blend-screen flex justify-center"
      style={{ top: "-150px", y: smoothY, opacity }}
    >
      <div className="w-[80vw] h-[300px] bg-white/[0.015] rounded-[100%] blur-[80px]" />
    </motion.div>
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

export const TextSliceReveal = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })
  
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ y: "100%", opacity: 0, rotateZ: 5 }}
        animate={isInView ? { y: 0, opacity: 1, rotateZ: 0 } : { y: "100%", opacity: 0, rotateZ: 5 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="origin-left"
      >
        {children}
      </motion.div>
    </div>
  )
}

export const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [reflection, setReflection] = useState({ x: 50, y: 50, opacity: 0 })
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width
    const yPct = mouseY / height
    
    // Rotate max 5 degrees
    const rotateY = (xPct - 0.5) * 10
    const rotateX = (0.5 - yPct) * 10
    
    setRotation({ x: rotateX, y: rotateY })
    setReflection({ x: xPct * 100, y: yPct * 100, opacity: 1 })
  }
  
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setReflection((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotation.x, rotateY: rotation.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={cn("relative group", className)}
    >
      <div 
        className="absolute inset-0 z-50 pointer-events-none rounded-inherit transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${reflection.x}% ${reflection.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          opacity: reflection.opacity
        }}
      />
      {children}
    </motion.div>
  )
}

export const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null
      const duration = 1500
      
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4)
        
        setDisplayValue(Math.floor(easeProgress * value))
        
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      
      window.requestAnimationFrame(step)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}
