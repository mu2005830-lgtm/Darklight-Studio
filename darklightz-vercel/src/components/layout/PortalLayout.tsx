import { ReactNode } from "react"
import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { usePortalAuth } from "@/lib/portal-auth"
import { usePortalNotifications } from "@/lib/portal-api"
import {
  LayoutDashboard, MessageSquare, RefreshCw, Headphones,
  Receipt, LogOut, Bell, User, ChevronRight,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/messages", label: "Messages", icon: MessageSquare },
  { href: "/portal/revisions", label: "Revisions", icon: RefreshCw },
  { href: "/portal/support", label: "Support", icon: Headphones },
  { href: "/portal/invoices", label: "Invoices", icon: Receipt },
]

interface PortalLayoutProps {
  children: ReactNode
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const [location] = useLocation()
  const { user, signOut } = usePortalAuth()
  const { data: notifications = [] } = usePortalNotifications()

  const unreadCount = notifications.filter((n) => !n.isRead).length

  function isActive(href: string, exact?: boolean) {
    if (exact) return location === href
    return location.startsWith(href)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-white selection:text-black">
      {/* Top header */}
      <header className="border-b border-white/10 bg-black sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/portal" className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-white" />
              DARKLIGHTZ <span className="text-neutral-500 font-normal">/ Portal</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-sm transition-colors",
                    isActive(href, exact)
                      ? "bg-white/10 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <Link href="/portal" className="relative w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors rounded-sm">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-white text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-xs font-semibold text-white uppercase">
                {user?.email?.[0] ?? "C"}
              </div>
              <span className="hidden sm:block text-xs text-neutral-500 font-mono truncate max-w-[140px]">
                {user?.email}
              </span>
            </div>

            {/* Sign out */}
            <button
              onClick={signOut}
              title="Sign out"
              className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 transition-colors rounded-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="md:hidden flex items-center gap-1 px-4 py-2 border-b border-white/10 bg-black overflow-x-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-sm transition-colors shrink-0",
              isActive(href, exact)
                ? "bg-white/10 text-white"
                : "text-neutral-400 hover:text-white"
            )}
          >
            <Icon className="w-3 h-3" />
            {label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-white/10 py-6">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <span className="text-xs text-neutral-600 font-mono uppercase tracking-widest">
            Darklightz Studio — Client Portal
          </span>
          <Link href="/" className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
            View site <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </footer>
    </div>
  )
}
