import { Award, Shield, Fingerprint, BrainCircuit, GraduationCap, BadgeCheck } from "lucide-react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";

export default function About() {
  usePageTitle("About Tea Larson-Hetrick");

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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-white mb-2">Tea Larson-Hetrick</h2>
          <p className="text-accent font-semibold mb-8 text-lg">Founder & Principal Consultant</p>

          <div className="space-y-5 text-foreground leading-relaxed mb-12">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-5 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-accent" /> Professional Certifications
              </h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> Certified Ethical Hacker (CEH v12)</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> QuickBooks ProAdvisor Advanced</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> Advanced Crypto Accounting Certified</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> Oregon Notary (RON Approved)</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-5 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-accent" /> Education
              </h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> MBA Coursework, Walden University</li>
                <li className="flex items-center gap-3"><Award size={15} className="text-accent shrink-0" /> Business Administration Studies, St. Andrews University</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4 italic">Plus extensive professional development and continuing education across finance, cybersecurity, and technology.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 mb-12">
            <h3 className="font-bold text-white mb-6 text-lg">Verified Digital Badges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                {
                  name: "QuickBooks ProAdvisor Gold",
                  img: "/images/proadvisor-gold-badge.png",
                  fallbackColor: "from-green-600/20 to-green-800/20"
                },
                {
                  name: "CEH v12 Certified",
                  img: "",
                  fallbackColor: "from-red-600/20 to-red-800/20"
                },
                {
                  name: "Crypto Accounting Certified",
                  img: "",
                  fallbackColor: "from-orange-600/20 to-orange-800/20"
                },
                {
                  name: "Oregon RON Notary",
                  img: "",
                  fallbackColor: "from-blue-600/20 to-blue-800/20"
                }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${badge.fallbackColor} border border-white/[0.06] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    {badge.img ? (
                      <img src={badge.img} alt={badge.name} className="w-14 h-14 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling && ((e.target as HTMLImageElement).nextElementSibling as HTMLElement).classList.remove('hidden'); }} />
                    ) : null}
                    <Shield className={`w-8 h-8 text-accent ${badge.img ? 'hidden' : ''}`} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Work with Tea
          </Link>
        </div>
      </section>
    </div>
  );
}
