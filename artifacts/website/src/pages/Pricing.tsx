import { useState } from "react";
import { Link } from "wouter";
import { Check, Shield, ArrowRight, HelpCircle, Calendar } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";

const bookkeepingTiers = [
  {
    name: "Essentials",
    price: "$500",
    annualPrice: "$5,400",
    annualSavings: "$600",
    period: "/mo",
    prefix: "Starting at",
    tag: "ONGOING",
    planKey: "essentials",
    description: "Clean books for a single-entity business with straightforward transactions.",
    features: [
      "Single entity",
      "Up to 200 transactions/mo",
      "Monthly reconciliation & close",
      "QuickBooks Online management",
      "Monthly P&L and balance sheet",
      "Email support",
    ],
    cta: "Get a Quote",
    subscribable: true,
    featured: false,
  },
  {
    name: "Growth",
    price: "$900",
    annualPrice: "$9,720",
    annualSavings: "$1,080",
    period: "/mo",
    prefix: "Starting at",
    tag: "MOST POPULAR",
    planKey: "growth",
    description: "For growing businesses with higher volume, multiple accounts, or niche complexity.",
    features: [
      "Up to 2 entities",
      "Up to 600 transactions/mo",
      "Rule-based QBO automation",
      "Niche reconciliation (crypto, ag, timber)",
      "Monthly financials + cash flow report",
      "Proactive advisory communication",
      "Priority response",
    ],
    cta: "Get a Quote",
    subscribable: true,
    featured: true,
  },
  {
    name: "Advanced",
    price: "Custom",
    annualPrice: "",
    annualSavings: "",
    period: "",
    prefix: "",
    tag: "ENTERPRISE",
    planKey: "advanced",
    description: "Multi-entity structures, high-volume operations, and complex consolidations.",
    features: [
      "3+ entities or complex structures",
      "Unlimited transaction volume",
      "Intercompany & consolidated reporting",
      "Historical cleanup included",
      "Full suite of financial statements",
      "Dedicated point of contact",
      "Monthly strategy check-in",
    ],
    cta: "Contact for Pricing",
    subscribable: false,
    featured: false,
  },
];

const businessPlanTiers = [
  {
    name: "Startup Roadmap",
    price: "$2,500",
    period: "",
    prefix: "Starting at",
    tag: "PROJECT",
    depositKey: "startup_roadmap",
    description: "Ideal for early-stage businesses seeking internal clarity or initial bank conversations.",
    features: [
      "3-year financial forecast",
      "Market overview & opportunity summary",
      "Basic competitor landscape",
      "Executive summary & narrative",
      "Standard formatting",
      "1 revision round",
    ],
    cta: "Start Your Blueprint",
    featured: false,
  },
  {
    name: "Full Plan Package",
    price: "$4,000",
    period: "+",
    prefix: "Starting at",
    tag: "FULL PACKAGE",
    depositKey: "sba_investor",
    description: "Comprehensive, in-depth business plan with detailed financial modeling, market research, and full strategic narrative.",
    features: [
      "5-year rigorous financial model",
      "Professional plan formatting",
      "Deep market research & analysis",
      "Full competitor positioning",
      "Burn rate & sensitivity analysis",
      "Executive summary, narrative & appendix",
      "2 revision rounds",
    ],
    cta: "Start Your Blueprint",
    featured: true,
  },
];

type BookkeepingTier = typeof bookkeepingTiers[0];
type BusinessPlanTier = typeof businessPlanTiers[0];

function SubscribeButton({ planKey, interval }: { planKey: string; interval: "monthly" | "annual" }) {
  return (
    <Link
      href="/contact"
      className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
    >
      <Calendar size={15} />
      Book a Call to Get Started
    </Link>
  );
}

function DepositButton({ serviceKey, label }: { serviceKey: string; label?: string }) {
  return (
    <Link
      href="/contact"
      className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
    >
      <Calendar size={15} />
      {label || "Book a Call to Get Started"}
    </Link>
  );
}

