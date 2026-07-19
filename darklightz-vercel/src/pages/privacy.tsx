import { PublicLayout } from "@/components/layout/PublicLayout"
import { motion } from "framer-motion"

export default function PrivacyPolicy() {
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
            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-16">Last updated: July 2026</p>

            <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">1. Who We Are</h2>
                <p>
                  Darklightz Studio is a digital agency based in Walton, Lahore, Punjab, Pakistan. We provide websites, branding, SEO, video editing, UGC content, and related digital services. You can reach us at <a href="mailto:darklightzstudiu@gmail.com" className="text-white hover:text-muted-foreground transition-colors">darklightzstudiu@gmail.com</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">2. What Information We Collect</h2>
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Name, email address, and phone number when you fill in our contact or booking form</li>
                  <li>Company or business name</li>
                  <li>Project details and messages you send us</li>
                  <li>Account information if you register for our Client Portal</li>
                </ul>
                <p className="mt-4">We also automatically collect basic usage data such as your IP address, browser type, and pages visited when you use our website.</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Respond to your inquiries and booking requests</li>
                  <li>Deliver and manage the services you hired us for</li>
                  <li>Send project updates, invoices, and communication through the Client Portal</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
                <p className="mt-4">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">4. Data Storage &amp; Security</h2>
                <p>
                  Your data is stored securely using Supabase (PostgreSQL) hosted on AWS infrastructure. We use industry-standard encryption in transit (HTTPS/TLS) and at rest. Access to client data is restricted to authorized team members only.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">5. Cookies</h2>
                <p>
                  Our website uses minimal cookies required for the site to function correctly. We do not use advertising or tracking cookies. See our <a href="/cookie-policy" className="text-white hover:text-muted-foreground transition-colors">Cookie Policy</a> for full details.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data (subject to legal obligations)</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="mt-4">To exercise any of these rights, email us at <a href="mailto:darklightzstudiu@gmail.com" className="text-white hover:text-muted-foreground transition-colors">darklightzstudiu@gmail.com</a>.</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">7. Third-Party Services</h2>
                <p>We use the following third-party services that may process your data:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li><strong className="text-foreground">Supabase</strong> — database and authentication</li>
                  <li><strong className="text-foreground">Vercel</strong> — website hosting</li>
                  <li><strong className="text-foreground">Resend</strong> — transactional email delivery</li>
                </ul>
                <p className="mt-4">Each of these services has its own privacy policy governing their use of your data.</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">8. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">9. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, contact us at:<br />
                  <a href="mailto:darklightzstudiu@gmail.com" className="text-white hover:text-muted-foreground transition-colors">darklightzstudiu@gmail.com</a><br />
                  Walton, Lahore, Punjab, Pakistan
                </p>
              </section>

            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  )
}
