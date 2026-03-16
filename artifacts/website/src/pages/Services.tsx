import { Link } from "wouter";
import { Calculator, BookOpen, MonitorPlay, Stamp, CheckCircle2, ArrowRight } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { serviceSchema } from "@/lib/seo-schemas";


const BASE_URL = "https://blueprintsandbookkeeping.com";

export default function Services() {
  usePageTitle("Services");

  const jsonLd = [
    serviceSchema({
      name: "Advanced Bookkeeping & Cleanup",
      description: "Multi-entity structuring, historical cleanups, and rule-based QBO automation for complex businesses.",
      url: `${BASE_URL}/services`
    }),
    serviceSchema({
      name: "Business Plans & Financial Forecasting",
      description: "Comprehensive, professionally written business plans with rigorous 3-to-5-year financial modeling.",
      url: `${BASE_URL}/services`
    })
  ];

  const coreServices = [
    {
      id: "bookkeeping",
      icon: <Calculator className="w-5 h-5" />,
      title: "Advanced Bookkeeping & Cleanup",
      desc: "For complex operations that have outgrown basic data entry.",
      tag: "ONGOING",
      features: [
        "Historical data remediation and cleanup",
        "Multi-entity structuring and consolidation",
        "Rule-based QBO automation setup",
        "Rigorous monthly close procedures",
        "Specialized niche reconciliation (crypto, ag, timber)"
      ]
    },
    {
      id: "planning",
      icon: <BookOpen className="w-5 h-5" />,
      title: "Business Plans",
      desc: "A complete roadmap for where your business is going — built to professional standards.",
      tag: "PROJECT",
      features: [
        "Rigorous 3-to-5-year financial forecasting",
        "Professional plan formatting",
        "Deep market analysis & competitive positioning",
        "Burn rate analysis for startups",
        "Strategic narrative development"
      ]
    }
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Services"
        description="Advanced bookkeeping and professional business plans. Beyond simple data entry — robust financial infrastructure for ambitious founders."
        path="/services"
        jsonLd={jsonLd}
      />
      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Beyond simple data entry&mdash;robust, modern financial infrastructure tailored for ambitious founders.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {coreServices.map((svc) => (
            <div key={svc.id} className="glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full group">
              <div className="p-8 pb-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    {svc.icon}
                  </div>
                  <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">{svc.tag}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{svc.title}</h3>
                <p className="text-muted-foreground text-[15px]">{svc.desc}</p>
              </div>

              <div className="p-8 flex-grow flex flex-col justify-between">
                <ul className="space-y-3 mb-8">
                  {svc.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-foreground text-[14px]">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={svc.id === "planning" ? "/services/business-plans" : "/services/bookkeeping"}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 group/btn"
                >
                  Learn More
                  <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-8 mb-6 border border-white/[0.06]">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-white mb-2">Looking for Tax Preparation?</h3>
              <p className="text-muted-foreground text-[15px]">
                Tax preparation isn't part of our service offering — but we've built a vetted network of licensed CPAs and Enrolled Agents who specialize in it. We hand off clean, organized books so your tax season is seamless.
              </p>
            </div>
            <Link
              href="/tax-partners"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 group/btn"
            >
              View Tax Partners
              <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div id="digital" className="glass-card rounded-2xl p-8 border border-dashed border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">ADD-ON</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-white mb-2">The Digital Handshake</h3>
              <p className="text-muted-foreground text-[15px] mb-5">
                An optional enhancement for Business Plan clients — your plan delivered as a custom static website instead of a PDF. Interactive financials, instant loading, zero ongoing maintenance.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {[
                  "Business plan as a custom static website",
                  "Modern alternative to a standard PDF pitch",
                  "High-performance, secure digital hosting",
                  "Interactive financial models for reviewers",
                  "No database or server maintenance required",
                  "Password-protected or invite-only access"
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent/60 shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href="/services/digital-handshake"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 group/btn"
              >
                Learn More
                <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 mt-6 border border-white/[0.06]">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <Stamp className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">LOCAL</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-white mb-2">Notary Services</h3>
              <p className="text-muted-foreground text-[15px]">
                Professional notary services available in Roseburg, Oregon and surrounding Douglas County. Convenient scheduling for business and personal documents.
              </p>
            </div>
            <Link
              href="/services/notary"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 group/btn"
            >
              Learn More
              <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
