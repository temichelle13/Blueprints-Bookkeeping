import { Link } from "wouter";
import { Calculator, BookOpen, MonitorPlay, FileSignature, CheckCircle2, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
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
      title: "Lender-Ready Business Plans",
      desc: "Bridge the gap between your current operations and future funding.",
      tag: "PROJECT",
      features: [
        "Rigorous 3-to-5-year financial forecasting",
        "SBA-ready documentation formatting",
        "Deep market analysis & competitive positioning",
        "Burn rate analysis for startups",
        "Strategic narrative development"
      ]
    },
    {
      id: "digital",
      icon: <MonitorPlay className="w-5 h-5" />,
      title: "The Digital Handshake",
      desc: "Transform your business plan into a secure, interactive web presence.",
      tag: "INNOVATION",
      features: [
        "Business plans delivered as custom static websites",
        "Modern alternative to standard PDF pitches",
        "High-performance, secure digital hosting",
        "Immediate validation of professional worth",
        "No complex dynamic maintenance required"
      ]
    },
    {
      id: "notary",
      icon: <FileSignature className="w-5 h-5" />,
      title: "Remote Online Notarization",
      desc: "Frictionless document execution for your high-stakes agreements.",
      tag: "ADD-ON",
      features: [
        "Oregon-commissioned active notary",
        "Secure video conferencing with KBA protocols",
        "Instant execution for business plan docs",
        "Corporate entity formation signatures",
        "Nationwide remote service availability"
      ]
    }
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="py-16 mb-16 relative">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc) => (
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
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 group/btn"
                >
                  Inquire About This Service
                  <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
