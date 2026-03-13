import { Award, GraduationCap, Shield } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="pt-24 pb-20">
      {/* HEADER */}
      <section className="bg-muted py-16 mb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Meet Your Architect</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Combining deep financial expertise, cybersecurity rigor, and strategic vision.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Col: Image & Badges */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-accent rounded-3xl translate-x-3 translate-y-3 -z-10" />
              <img 
                src={`${import.meta.env.BASE_URL}images/tea-portrait.png`}
                alt="Tea Larson-Hetrick" 
                className="w-full h-auto object-cover rounded-3xl border-4 border-white shadow-xl aspect-[4/5]"
              />
            </div>
            
            <div className="bg-card premium-shadow rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Shield className="text-accent" /> Professional Credentials
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                <li className="flex items-center gap-2"><Award size={16} className="text-primary"/> MBA, Walden University</li>
                <li className="flex items-center gap-2"><Award size={16} className="text-primary"/> BS Business Admin, St. Andrews</li>
                <li className="flex items-center gap-2"><Award size={16} className="text-primary"/> Certified Ethical Hacker (CEH v12)</li>
                <li className="flex items-center gap-2"><Award size={16} className="text-primary"/> QuickBooks ProAdvisor Advanced</li>
                <li className="flex items-center gap-2"><Award size={16} className="text-primary"/> Advanced Crypto Tax Certified</li>
                <li className="flex items-center gap-2"><Award size={16} className="text-primary"/> Oregon Notary (RON Approved)</li>
              </ul>
            </div>
          </div>

          {/* Right Col: Bio & Philosophy */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-display font-bold text-primary mb-6">Tea Larson-Hetrick</h2>
            <h3 className="text-xl text-accent font-semibold mb-8">Founder & Principal Consultant</h3>
            
            <div className="prose prose-lg text-muted-foreground max-w-none mb-10">
              <p>
                Tea brings a rare and highly specialized intersection of enterprise financial management, software engineering, and cybersecurity to Blueprints & Bookkeeping, LLC. 
              </p>
              <p>
                Having served as a Senior Financial Expert for a Fortune 500 global financial technology leader, Tea understands exactly where standard accounting breaks down for complex businesses. Generalist bookkeepers hit a "complexity ceiling," leaving multi-entity owners and tech founders with messy historical data and a lack of strategic foresight.
              </p>
              <p>
                <strong>The Firm's Philosophy:</strong> Standard accounting firms are excellent for annual compliance, but they vanish during the first-quarter tax season. Blueprints & Bookkeeping intentionally excludes in-house tax preparation. This eliminates the seasonal blind spot, ensuring we remain a proactive, dedicated operational resource 12 months a year. 
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <GraduationCap className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-bold text-foreground mb-2">Technical Depth</h4>
                <p className="text-sm text-muted-foreground">Comfortably managing "high-friction" architecture like crypto-assets, multi-location structures, and SBA-ready forecasts.</p>
              </div>
              <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20">
                <Shield className="w-8 h-8 text-accent mb-4" />
                <h4 className="font-bold text-foreground mb-2">Data Security First</h4>
                <p className="text-sm text-muted-foreground">As a CEH v12, your sensitive data is protected by enterprise-grade infrastructure. No offshore labor, ever.</p>
              </div>
            </div>

            <Link 
              href="/contact"
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              Work with Tea
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
