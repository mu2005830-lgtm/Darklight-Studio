import { PublicLayout } from "@/components/layout/PublicLayout"
import { motion } from "framer-motion"

export default function RefundPolicy() {
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
            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-4">Refund Policy</h1>
            <p className="text-muted-foreground mb-16">Last updated: July 2026</p>

            <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">Our Approach to Refunds</h2>
                <p>
                  At Darklightz Studio, client satisfaction is our priority. We handle all refund requests on a <strong className="text-foreground">case-by-case basis</strong>, taking into account the work completed, the circumstances involved, and the terms agreed upon at the start of the project.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">General Principles</h2>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong className="text-foreground">Before work begins:</strong> If you cancel your project before we have commenced any work, your advance payment may be refunded at our discretion, minus any administrative fees.
                  </li>
                  <li>
                    <strong className="text-foreground">Work in progress:</strong> Once work has begun, refunds are evaluated based on the percentage of work completed. The advance payment covers the initial work phase and is generally non-refundable once work is underway.
                  </li>
                  <li>
                    <strong className="text-foreground">After delivery:</strong> Refunds are not issued after final delivery and approval. We include revision rounds specifically to ensure the deliverable meets your requirements before sign-off.
                  </li>
                  <li>
                    <strong className="text-foreground">Quality issues:</strong> If you believe the delivered work does not meet the agreed scope, please contact us. We will work to resolve the issue through revisions before any refund discussion.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">How to Request a Refund</h2>
                <p>
                  To request a refund, email us at <a href="mailto:darklightzstudiu@gmail.com" className="text-white hover:text-muted-foreground transition-colors">darklightzstudiu@gmail.com</a> with:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Your name and project details</li>
                  <li>The reason for your refund request</li>
                  <li>Any supporting information</li>
                </ul>
                <p className="mt-4">We will respond within 2 business days to discuss a resolution.</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">Payment Method</h2>
                <p>
                  Approved refunds will be returned using the same payment method used for the original transaction (bank transfer, JazzCash, EasyPaisa, or card), within 5–10 business days of approval.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">Contact</h2>
                <p>
                  Questions? Reach us at <a href="mailto:darklightzstudiu@gmail.com" className="text-white hover:text-muted-foreground transition-colors">darklightzstudiu@gmail.com</a> or via WhatsApp at <a href="https://wa.me/923350501287" target="_blank" rel="noopener noreferrer" className="text-white hover:text-muted-foreground transition-colors">+92 335 0501287</a>.
                </p>
              </section>

            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  )
}
