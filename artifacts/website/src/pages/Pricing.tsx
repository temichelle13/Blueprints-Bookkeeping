import { Link } from "wouter";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <div className="pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">Value-Based Investment</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We reject the hourly billing model. You pay for outcomes, clarity, and executive-level expertise. All pricing is flat-fee to guarantee predictable cash flow for your business.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
          <ShieldIcon /> Includes mandatory Technology & Security Surcharge
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Monthly Retainer */}
          <div className="bg-card rounded-3xl p-8 border border-border premium-shadow relative flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-muted-foreground mb-2">Ongoing</h3>
              <h2 className="text-3xl font-display font-bold text-primary mb-2">Bookkeeping</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-medium text-muted-foreground">Starting at</span>
                <span className="text-4xl font-extrabold text-foreground">$500</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Tailored based on transaction volume, entity count, and niche complexity.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {['Dedicated US-based expert', 'Rule-based QBO automation', 'Monthly reconciliation & close', 'Financial statement delivery', 'Proactive communication'].map((feat, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <Check className="w-5 h-5 text-accent shrink-0" /> {feat}
                </li>
              ))}
            </ul>
            
            <Link href="/contact" className="w-full block text-center py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">
              Get Custom Quote
            </Link>
          </div>

          {/* Project Focus */}
          <div className="bg-primary rounded-3xl p-8 border-2 border-accent premium-shadow relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
              Most Requested
            </div>
            <div className="mb-8 mt-2">
              <h3 className="text-xl font-bold text-primary-foreground/80 mb-2">Project Base</h3>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Business Plans</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$2.5k - $5k+</span>
              </div>
              <p className="mt-4 text-sm text-primary-foreground/80">Lender and investor ready planning to secure essential capital.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {['3-5 Year rigorous forecasting', 'SBA formatting standards', 'Deep market research', 'Competitor analysis', 'Executive summary & narrative'].map((feat, i) => (
                <li key={i} className="flex gap-3 text-sm text-white">
                  <Check className="w-5 h-5 text-accent shrink-0" /> {feat}
                </li>
              ))}
            </ul>
            
            <Link href="/contact" className="w-full block text-center py-3 rounded-xl bg-accent text-white font-bold hover:bg-white hover:text-primary transition-colors shadow-lg">
              Start Your Blueprint
            </Link>
          </div>

          {/* Digital Handshake */}
          <div className="bg-card rounded-3xl p-8 border border-border premium-shadow relative flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-muted-foreground mb-2">Innovation</h3>
              <h2 className="text-3xl font-display font-bold text-primary mb-2">Static Web Design</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">$1.5k - $3.5k+</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Turn your business plan into an interactive digital handshake.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              {['Custom coded static architecture', 'Blazing fast load times', 'Zero database maintenance', 'Interactive financial displays', 'High-end professional polish'].map((feat, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground">
                  <Check className="w-5 h-5 text-accent shrink-0" /> {feat}
                </li>
              ))}
            </ul>
            
            <Link href="/contact" className="w-full block text-center py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors">
              Explore Digital Build
            </Link>
          </div>
        </div>

        {/* RON Add on */}
        <div className="mt-12 bg-muted rounded-2xl p-6 border border-border flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div>
            <h4 className="font-bold text-primary text-lg">Need Remote Notarization?</h4>
            <p className="text-sm text-muted-foreground mt-1">Available as a standalone service or integrated seamlessly into your planning project.</p>
          </div>
          <div className="text-right">
            <span className="block font-bold text-foreground mb-2">Per-session pricing available</span>
            <Link href="/contact" className="text-accent hover:underline font-medium text-sm">Contact to schedule &rarr;</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    </svg>
  );
}
