import { ReactNode } from "react"
import { useLocation } from "wouter"
import { AnimatePresence, motion } from "framer-motion"

/**
 * Wraps the route tree in a clean, reliable fade + micro-lift transition.
 * AnimatePresence mode="wait" ensures exit completes before enter starts.
 * initial={false} skips the mount animation — CinematicLoader handles that.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const [location] = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "100dvh",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
