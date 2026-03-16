import { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useNewsletterMutation } from "@/hooks/use-newsletter";

const CHECKLIST_ITEMS = [
  "Revenue & expense tracking health check",
  "Key financial ratios banks and investors look at",
  "Common bookkeeping red flags to fix now",
  "A step-by-step financial readiness timeline",
  "Questions to ask before hiring a bookkeeper",
];

export function LeadMagnetSection() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { subscribe, isPending } = useNewsletterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const success = await subscribe({ email: email.trim(), signupSource: "lead_magnet", website: honeypot });
    if (success) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-28 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="accent-bar mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Free Download: Financial{" "}
              <span className="text-gradient">Readiness Checklist</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Is your financial house in order? Use the same checklist our team applies when
              onboarding new founder clients — distilled into a one-page actionable guide.
            </p>

            <ul className="space-y-3 mb-2">
              {CHECKLIST_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                    <ArrowRight size={11} className="text-accent" />
                  </div>
                  <span className="text-muted-foreground text-[15px]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-accent/20 via-transparent to-primary/20 blur-sm" />
              <div className="relative glass-card rounded-2xl p-8">
                {submitted ? (
                  <div className="text-center py-6">
                    <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Your Checklist Is Ready!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for subscribing. Click below to download your free Financial Readiness Checklist.
                    </p>
                    <a
                      href={`${import.meta.env.BASE_URL}downloads/financial-readiness-checklist.pdf`}
                      download
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <FileDown size={18} />
                      Download PDF
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                        <FileDown size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">Get Your Free Checklist</h3>
                        <p className="text-muted-foreground text-sm">No spam — just valuable insights.</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                        <label htmlFor="lm-website">Website</label>
                        <input id="lm-website" type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                      </div>
                      <div>
                        <label htmlFor="lead-magnet-email" className="sr-only">Email address</label>
                        <input
                          id="lead-magnet-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="w-full px-4 py-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full px-6 py-3.5 bg-accent text-white font-semibold rounded-lg shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isPending ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          <>
                            Send Me the Checklist
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
