import { ReactNode } from "react"
import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { LogOut } from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
  onLogout?: () => void
}

export function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const [location] = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-white selection:text-black">
      <header className="border-b border-white/10 bg-black sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-white" />
              DARKLIGHTZ <span className="text-neutral-500 font-normal">/ Admin</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/admin" className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                location === "/admin" ? "text-white" : "text-neutral-400"
              )}>
                Dashboard
              </Link>
              <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                View Site
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-xs text-neutral-600 font-mono uppercase tracking-widest">
              Authenticated
            </div>
            <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-xs font-medium text-white">
              DK
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Log out"
                className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
