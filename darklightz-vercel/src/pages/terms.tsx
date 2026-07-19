import { PublicLayout } from "@/components/layout/PublicLayout"
import { motion } from "framer-motion"

export default function TermsOfService() {
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
            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-16">Last updated: July 2026</p>

            <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">1. Agreement to Terms</h2>
                <p>
                  By engaging Darklightz Studio for any service, booking a consultation, or using our website, you agree to these Terms of Service. If you do not agree, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">2. Services</h2>
                <p>Darklightz Studio provides digital services including but not limited to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Landing pages, business websites, and custom web development</li>
                  <li>Shopify and WordPress development</li>
                  <li>UI/UX design</li>
                  <li>Search Engine Optimisation (SEO)</li>
                  <li>Video editing and UGC content creation</li>
                  <li>Website maintenance and bug fixes</li>
                </ul>
                <p className="mt-4">The full scope of work for each project is agreed upon before any work begins.</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">3. Payment Terms</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A <strong className="text-foreground">30% advance payment</strong> is required before work begins.</li>
                  <li>A live demo is shared with the client before final delivery.</li>
                  <li>The remaining <strong className="text-foreground">70% is due before source code ownership is transferred</strong>.</li>
                  <li>We accept bank transfer, JazzCash, EasyPaisa, and major credit/debit cards.</li>
                  <li>Installment options are available — contact us to discuss.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">4. Revisions</h2>
                <p>
                  Each service bundle includes a defined number of revision rounds as stated in the pricing. After the included revisions are used, additional revisions will be billed at our standard hourly rate.
                  <br /><br />
                  Standard included revisions: <strong className="text-foreground">3 rounds</strong>. Additional revisions are discussed and agreed separately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">5. Delivery &amp; Timelines</h2>
                <p>
                  Timelines begin once the advance payment and all required onboarding materials (content, branding assets, etc.) are received. Delays caused by the client will result in a corresponding extension of the delivery date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">6. Post-Launch Support</h2>
                <p>
                  All service bundles include a post-launch support window (as specified in the bundle). During this period, we will fix bugs and issues directly related to our deliverables at no additional cost. Monthly maintenance is available as a separate plan.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">7. Client Inactivity</h2>
                <p>
                  If a client is unresponsive or inactive for <strong className="text-foreground">30 consecutive days</strong>, the project will be placed on hold. Resumption may require rebooking.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">8. Intellectual Property</h2>
                <p>
                  Upon receipt of final payment, the client receives full ownership of the completed deliverables. Darklightz Studio retains the right to showcase completed work in our portfolio unless a confidentiality agreement has been signed.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">9. Refund Policy</h2>
                <p>
                  Refunds are handled on a case-by-case basis. See our <a href="/refund-policy" className="text-white hover:text-muted-foreground transition-colors">Refund Policy</a> for full details.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">10. Limitation of Liability</h2>
                <p>
                  Darklightz Studio is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our maximum liability is limited to the amount paid for the specific service in question.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">11. Governing Law</h2>
                <p>
                  These Terms are governed by the laws of Pakistan. Any disputes will be resolved through mutual discussion first; failing that, through appropriate legal channels in Lahore, Punjab, Pakistan.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">12. Contact</h2>
                <p>
                  Questions about these Terms? Contact us at <a href="mailto:darklightzstudiu@gmail.com" className="text-white hover:text-muted-foreground transition-colors">darklightzstudiu@gmail.com</a>.
                </p>
              </section>

            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  )
}
