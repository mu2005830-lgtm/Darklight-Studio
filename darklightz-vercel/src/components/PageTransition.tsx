import { useEffect, useState, ReactNode } from "react"
import { useLocation } from "wouter"
import { AnimatePresence, motion } from "framer-motion"

export function PageTransition({ children }: { children: ReactNode }) {
  const [location] = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col w-full"
      >
        {/* The silver light sweep on enter */}
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            className="w-[200%] h-[2px] bg-white absolute top-1/2 left-1/2 shadow-[0_0_20px_5px_rgba(255,255,255,0.8)]"
            initial={{ y: "-50%", x: "-150%", rotate: -25 }}
            animate={{ x: "50%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>
        
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
