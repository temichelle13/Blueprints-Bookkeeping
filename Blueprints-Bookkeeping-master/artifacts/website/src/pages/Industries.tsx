import { Link } from "wouter";
import {
  TreePine,
  Bitcoin,
  ShoppingBag,
  Building2,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { serviceSchema } from "@/lib/seo-schemas";

const BASE_URL = "https://blueprintsandbookkeeping.com";

export default function Industries() {
  usePageTitle("Industries We Serve");

  const jsonLd = [
    serviceSchema({
      name: "Agriculture & Timber Bookkeeping",
      description:
        "Schedule F complexities, equipment depreciation, and multi-crew seasonal payroll for Douglas County operations.",
      url: `${BASE_URL}/industries`,
    }),
    serviceSchema({
      name: "Crypto & Digital Asset Bookkeeping",
      description:
        "ASU 2023-08 compliance, blockchain reconciliation, and DeFi transaction integration.",
      url: `${BASE_URL}/industries`,
    }),
  ];

  const industries = [
    {
      icon: <TreePine className="w-5 h-5" />,
      title: "Agriculture & Timber",
      focus: "Douglas County Focus",
      desc: "Navigating Schedule F complexities, advanced equipment depreciation schedules, and multi-crew seasonal payroll structures.",
    },
    {
      icon: <Bitcoin className="w-5 h-5" />,
      title: "Crypto & Digital Assets",
      focus: "Emerging Markets",
      desc: "ASU 2023-08 compliance, blockchain reconciliation, and integrating DeFi transactions into clean, traditional general ledgers.",
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      title: "Gig Economy & E-commerce",
      focus: "High Volume",
      desc: "Multi-platform reconciliation across Stripe, PayPal, Shopify, and Amazon for accurate margin analysis.",
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "Multi-Entity Portfolios",
      focus: "Real Estate & Holdings",
      desc: "Managing separate ledgers, resolving intercompany transactions, and structuring data for complex asset-heavy operators.",
    },
    {
      icon: <Rocket className="w-5 h-5" />,
      title: "Tech Founders & Startups",
      focus: "High-Growth",
      desc: "Deep burn rate analysis, operational cost tracking, and forecasting models for complex, high-growth businesses.",
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Industries We Serve"
        description="Specialized bookkeeping for agriculture, timber, crypto, e-commerce, multi-entity portfolios, and tech startups. We solve high-friction financial challenges in complex, asset-heavy markets."
        path="/industries"
        jsonLd={jsonLd}
      />
      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Industry Expertise
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We solve the high-friction financial challenges specific to complex,
            asset-heavy, and emerging markets.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, idx) => (
            <div key={idx} className="glass-card-hover rounded-2xl p-8 group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  {ind.icon}
                </div>
                <span className="text-[11px] font-mono font-medium tracking-widest text-accent/70">
                  {ind.focus.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{ind.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {ind.desc}
              </p>
            </div>
          ))}

          <div className="relative rounded-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-primary/20" />
            <div className="absolute inset-[1px] rounded-2xl bg-card" />
            <div className="absolute inset-0 border border-accent/20 rounded-2xl" />
            <div className="relative">
              <h3 className="text-xl font-bold text-white mb-3">
                Don't see your niche?
              </h3>
              <p className="text-muted-foreground mb-6 text-[15px]">
                Our technical foundation adapts to complex environments quickly.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 text-sm"
              >
                Let's Discuss <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
