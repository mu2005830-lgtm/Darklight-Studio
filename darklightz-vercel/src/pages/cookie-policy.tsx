import { PublicLayout } from "@/components/layout/PublicLayout"
import { motion } from "framer-motion"

export default function CookiePolicy() {
  return (
    <PublicLayout>
      <div className="pt-40 pb-24 bg-background min-h-[100dvh]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-muted-foreground/70 mb-4">Legal</p>
            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground mb-16">Last updated: July 2026</p>

            <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">What Are Cookies?</h2>
                <p>
                  Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and provide a better user experience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">How We Use Cookies</h2>
                <p>
                  Darklightz Studio uses only the cookies that are strictly necessary for the website to function. We do <strong className="text-foreground">not</strong> use advertising cookies, third-party tracking cookies, or analytics cookies that profile your behaviour.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">Cookies We Use</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 pr-6 text-foreground font-bold">Cookie</th>
                        <th className="text-left py-3 pr-6 text-foreground font-bold">Purpose</th>
                        <th className="text-left py-3 text-foreground font-bold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-3 pr-6 text-foreground font-mono text-xs">sb-*</td>
                        <td className="py-3 pr-6">Supabase authentication session (Client Portal login)</td>
                        <td className="py-3">Session / 1 week</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-6 text-foreground font-mono text-xs">theme</td>
                        <td className="py-3 pr-6">Remembers your light/dark mode preference</td>
                        <td className="py-3">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">Managing Cookies</h2>
                <p>
                  You can control and delete cookies through your browser settings. Note that disabling the authentication cookie will prevent you from using the Client Portal. Your browser's help documentation will explain how to manage cookies:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Chrome: Settings → Privacy and Security → Cookies</li>
                  <li>Firefox: Options → Privacy & Security</li>
                  <li>Safari: Preferences → Privacy</li>
                  <li>Edge: Settings → Cookies and Site Permissions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">Contact</h2>
                <p>
                  Questions about our cookie usage? Contact us at <a href="mailto:darklightzstudiu@gmail.com" className="text-white hover:text-muted-foreground transition-colors">darklightzstudiu@gmail.com</a>.
                </p>
              </section>

            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  )
}
