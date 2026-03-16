import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, FileText } from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Results() {
  return (
    <div>
      <SEO
        title="Client Results"
        description="Real outcomes from real founders. Blueprints & Bookkeeping helps complex businesses get clean books, funded business plans, and financial clarity."
        path="/results"
      />
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <div className="accent-bar mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Client <span className="text-gradient">Results</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real outcomes from real founders. Every engagement is confidential — names and details are anonymized to protect our clients' privacy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="glass-card rounded-2xl p-10 text-center">
            <div className="flex justify-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <MessageSquare size={28} />
              </div>
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <FileText size={28} />
              </div>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              Client testimonials and case studies coming soon
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Blueprints & Bookkeeping is a boutique practice — limited to 20 active clients. As clients reach milestones and share their stories, we'll feature their results here. Every quote and case study will be real and verified.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-accent/[0.02] to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Write Your{" "}
              <span className="text-gradient">Success Story?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Book a free 30-minute discovery call. We'll look at your books together and build a custom plan.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold text-lg rounded-xl shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Book Your Discovery Call
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
