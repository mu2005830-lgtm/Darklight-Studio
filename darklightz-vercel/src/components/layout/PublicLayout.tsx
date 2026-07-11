import { ReactNode } from "react"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { NoiseOverlay, CursorGlow, ScrollFollowLight } from "@/components/effects"

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#030303] text-white selection:bg-white selection:text-black relative">
      <NoiseOverlay />
      <CursorGlow />
      <ScrollFollowLight />
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}
