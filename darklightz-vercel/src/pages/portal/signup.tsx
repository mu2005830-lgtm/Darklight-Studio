import { useState } from "react"
import { Link, useLocation } from "wouter"
import { usePortalAuth } from "@/lib/portal-auth"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PortalSignup() {
  const [, setLocation] = useLocation()
  const { signUp } = usePortalAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !password) return
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    setLoading(true)
    setError("")
    const { error } = await signUp(email.trim(), password, name.trim())
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="border border-white/10 bg-black/60 backdrop-blur-sm p-8">
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">✓</span>
            </div>
            <h2 className="text-white font-semibold mb-2">Check your email</h2>
            <p className="text-neutral-400 text-sm">
              We sent a verification link to <strong className="text-white">{email}</strong>.
              Click the link to activate your account.
            </p>
            <Link href="/portal/login" className="inline-block mt-6 text-sm text-neutral-400 hover:text-white transition-colors">
              Back to sign in →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 font-display font-bold text-lg tracking-tight text-white">
            <span className="w-2 h-2 bg-white" />
            DARKLIGHTZ
          </Link>
          <p className="mt-3 text-neutral-500 text-sm tracking-widest uppercase font-mono">
            Client Portal
          </p>
        </div>

        <div className="border border-white/10 bg-black/60 backdrop-blur-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm tracking-tight">Create account</h1>
              <p className="text-neutral-600 text-xs">access your client portal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Full Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30"
              />
            </div>

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
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
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
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-neutral-600">
            Already have an account?{" "}
            <Link href="/portal/login" className="text-neutral-400 hover:text-white transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
