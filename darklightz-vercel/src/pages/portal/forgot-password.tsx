import { useState } from "react"
import { Link } from "wouter"
import { usePortalAuth } from "@/lib/portal-auth"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PortalForgotPassword() {
  const { resetPassword } = usePortalAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError("")
    const { error } = await resetPassword(email.trim())
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setSent(true)
    }
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
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm tracking-tight">Reset password</h1>
              <p className="text-neutral-600 text-xs">we'll send you a reset link</p>
            </div>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <p className="text-white text-sm mb-1">Check your email</p>
              <p className="text-neutral-400 text-xs mb-6">
                A reset link was sent to <strong className="text-white">{email}</strong>.
              </p>
              <Link href="/portal/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Back to sign in →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30"
                />
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
                {loading ? "Sending…" : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Link href="/portal/login" className="text-xs text-neutral-500 hover:text-white transition-colors">
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
