import { Link } from "wouter";
import { MonitorPlay, CheckCircle2, ArrowRight, Globe, Lock, Zap, BarChart3, Code2, Smartphone } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo-schemas";

const BASE_URL = "https://blueprintsandbookkeeping.com";

export default function DigitalHandshake() {
  const jsonLd = [
    serviceSchema({
      name: "The Digital Handshake — Business Plan as a Website",
      description: "Transform your business plan into a custom static website with interactive financials, instant loading, and password-protected access. A modern alternative to PDF pitch decks.",
      url: `${BASE_URL}/services/digital-handshake`
    }),
    breadcrumbSchema([
      { name: "Home", url: BASE_URL },
      { name: "Services", url: `${BASE_URL}/services` },
      { name: "Digital Handshake", url: `${BASE_URL}/services/digital-handshake` }
    ])
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="The Digital Handshake — Business Plan as a Website"
        description="Your business plan delivered as a custom static website. Interactive financials, instant loading, and password-protected access. The modern alternative to a PDF pitch deck."
        path="/services/digital-handshake"
        jsonLd={jsonLd}
      />

      <section className="py-16 mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Digital Handshake" }
          ]} />
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <MonitorPlay className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">ADD-ON SERVICE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">The Digital Handshake</h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Your business plan, reimagined as a sleek, branded static website. Instead of emailing a PDF, share a link that loads instantly, looks stunning, and lets reviewers interact with your financial models.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">Why a Website Instead of a PDF?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">✕</span> Traditional PDF
            </h3>
            <ul className="space-y-3">
              {[
                "Gets buried in email attachments",
                "Static charts that can't be explored",
                "Formatting breaks across devices",
                "No analytics on viewer engagement",
                "Looks like every other business plan"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground text-[14px]">
                  <span className="text-red-400/60 mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-accent/20">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">✓</span> Digital Handshake
            </h3>
            <ul className="space-y-3">
              {[
                "One click from any device — no downloads",
                "Interactive financial models and charts",
                "Perfect rendering on desktop and mobile",
                "Password-protected or invite-only access",
                "Branded, professional, and memorable"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-foreground text-[14px]">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Instant Loading",
              desc: "Static-site architecture means sub-second load times with no server maintenance or database costs."
            },
            {
              icon: <Lock className="w-5 h-5" />,
              title: "Access Control",
              desc: "Password-protected or invite-only access ensures your confidential financials stay private."
            },
            {
              icon: <Globe className="w-5 h-5" />,
              title: "Share Anywhere",
              desc: "Send a URL instead of an attachment. Works on any device, any browser, any time."
            },
            {
              icon: <BarChart3 className="w-5 h-5" />,
              title: "Interactive Models",
              desc: "Reviewers can explore your financial projections with interactive charts and drill-down capability."
            },
            {
              icon: <Code2 className="w-5 h-5" />,
              title: "No Maintenance",
              desc: "Pure static hosting means zero ongoing costs, no security patches, and no downtime."
            },
            {
              icon: <Smartphone className="w-5 h-5" />,
              title: "Mobile-First",
              desc: "Responsive design ensures your plan looks polished whether reviewed on a laptop or a phone."
            }
          ].map((item, i) => (
            <div key={i} className="glass-card-hover rounded-2xl p-6 group">
              <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 inline-block mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-[14px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-muted-foreground text-[15px] mb-6 leading-relaxed">
            The Digital Handshake is an optional enhancement available to all Business Plan clients. Once your plan is complete, we transform it into a custom-built static website using modern web technologies.
          </p>
          <ul className="space-y-3">
            {[
              "You complete your Business Plan (Startup Roadmap or SBA/Investor Package)",
              "We design a branded, single-purpose website featuring your plan content",
              "Interactive financial models are built using your approved projections",
              "The site is deployed on secure, high-performance static hosting",
              "You receive a shareable URL with optional password protection"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-xs shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-foreground text-[15px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-primary/20" />
          <div className="absolute inset-[1px] rounded-2xl bg-card" />
          <div className="relative p-8 text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Impress Investors Before the Meeting Starts</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Ask about adding the Digital Handshake to your Business Plan. Let's discuss how it can elevate your pitch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
              >
                Ask About This Add-On <ArrowRight size={16} />
              </Link>
              <Link
                href="/services/business-plans"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-accent/30 text-accent font-semibold rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
              >
                View Business Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
