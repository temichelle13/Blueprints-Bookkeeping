import { Link } from "wouter";
import { Calculator, BookOpen, MonitorPlay, FileSignature, CheckCircle2 } from "lucide-react";

export default function Services() {
  const services = [
    {
      id: "bookkeeping",
      icon: <Calculator className="w-10 h-10 text-white" />,
      title: "Advanced Bookkeeping & Cleanup",
      desc: "For complex operations that have outgrown basic data entry.",
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
      icon: <BookOpen className="w-10 h-10 text-white" />,
      title: "Lender-Ready Business Plans",
      desc: "Bridge the gap between your current operations and future funding.",
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
      icon: <MonitorPlay className="w-10 h-10 text-white" />,
      title: "The Digital Handshake",
      desc: "Transform your business plan into a secure, interactive web presence.",
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
      icon: <FileSignature className="w-10 h-10 text-white" />,
      title: "Remote Online Notarization",
      desc: "Frictionless document execution for your high-stakes agreements.",
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
    <div className="pt-24 pb-20 bg-muted/30">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We move beyond simple data entry to provide a robust, modern financial infrastructure tailored for ambitious founders.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((svc) => (
            <div key={svc.id} className="bg-card premium-shadow rounded-2xl overflow-hidden border border-border flex flex-col h-full group">
              <div className="bg-primary p-8 flex items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10 transform scale-150 group-hover:scale-110 transition-transform duration-700">
                  {svc.icon}
                </div>
                <div className="relative z-10 p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  {svc.icon}
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-1">{svc.title}</h3>
                  <p className="text-primary-foreground/80 text-sm font-medium">{svc.desc}</p>
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col justify-between">
                <ul className="space-y-4 mb-8">
                  {svc.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/contact"
                  className="w-full text-center py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-colors"
                >
                  Inquire About This Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
