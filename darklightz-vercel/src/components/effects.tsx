import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Shared cinematic UI primitives — "Cinematic Precision".
 * All background effects are lightweight CSS-only (no Three.js / WebGL).
 */

/* ─── PREMIUM BACKGROUND ───────────────────────────────────────────────────
 * Canvas-based floating particle field — tiny purple/violet/white dots that
 * drift slowly across the dark background, replacing the static radial glow.
 * Pauses via IntersectionObserver when off-screen so only visible instances
 * consume CPU (at most 1-2 run simultaneously on home.tsx).
 * Grain overlay + silver sweep are preserved.
 * ─────────────────────────────────────────────────────────────────────────── */
export const PremiumBackground = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId = 0
    let running = false
    let w = 0
    let h = 0

    interface Particle {
      x: number; y: number; vx: number; vy: number
      r: number; opacity: number; hue: number; glow: boolean
    }

    let particles: Particle[] = []

    function spawn() {
      const count = Math.min(90, Math.floor((w * h) / 10000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4,
        opacity: Math.random() * 0.55 + 0.12,
        hue: 250 + Math.random() * 45, // blue-violet-purple range
        glow: Math.random() < 0.2,     // 20% get a soft glow halo
      }))
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width || canvas.offsetWidth
      h = rect.height || canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      spawn()
    }

    function tick() {
      if (!running) return
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -2) p.x = w + 2
        else if (p.x > w + 2) p.x = -2
        if (p.y < -2) p.y = h + 2
        else if (p.y > h + 2) p.y = -2

        if (p.glow) {
          ctx.shadowBlur = 8
          ctx.shadowColor = `hsla(${p.hue},80%,70%,0.7)`
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},65%,78%,${p.opacity})`
        ctx.fill()

        if (p.glow) ctx.shadowBlur = 0
      }

      animId = requestAnimationFrame(tick)
    }

    function start() {
      if (running) return
      running = true
      tick()
    }

    function stop() {
      running = false
      cancelAnimationFrame(animId)
    }

    const obs = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? start() : stop() },
      { threshold: 0 }
    )
    obs.observe(canvas)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    resize()

    return () => {
      stop()
      obs.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 overflow-hidden pointer-events-none z-0", className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Silver light sweep — once every ~18s */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: "var(--sweep-opacity)", mixBlendMode: "screen" }}
      >
        <div
          className="absolute top-[25%] left-0 w-full h-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,0.9) 55%, transparent 100%)",
            animation: "silver-sweep 18s ease-in-out infinite 3s",
          }}
        />
      </div>
      {/* Animated grain overlay */}
      <div
        className="absolute inset-[-20%] w-[140%] h-[140%] mix-blend-overlay"
        style={{
          opacity: "var(--grain-opacity)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          animation: "grain-drift 8s steps(1) infinite",
        }}
      />
    </div>
  )
}

/* ─── NOISE OVERLAY (fixed, full-page) ─────────────────────────────────── */
export const NoiseOverlay = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 z-40 mix-blend-overlay"
    style={{
      opacity: "var(--grain-opacity)",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
)

/* ─── CURSOR GLOW ──────────────────────────────────────────────────────── */
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
        background: `radial-gradient(320px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.025), transparent 40%)`,
      }}
      transition={{ duration: 0 }}
    />
  )
}

/* ─── SCROLL FOLLOW LIGHT ──────────────────────────────────────────────── */
export const ScrollFollowLight = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "100vh"])
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0.25, 0.25, 0])
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 })

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 z-20 h-[250px] mix-blend-screen flex justify-center"
      style={{ top: "-125px", y: smoothY, opacity }}
    >
      <div className="w-[70vw] h-[250px] rounded-[100%] blur-[100px]"
        style={{ background: "radial-gradient(ellipse at center, var(--bg-glow-primary), transparent 70%)" }} />
    </motion.div>
  )
}

/* ─── MAGNETIC BUTTON ──────────────────────────────────────────────────── */
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

/* ─── MAGNETIC LINK ────────────────────────────────────────────────────── */
export const MagneticLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }
>(({ children, className, ...props }, forwardedRef) => {
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
})
MagneticLink.displayName = "MagneticLink"

/* ─── SILVER DIVIDER ───────────────────────────────────────────────────── */
export const SilverDivider = () => (
  <div className="h-[1px] w-full bg-border relative overflow-hidden">
    <motion.div
      className="absolute top-0 bottom-0 w-[200px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
      animate={{ left: ["-200%", "200%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
    />
  </div>
)

/* ─── EYEBROW LABEL ────────────────────────────────────────────────────── */
export const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-8">
    <span className="w-8 h-[1px] bg-muted-foreground/40" />
    <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-muted-foreground">{children}</span>
  </div>
)

/* ─── TEXT SLICE REVEAL ────────────────────────────────────────────────── */
export const TextSliceReveal = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ y: "100%", opacity: 0, rotateZ: 5, filter: "blur(8px)" }}
        animate={
          isInView
            ? { y: 0, opacity: 1, rotateZ: 0, filter: "blur(0px)" }
            : { y: "100%", opacity: 0, rotateZ: 5, filter: "blur(8px)" }
        }
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="origin-left"
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ─── BLUR REVEAL ──────────────────────────────────────────────────────── */
export const BlurReveal = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 20, filter: "blur(12px)" }
      }
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── TILT CARD ────────────────────────────────────────────────────────── */
export const TiltCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [reflection, setReflection] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / rect.width
    const yPct = mouseY / rect.height
    setRotation({ x: (0.5 - yPct) * 8, y: (xPct - 0.5) * 8 })
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
          background: `radial-gradient(circle at ${reflection.x}% ${reflection.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
          opacity: reflection.opacity,
        }}
      />
      {children}
    </motion.div>
  )
}

/* ─── ANIMATED BORDER SWEEP ────────────────────────────────────────────── */
export const AnimatedBorderSweep = () => (
  <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none border border-transparent">
    <div className="absolute inset-0 z-0">
      <motion.div
        className="absolute top-0 bottom-0 w-[200px] bg-gradient-to-r from-transparent via-foreground/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ left: "-100%" }}
        whileHover={{ left: "200%" }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
      />
    </div>
  </div>
)

/* ─── ANIMATED NUMBER ──────────────────────────────────────────────────── */
export const AnimatedNumber = ({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number
  prefix?: string
  suffix?: string
}) => {
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
        const easeProgress = 1 - Math.pow(1 - progress, 4)
        setDisplayValue(Math.floor(easeProgress * value))
        if (progress < 1) window.requestAnimationFrame(step)
      }
      window.requestAnimationFrame(step)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

/* ─── LEGACY ALIASES (kept for pages that still import them) ───────────── */
/** @deprecated Use PremiumBackground instead */
export const FloatingOrbsBackground = PremiumBackground
/** @deprecated Use PremiumBackground instead */
export const SpotlightBackground = PremiumBackground
/** @deprecated Use PremiumBackground instead */
export const MetallicTextureBackground = PremiumBackground
