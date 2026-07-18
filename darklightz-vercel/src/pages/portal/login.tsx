import { useState } from "react"
import { Link, useLocation } from "wouter"
import { usePortalAuth } from "@/lib/portal-auth"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PortalLogin() {
  const [, setLocation] = useLocation()
  const { signIn } = usePortalAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError("")
    const { error } = await signIn(email.trim(), password)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setLocation("/portal")
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 font-display font-bold text-lg tracking-tight text-white">
            <span className="w-2 h-2 bg-white" />
            DARKLIGHTZ
          </Link>
          <p className="mt-3 text-neutral-500 text-sm tracking-widest uppercase font-mono">
            Client Portal
          </p>
        </div>

        {/* Card */}
        <div className="border border-white/10 bg-black/60 backdrop-blur-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm tracking-tight">Sign in</h1>
              <p className="text-neutral-600 text-xs">to your client account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs border border-red-500/20 bg-red-500/10 px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-neutral-200 font-semibold tracking-wide"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs">
            <Link href="/portal/forgot-password" className="text-neutral-500 hover:text-white transition-colors">
              Forgot password?
            </Link>
            <Link href="/portal/signup" className="text-neutral-400 hover:text-white transition-colors">
              Create account →
            </Link>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-neutral-700">
          Not a client?{" "}
          <Link href="/" className="text-neutral-500 hover:text-white transition-colors">
            Visit our website
          </Link>
        </p>
      </div>
    </div>
  )
}
