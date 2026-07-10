import { ReactNode } from "react"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col selection:bg-white selection:text-black">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}
