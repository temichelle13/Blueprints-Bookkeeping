import { Link } from "wouter";
import { Check, Shield, ArrowRight } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

export default function Pricing() {
  usePageTitle("Pricing");

  return (
    <div className="pt-24 pb-20">
      <section className="py-16 mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Value-Based Investment</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We reject the hourly billing model. You pay for outcomes, clarity, and executive-level expertise. All pricing is flat-fee for predictable cash flow.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-full text-sm font-medium">
            <Shield size={14} /> Includes mandatory Technology & Security Surcharge
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <div className="glass-card rounded-2xl p-8 relative flex flex-col hover:border-white/10 transition-all">
            <div className="mb-8">
              <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">ONGOING</span>
              <h2 className="text-2xl font-display font-bold text-white mt-2 mb-3">Bookkeeping</h2>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground">Starting at</span>
                <span className="text-4xl font-extrabold text-white">$500</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Tailored based on transaction volume, entity count, and niche complexity.</p>
            </div>

            <ul className="space-y-3.5 mb-8 flex-grow">
              {['Dedicated US-based expert', 'Rule-based QBO automation', 'Monthly reconciliation & close', 'Financial statement delivery', 'Proactive communication'].map((feat, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {feat}
                </li>
              ))}
            </ul>

            <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300">
              Get Custom Quote
            </Link>
          </div>

          <div className="relative rounded-2xl p-8 flex flex-col overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-accent/5" />
            <div className="absolute inset-[1px] rounded-2xl bg-card" />
            <div className="absolute inset-0 border border-accent/30 rounded-2xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <div className="px-4 py-1.5 bg-accent text-white text-xs font-bold tracking-wider rounded-b-lg shadow-lg shadow-accent/20">
                MOST REQUESTED
              </div>
            </div>

            <div className="relative mb-8 mt-4">
              <span className="text-[11px] font-mono font-medium tracking-widest text-accent">PROJECT</span>
              <h2 className="text-2xl font-display font-bold text-white mt-2 mb-3">Business Plans</h2>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">$2.5k &ndash; $5k+</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Detailed planning designed to secure capital and impress investors.</p>
            </div>

            <ul className="relative space-y-3.5 mb-8 flex-grow">
              {['3-5 Year rigorous forecasting', 'SBA formatting standards', 'Deep market research', 'Competitor analysis', 'Executive summary & narrative'].map((feat, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {feat}
                </li>
              ))}
            </ul>

            <Link href="/contact" className="relative flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300">
              Start Your Blueprint <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto border-dashed border-white/[0.08]">
          <div className="shrink-0 text-center sm:text-left">
            <span className="text-[10px] font-mono tracking-widest text-accent bg-accent/10 px-2 py-1 rounded-full">ADD-ON</span>
            <h4 className="font-bold text-white text-[15px] mt-2">The Digital Handshake</h4>
            <p className="text-sm text-muted-foreground mt-1">$1.5k – $3.5k+</p>
          </div>
          <div className="flex-grow text-sm text-muted-foreground text-center sm:text-left">
            Pair your business plan with a custom static website — an interactive, high-performance alternative to a PDF pitch. Available as an add-on to any Business Plan project.
          </div>
          <Link href="/contact" className="shrink-0 px-5 py-2.5 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 whitespace-nowrap">
            Ask About This
          </Link>
        </div>
      </section>
    </div>
  );
}
