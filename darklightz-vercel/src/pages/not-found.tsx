import { PublicLayout } from "@/components/layout/PublicLayout"
import { Link } from "wouter"
import { ArrowRight } from "lucide-react"
import { MagneticLink } from "@/components/effects"

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="flex-1 flex flex-col items-center justify-center bg-[#030303] min-h-[70vh] text-center px-6">
        <h1 className="text-9xl font-display font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-700">404</h1>
        <p className="text-2xl text-neutral-400 mb-8 font-display">Path not found.</p>
        <p className="text-neutral-500 mb-12 max-w-md">
          The page you are looking for does not exist, has been moved, or is temporarily unavailable.
        </p>
        <Link href="/" data-testid="link-404-return-home">
          <MagneticLink className="inline-flex h-14 px-8 rounded-full border border-white/20 text-white font-display uppercase tracking-wider text-sm font-semibold items-center justify-center hover:bg-white hover:text-black transition-all group gap-2 cursor-pointer">
            Return to Hub <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagneticLink>
        </Link>
      </div>
    </PublicLayout>
  )
}