function BookkeepingTierCard({
  tier,
  accent = false,
  billingInterval,
}: {
  tier: BookkeepingTier;
  accent?: boolean;
  billingInterval: "monthly" | "annual";
}) {
  const showAnnual = billingInterval === "annual" && tier.annualPrice;

  if (accent) {
    return (
      <div className="relative rounded-2xl p-8 flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-accent/5" />
        <div className="absolute inset-[1px] rounded-2xl bg-card" />
        <div className="absolute inset-0 border border-accent/30 rounded-2xl" />
        {tier.tag && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <div className="px-4 py-1.5 bg-accent text-white text-xs font-bold tracking-wider rounded-b-lg shadow-lg shadow-accent/20">
              {tier.tag}
            </div>
          </div>
        )}
        <div className="relative mt-4 mb-6">
          <h3 className="text-xl font-display font-bold text-white mb-1">{tier.name}</h3>
          <div className="flex items-baseline gap-1.5 mb-3">
            {tier.prefix && <span className="text-xs text-muted-foreground">{tier.prefix}</span>}
            {showAnnual ? (
              <>
                <span className="text-3xl font-extrabold text-white">{tier.annualPrice}</span>
                <span className="text-muted-foreground text-sm">/yr</span>
                {tier.annualSavings && (
                  <span className="text-xs text-emerald-400 font-medium ml-1">Save {tier.annualSavings}</span>
                )}
              </>
            ) : (
              <>
                <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{tier.description}</p>
        </div>
        <ul className="relative space-y-3 mb-8 flex-grow">
          {tier.features.map((feat, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {feat}
            </li>
          ))}
        </ul>
        <div className="relative space-y-2">
          {tier.subscribable && (
            <SubscribeButton planKey={tier.planKey} interval={billingInterval} />
          )}
          <Link
            href="/schedule"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
          >
            {tier.cta} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8 relative flex flex-col hover:border-white/10 transition-all">
      {tier.tag && tier.tag !== "ONGOING" && tier.tag !== "PROJECT" && tier.tag !== "ENTERPRISE" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <div className="px-4 py-1.5 bg-accent text-white text-xs font-bold tracking-wider rounded-b-lg">
            {tier.tag}
          </div>
        </div>
      )}
      <div className="mb-6">
        <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">{tier.tag === "ENTERPRISE" ? "ENTERPRISE" : ""}</span>
        <h3 className="text-xl font-display font-bold text-white mt-1 mb-1">{tier.name}</h3>
        <div className="flex items-baseline gap-1.5 mb-3">
          {tier.prefix && <span className="text-xs text-muted-foreground">{tier.prefix}</span>}
          {showAnnual ? (
            <>
              <span className="text-3xl font-extrabold text-white">{tier.annualPrice}</span>
              <span className="text-muted-foreground text-sm">/yr</span>
              {tier.annualSavings && (
                <span className="text-xs text-emerald-400 font-medium ml-1">Save {tier.annualSavings}</span>
              )}
            </>
          ) : (
            <>
              <span className="text-3xl font-extrabold text-white">{tier.price}</span>
              {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{tier.description}</p>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {tier.features.map((feat, i) => (
          <li key={i} className="flex gap-3 text-sm text-foreground">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {feat}
          </li>
        ))}
      </ul>
      <div className="space-y-2">
        {tier.subscribable && (
          <SubscribeButton planKey={tier.planKey} interval={billingInterval} />
        )}
        <Link
          href="/schedule"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
        >
          {tier.cta}
        </Link>
      </div>
    </div>
  );
}

function TierCard({
  tier,
  accent = false,
}: {
  tier: BusinessPlanTier;
  accent?: boolean;
}) {
  if (accent) {
    return (
      <div className="relative rounded-2xl p-8 flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-accent/5" />
        <div className="absolute inset-[1px] rounded-2xl bg-card" />
        <div className="absolute inset-0 border border-accent/30 rounded-2xl" />
        {tier.tag && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <div className="px-4 py-1.5 bg-accent text-white text-xs font-bold tracking-wider rounded-b-lg shadow-lg shadow-accent/20">
              {tier.tag}
            </div>
          </div>
        )}
        <div className="relative mt-4 mb-6">
          <h3 className="text-xl font-display font-bold text-white mb-1">{tier.name}</h3>
          <div className="flex items-baseline gap-1.5 mb-3">
            {tier.prefix && <span className="text-xs text-muted-foreground">{tier.prefix}</span>}
            <span className="text-3xl font-extrabold text-white">{tier.price}</span>
            {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
          </div>
          <p className="text-sm text-muted-foreground">{tier.description}</p>
        </div>
        <ul className="relative space-y-3 mb-8 flex-grow">
          {tier.features.map((feat, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {feat}
            </li>
          ))}
        </ul>
        <div className="relative space-y-2">
          <DepositButton serviceKey={tier.depositKey} label="Pay Deposit & Get Started" />
          <Link
            href="/schedule"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
          >
            {tier.cta} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8 relative flex flex-col hover:border-white/10 transition-all">
      {tier.tag && tier.tag !== "ONGOING" && tier.tag !== "PROJECT" && tier.tag !== "ENTERPRISE" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <div className="px-4 py-1.5 bg-accent text-white text-xs font-bold tracking-wider rounded-b-lg">
            {tier.tag}
          </div>
        </div>
      )}
      <div className="mb-6">
        <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">{tier.tag === "FULL PACKAGE" ? "FULL PACKAGE" : ""}</span>
        <h3 className="text-xl font-display font-bold text-white mt-1 mb-1">{tier.name}</h3>
        <div className="flex items-baseline gap-1.5 mb-3">
          {tier.prefix && <span className="text-xs text-muted-foreground">{tier.prefix}</span>}
          <span className="text-3xl font-extrabold text-white">{tier.price}</span>
          {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
        </div>
        <p className="text-sm text-muted-foreground">{tier.description}</p>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {tier.features.map((feat, i) => (
          <li key={i} className="flex gap-3 text-sm text-foreground">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {feat}
          </li>
        ))}
      </ul>
      <div className="space-y-2">
        <DepositButton serviceKey={tier.depositKey} label="Pay Deposit & Get Started" />
        <Link
          href="/schedule"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
        >
          {tier.cta}
        </Link>
      </div>
    </div>
  );
}

export default function Pricing() {
  usePageTitle("Pricing");
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Bookkeeping & Business Plan Pricing"
        description="Transparent, flat-rate pricing for advanced bookkeeping and professional business plans. No hourly billing, no surprises."
        path="/pricing"
      />
      <section className="py-16 mb-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Value-Based Investment</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Flat-fee pricing for predictable cash flow. You pay for outcomes, clarity, and executive-level expertise — not hours.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 px-4 py-2 rounded-full text-sm font-medium">
            <Shield size={14} /> All plans include a mandatory Technology & Security Surcharge of $50/mo
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="accent-bar" />
            <h2 className="text-xs font-mono font-semibold tracking-widest text-accent uppercase">Bookkeeping</h2>
          </div>
          <div className="inline-flex items-center bg-surface border border-white/[0.06] rounded-lg p-1">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingInterval === "monthly"
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("annual")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billingInterval === "annual"
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual <span className="text-emerald-400 text-xs ml-1">Save 10%</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {bookkeepingTiers.map((tier) => (
            <BookkeepingTierCard key={tier.name} tier={tier} accent={tier.featured} billingInterval={billingInterval} />
          ))}
        </div>
        <div className="glass-card rounded-xl p-5 flex items-start gap-3 max-w-3xl">
          <HelpCircle className="w-4 h-4 text-accent/60 shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">How pricing is determined: </span>
            Final monthly rate is based on transaction volume, number of entities, and niche complexity (crypto, agriculture, multi-currency, etc.). All quotes are flat-fee — no surprise hourly charges. A mandatory $50/mo Technology & Security Surcharge applies to all bookkeeping tiers and covers secure cloud infrastructure, encrypted file handling, and software licensing.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="accent-bar" />
          <h2 className="text-xs font-mono font-semibold tracking-widest text-accent uppercase">Business Plans</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mb-6">
          {businessPlanTiers.map((tier) => (
            <TierCard key={tier.name} tier={tier} accent={tier.featured} />
          ))}
        </div>
        <div className="glass-card rounded-xl p-5 flex items-start gap-3 max-w-3xl">
          <HelpCircle className="w-4 h-4 text-accent/60 shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Turnaround: </span>
            Most plans are delivered within 2–4 weeks from your completed onboarding call. Rush timelines are available — ask on the discovery call.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="accent-bar" />
          <h2 className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">Add-On</h2>
        </div>
        <div className="glass-card rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 border-dashed border-white/[0.08] max-w-4xl">
          <div className="shrink-0 text-center sm:text-left">
            <span className="text-[10px] font-mono tracking-widest text-accent bg-accent/10 px-2 py-1 rounded-full">ADD-ON</span>
            <h4 className="font-bold text-white text-[15px] mt-2">The Digital Handshake</h4>
            <p className="text-sm text-muted-foreground mt-1">$1,500 – $3,500+</p>
          </div>
          <div className="flex-grow text-sm text-muted-foreground text-center sm:text-left">
            Pair your business plan with a custom static website — an interactive, high-performance alternative to a PDF pitch. Available as an add-on to any Business Plan project.
          </div>
          <Link
            href="/services/digital-handshake"
            className="shrink-0 px-5 py-2.5 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 whitespace-nowrap"
          >
            Learn More
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-10 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-3">Not sure which plan fits?</h3>
          <p className="text-muted-foreground mb-8">Book a free 30-minute discovery call. We'll talk through your situation and give you a clear recommendation — no pressure.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/schedule" className="px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300">
              Book a Free Call <ArrowRight size={15} className="inline ml-1" />
            </Link>
            <Link href="/faq" className="px-6 py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300">
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
