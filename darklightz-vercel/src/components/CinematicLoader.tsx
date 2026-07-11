import { motion } from "framer-motion"
import { useEffect } from "react"

export function CinematicLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative w-full max-w-sm h-32 flex items-center justify-center">
        {/* The silver beam sweep */}
        <motion.div
          className="absolute left-0 w-full h-[1px] bg-white shadow-[0_0_15px_3px_rgba(255,255,255,0.8)]"
          initial={{ scaleX: 0, opacity: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* The logo reveal */}
        <motion.div
          className="text-white text-2xl tracking-[0.5em] font-display font-bold uppercase z-10 mix-blend-difference"
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
        >
          Darklightz
        </motion.div>
        
        {/* Soft glow opening */}
        <motion.div
          className="absolute inset-0 bg-white/10 blur-3xl rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        />
      </div>
    </motion.div>
  )
}
