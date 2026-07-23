import { ReactNode, useState, useEffect } from "react"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { NoiseOverlay, CursorGlow, ScrollFollowLight } from "@/components/effects"
import { useGetSiteSettings } from "@/lib/api-client"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X } from "lucide-react"

function WhatsAppButton() {
  const { data: settings } = useGetSiteSettings()
  const [showTooltip, setShowTooltip] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible] = useState(false)

  // Delay appearance so it doesn't compete with page load animations
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(t)
  }, [])

  const rawNumber = settings?.whatsappNumber || "+923350501287"
  const number = rawNumber.replace(/[^0-9]/g, "")
  const href = `https://wa.me/${number}?text=Hi%2C%20I%20found%20Darklightz%20Studio%20and%20I%27d%20like%20to%20know%20more%20about%20your%20services.`

  if (dismissed) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-2"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 bg-white text-black text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-2 rounded-[2px] shadow-xl whitespace-nowrap"
              >
                Chat with us
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            {/* Dismiss button */}
            <button
              onClick={() => setDismissed(true)}
              className="w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Dismiss WhatsApp button"
              style={{ touchAction: "manipulation" }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* WhatsApp button */}
            <motion.a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              onHoverStart={() => setShowTooltip(true)}
              onHoverEnd={() => setShowTooltip(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-14 h-14 rounded-full bg-[#25D366] shadow-[0_4px_24px_rgba(37,211,102,0.45)] flex items-center justify-center text-white"
            >
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
              <MessageCircle className="w-6 h-6 relative z-10 fill-white" />
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative transition-colors duration-350">
      <NoiseOverlay />
      <CursorGlow />
      <ScrollFollowLight />
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
