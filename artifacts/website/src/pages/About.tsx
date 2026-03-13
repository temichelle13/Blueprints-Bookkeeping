import { Award, Shield, Fingerprint, BrainCircuit } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <section className="py-16 mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Meet Your Architect</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Where enterprise financial expertise meets cybersecurity rigor.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-accent/30 to-primary/20 rounded-3xl blur-sm group-hover:blur-md transition-all" />
              <img
                src={`${import.meta.env.BASE_URL}images/tea-portrait.png`}
                alt="Tea Larson-Hetrick"
                className="relative w-full h-auto object-cover rounded-3xl border border-white/10 aspect-[4/5]"
              />
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" /> Credentials
              </h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> MBA, Walden University</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> BS Business Admin, St. Andrews</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> Certified Ethical Hacker (CEH v12)</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> QuickBooks ProAdvisor Advanced</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> Advanced Crypto Tax Certified</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> Oregon Notary (RON Approved)</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="text-3xl font-display font-bold text-white mb-2">Tea Larson-Hetrick</h2>
            <p className="text-accent font-semibold mb-8 text-lg">Founder & Principal Consultant</p>

            <div className="space-y-5 text-foreground leading-relaxed mb-10">
              <p>
                Tea brings a rare intersection of enterprise financial management, software engineering, and cybersecurity to Blueprints & Bookkeeping, LLC.
              </p>
              <p>
                Having served as a Senior Financial Expert for a Fortune 500 global financial technology leader, Tea understands exactly where standard accounting breaks down for complex businesses. Generalist bookkeepers hit a "complexity ceiling," leaving multi-entity owners and tech founders with messy historical data and a lack of strategic foresight.
              </p>
              <p className="text-muted-foreground border-l-2 border-accent/30 pl-4 italic">
                Standard accounting firms are excellent for annual compliance, but they vanish during the first-quarter tax season. Blueprints & Bookkeeping intentionally excludes in-house tax preparation&mdash;eliminating the seasonal blind spot to remain a proactive, dedicated operational resource 12 months a year.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="glass-card rounded-xl p-6 group hover:border-accent/20 transition-all">
                <BrainCircuit className="w-7 h-7 text-accent mb-4" />
                <h4 className="font-bold text-white mb-2 text-[15px]">Technical Depth</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Comfortably managing crypto-assets, multi-location structures, and SBA-ready forecasts.</p>
              </div>
              <div className="glass-card rounded-xl p-6 group hover:border-accent/20 transition-all">
                <Fingerprint className="w-7 h-7 text-accent mb-4" />
                <h4 className="font-bold text-white mb-2 text-[15px]">Data Security First</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">As a CEH v12, your sensitive data is protected by enterprise-grade security. No offshore labor, ever.</p>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Work with Tea
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
