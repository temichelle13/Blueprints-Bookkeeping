import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Quote, TrendingUp, Target, Lightbulb } from "lucide-react";
import { SEO } from "@/components/SEO";

// TODO: Replace with real client testimonials — all content below is sample/placeholder
const testimonials = [
  {
    quote: "They untangled three years of messy books across four entities in under six weeks. Our lender finally approved the expansion line we'd been chasing for over a year.",
    name: "J.M.",
    role: "AgriTech Founder",
    industry: "Agriculture & Timber",
  },
  {
    quote: "I'd been turned down by two banks before Blueprints rebuilt my financials and business plan from scratch. Funded on the next attempt — $250K SBA loan approved.",
    name: "R.K.",
    role: "Multi-Location Retail Owner",
    industry: "Retail / E-commerce",
  },
  {
    quote: "Having a dedicated bookkeeper who actually understands crypto cost-basis tracking saved me from a potential audit nightmare. Worth every penny.",
    name: "D.S.",
    role: "DeFi Protocol Founder",
    industry: "Crypto / Digital Assets",
  },
  {
    quote: "The Digital Handshake concept blew our investors away. Instead of a PDF, they got a live, interactive business plan site. It changed the conversation entirely.",
    name: "A.P.",
    role: "SaaS Startup CEO",
    industry: "Technology / SaaS",
  },
];

