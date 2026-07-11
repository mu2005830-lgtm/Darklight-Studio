import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        setProgress(currentScrollY / scrollHeight)
      }
    }
    
    window.addEventListener("scroll", updateScroll, { passive: true })
    updateScroll()
    
    return () => window.removeEventListener("scroll", updateScroll)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 h-[2px] bg-white z-[100] origin-left"
      style={{ scaleX: progress }}
      initial={{ scaleX: 0 }}
      transition={{ ease: "linear", duration: 0.1 }}
    />
  )
}
