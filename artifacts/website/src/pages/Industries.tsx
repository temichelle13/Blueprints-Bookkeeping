import { Link } from "wouter";
import { TreePine, Bitcoin, ShoppingBag, Building2, Rocket } from "lucide-react";

export default function Industries() {
  const industries = [
    {
      icon: <TreePine className="w-8 h-8 text-white" />,
      title: "Agriculture & Timber",
      focus: "Local Douglas County Focus",
      desc: "Navigating Schedule F complexities, advanced equipment depreciation schedules, and multi-crew seasonal payroll structures."
    },
    {
      icon: <Bitcoin className="w-8 h-8 text-white" />,
      title: "Crypto & Digital Assets",
      focus: "Emerging Market Expertise",
      desc: "ASU 2023-08 compliance, meticulous blockchain reconciliation, and integrating DeFi transactions into clean, traditional general ledgers."
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-white" />,
      title: "Gig Economy & E-commerce",
      focus: "High-Volume Transaction Management",
      desc: "Seamless multi-platform reconciliation across Stripe, PayPal, Shopify, and Amazon to ensure accurate margin analysis."
    },
    {
      icon: <Building2 className="w-8 h-8 text-white" />,
      title: "Multi-Entity Portfolios",
      focus: "Real Estate & Holding Companies",
      desc: "Managing separate ledgers, resolving intercompany transactions, and structuring data for complex asset-heavy operators."
    },
    {
      icon: <Rocket className="w-8 h-8 text-white" />,
      title: "Tech Founders & Startups",
      focus: "Investor-Ready Financials",
      desc: "Deep burn rate analysis, operational cost tracking, and forecasting models required by venture capital and angel investors."
    }
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">Specialized Industry Expertise</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We don't do generic data entry. We solve the high-friction financial challenges specific to complex, asset-heavy, and emerging markets.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, idx) => (
            <div key={idx} className="bg-card p-8 rounded-2xl premium-shadow border border-border hover:border-primary/30 group">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                {ind.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{ind.title}</h3>
              <span className="inline-block px-3 py-1 bg-muted text-accent font-medium text-xs rounded-full mb-4">
                {ind.focus}
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {ind.desc}
              </p>
            </div>
          ))}
          
          <div className="bg-primary p-8 rounded-2xl premium-shadow flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Don't see your niche?</h3>
            <p className="text-primary-foreground/80 mb-6">
              Our technical foundation allows us to adapt to complex environments quickly.
            </p>
            <Link 
              href="/contact"
              className="px-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-accent hover:text-white transition-colors"
            >
              Let's Discuss
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