// TODO: Replace with real case studies — all content below is anonymized placeholder data
const caseStudies = [
  {
    title: "From Chaos to SBA Approval in 90 Days",
    client: "AgriTech Founder — Pacific Northwest",
    industry: "Agriculture & Timber",
    challenge:
      "A second-generation timber and agriculture operation had grown from a single LLC into four interrelated entities over five years. The books were a patchwork of spreadsheets, shoe-box receipts, and a neglected QuickBooks file. Two lender applications for a $400K equipment line had been declined due to unreliable financials.",
    approach:
      "We performed a full historical cleanup across all four entities, reconciled 36 months of bank and credit card statements, and built a consolidated chart of accounts in QuickBooks Online. Then we developed a lender-ready 5-year business plan with realistic revenue projections backed by historical data.",
    outcomes: [
      "36 months of financials reconciled across 4 entities",
      "$400K equipment line of credit approved on first submission",
      "Monthly close time reduced from 3 weeks to 3 days",
      "Ongoing advisory retainer for growth planning",
    ],
  },
  {
    title: "Crypto Portfolio Compliance & Tax-Ready Books",
    client: "DeFi Protocol Founder — Remote (US-based)",
    industry: "Crypto / Digital Assets",
    challenge:
      "A founder running a DeFi protocol and personal crypto portfolio had no formal bookkeeping. Over 2,000 transactions across 8 wallets and 3 exchanges were unreconciled. The founder faced a potential IRS inquiry and needed clean, defensible records before tax season.",
    approach:
      "We integrated wallet and exchange data into a unified tracking system, applied FIFO cost-basis methodology across all transactions, and reconciled the full transaction history. We then set up ongoing automated categorization rules in QBO for fiat on/off ramps and staking rewards.",
    outcomes: [
      "2,000+ transactions reconciled across 8 wallets",
      "Tax-ready P&L and balance sheet delivered 6 weeks before deadline",
      "Automated monthly categorization saving 10+ hours/month",
      "No IRS issues — clean compliance posture established",
    ],
  },
  {
    title: "Multi-Location Retail: Funded After Two Rejections",
    client: "Multi-Location Retail Owner — Southern Oregon",
    industry: "Retail / E-commerce",
    challenge:
      "A retail business with three storefronts and an e-commerce channel had been declined for an SBA loan twice. The business plan was a generic template, and financials didn't match between the plan, the books, and the tax returns. The owner was ready to give up on expansion.",
    approach:
      "We rebuilt the financial model from the ground up using actual historical performance data, created a 3-year projection with conservative, moderate, and aggressive scenarios, and packaged everything into a lender-ready business plan with a supporting Digital Handshake website for the underwriting team.",
    outcomes: [
      "$250K SBA 7(a) loan approved on next application",
      "Business plan website impressed underwriting team",
      "Revenue projections validated within 5% of actuals in Year 1",
      "Fourth storefront opened ahead of schedule",
    ],
  },
  {
    title: "SaaS Startup: Investor-Ready in 30 Days",
    client: "SaaS Startup CEO — Remote (Nationwide)",
    industry: "Technology / SaaS",
    challenge:
      "A pre-Series A SaaS company had strong MRR growth but messy books that couldn't pass investor due diligence. Deferred revenue wasn't being tracked, expenses were miscategorized, and there was no financial model for the pitch deck. A term sheet deadline was 45 days away.",
    approach:
      "We performed a rapid financial cleanup focused on SaaS metrics (MRR, churn, LTV, CAC), built a proper deferred revenue schedule, and created a detailed 5-year financial model with unit economics. The Digital Handshake presentation replaced their static pitch deck financials with a live, interactive site.",
    outcomes: [
      "Books cleaned and investor-ready in 28 days",
      "Deferred revenue properly recognized — $80K reclassified",
      "Interactive financial model site used in investor meetings",
      "Term sheet signed within the 45-day window",
    ],
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Results() {
  return (
    <div>
      <SEO
        title="Client Results"
        description="See how Blueprints & Bookkeeping helps founders transform financial complexity into growth. Anonymized case studies and testimonials from crypto, agriculture, retail, and SaaS clients."
        path="/results"
      />
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <div className="accent-bar mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Client <span className="text-gradient">Results</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real outcomes from real founders. Every engagement is confidential — names and details are anonymized to protect our clients' privacy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="flex flex-col items-center text-center mb-16">
            <div className="accent-bar mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">What Clients Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Hear directly from founders who transformed their financial operations with us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover rounded-2xl p-8 flex flex-col"
              >
                <Quote className="w-8 h-8 text-accent/30 mb-4 shrink-0" />
                <p className="text-foreground leading-relaxed text-[15px] mb-6 flex-grow italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-sm">
                    {t.name}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.role}</p>
                    <p className="text-muted-foreground text-xs">{t.industry}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="flex flex-col items-center text-center mb-16">
            <div className="accent-bar mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Case Studies</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Detailed breakdowns of how we helped founders overcome financial complexity and unlock growth.
            </p>
          </motion.div>

          <div className="space-y-12">
            {caseStudies.map((cs, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8 md:p-10"
              >
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="text-[11px] font-mono font-medium tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {cs.industry.toUpperCase()}
                  </span>
                  <span className="text-[13px] text-muted-foreground">{cs.client}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-8">
                  {cs.title}
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-accent" />
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">The Challenge</h4>
                    </div>
                    <p className="text-foreground text-[15px] leading-relaxed">{cs.challenge}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-accent" />
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Our Approach</h4>
                    </div>
                    <p className="text-foreground text-[15px] leading-relaxed">{cs.approach}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">The Outcomes</h4>
                    </div>
                    <ul className="space-y-2">
                      {cs.outcomes.map((outcome, j) => (
                        <li key={j} className="flex items-start gap-2 text-[15px]">
                          <span className="text-green-400 mt-1 shrink-0">✓</span>
                          <span className="text-foreground leading-relaxed">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-accent hover:text-white font-semibold text-sm transition-colors group"
                  >
                    Get results like these — Book a discovery call
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-accent/[0.02] to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <p className="text-sm font-mono text-accent/60 tracking-widest uppercase mb-4">
              [Replace with your real client testimonials]
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Write Your{" "}
              <span className="text-gradient">Success Story?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Join the founders who've transformed their financial infrastructure and unlocked their next stage of growth.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold text-lg rounded-xl shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Book Your Discovery Call
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}