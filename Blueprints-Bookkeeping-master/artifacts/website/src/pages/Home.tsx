import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ShieldCheck,
  Clock,
  Users,
  Sparkles,
} from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  StatsProofBar,
  CredentialBadgeStrip,
  GoogleReviewsCallout,
  HeroCtaTrustNote,
  EngagementClarityPreview,
  FinalCtaTrustNote,
} from "@/components/TrustSignals";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SEO } from "@/components/SEO";
import { trackHomeCtaClick } from "@/hooks/usePageTracking";
import { localBusinessSchema } from "@/lib/seo-schemas";

export default function Home() {
  usePageTitle();
  const primaryCtaLabel = "Book a Meeting";
  const secondaryCtaLabel = "View Services";

  return (
    <div>
      <SEO
        title="Roseburg, Oregon Bookkeeping, Cleanup, Monthly Close & Business Plans"
        description="Decision-stage bookkeeping support for founders: cleanup and catch-up bookkeeping, monthly close management, and professionally written business plans. Based in Roseburg, Oregon and serving clients nationwide."
        path="/"
        ogImage="https://blueprintsandbookkeeping.com/opengraph.jpg"
        jsonLd={localBusinessSchema()}
      />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Blueprints & Bookkeeping — professional bookkeeping and business plan services for founders"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-30"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-accent/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm mb-8"
          >
            <span className="glow-dot" />
            <span className="text-sm font-medium text-accent">
              Based in Roseburg, Oregon &mdash; Serving Clients Nationwide
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight max-w-4xl mb-6 leading-[1.05]"
          >
            Your Blueprint to{" "}
            <span className="text-gradient">Business Success</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
          >
            Bookkeeping and business planning that actually makes sense. Learn your numbers, find your direction, and grow your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/schedule"
              onClick={() => trackHomeCtaClick("primary", "hero")}
              className="group px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {primaryCtaLabel}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/services"
              onClick={() => trackHomeCtaClick("secondary", "hero")}
              className="px-8 py-4 rounded-xl bg-white/[0.04] text-white backdrop-blur-sm border border-white/10 font-semibold text-lg hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex items-center justify-center"
            >
              {secondaryCtaLabel}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 w-full max-w-3xl rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-sm p-4 sm:p-5 text-left"
          >
            <p className="text-sm text-foreground">
              <span className="font-semibold text-white">
                Data Protection &amp; Professional Boundaries:
              </span>{" "}
              U.S.-based with no offshoring. 
              Backed by certifications in Cybersecurity, Ethical Hacking, and Networking.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Services offered are not tax or legal advice.
              Seamless tax preparation is also available through our list of vetted tax professionals we partner with.
              We take time in ensuring all our partners are U.S.-based credentialed tax experts. 
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm">
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground" aria-hidden="true">•</span>
              <Link href="/terms" className="text-accent hover:underline">
                Terms of Service
              </Link>
            </div>
          </motion.div>
          <HeroCtaTrustNote />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      <StatsProofBar />

      <CredentialBadgeStrip compact />

      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="accent-bar mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
             Build Your Business Blueprint
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              You have to know where you are and where you've been to know where you can go. Understand your business past, clean up your present, and build the blueprint to meet your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Calculator className="w-6 h-6" />,
                title: "Advanced Bookkeeping",
                description:
                  "Ongoing services provided via QuickBooks Online and tailored to fit each business perfectly.",
                tag: "ONGOING, ONE-TIME, YEARLY, QUARTERLY",
                features: [
                  "Multi-entity consolidation",
                  "Historical cleanup & reconciliation",
                  "Monthly close & financial statements",
                  "A/R & A/P",
                  "Assets & Depreciation",
                  "Payroll",
                  "Information Filings (1099s, W2, etc)",
                  "Training & Troubleshooting",
                  "Management Meetings & Business Review on a Scheduled Basis",
                ],
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Business Plans",
                description:
                  "Professional, modern business plans for any scenario and all businesses. Whether you're looking to gain funding, target new markets, or launch a business, we can build your blueprints and help you map your business success.",
                tag: "PROJECT, ONE-TIME, EMERGENCY",
                features: [
                  "3-to-5 year forecasting",
                  "Target Market Analysis",
                  "Strategy & Roadmaps",
                  "Risk & Mitigation Analysis",
                  "Business Plan Summary Website Design with Shareable Link",
                  "Market research & competitive analysis",
                  "Full PDF Business Plans Ready for Binding",
                  "Custom Documentation & Research Reports Based on Your Needs",
                ],
              },
            ].map((pillar, i) => (
              <div key={i} className="glass-card-hover rounded-2xl p-8 group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    {pillar.icon}
                  </div>
                  <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-[15px] mb-5">
                  {pillar.description}
                </p>
                <ul className="space-y-2">
                  {pillar.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-[14px] text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="accent-bar mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Why Choose Us?
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground mb-10 leading-relaxed">
                <p>
                  Most modern bookkeepers hit a complexity ceiling and lack the capacity to provide services to niche industries. They refuse to touch books that dabble in cryptocurrency, and often try to solve everything with journal entries—without truly understanding the underlying issues.
                </p>
                <p>
                  Let's be honest: if you got audited, could your bookkeeper explain those entries? Probably not, because they just wanted the books to look good, not actually fix them. This is why they can't explain concepts to you or help you understand what's actually happening in your business.
                </p>
                <p>
                  Communication is often vague and rare. Bookkeepers who also provide tax preparation frequently deprioritize client books during tax season, causing miscommunication, inaccuracies, and backlogs.
                </p>
                <p>
                  We designed a boutique model that stays available and technically unmatched. With advanced capability and hands-on experience, we know exactly what it takes to make a business survive.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: <Clock className="w-5 h-5" />,
                    title: "12-Month Availability",
                    desc: "No tax preparation means no seasonal blind spots. We are a year-round strategic resource.",
                  },
                  {
                    icon: <ShieldCheck className="w-5 h-5" />,
                    title: "No Offshore — Ever",
                    desc: "100% domestic. Your sensitive financial data is handled personally by a dedicated US expert.",
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    title: "Exclusive, High-Touch Service",
                    desc: "A deliberately selective client model ensures executive-level dedication and rapid response times for every engagement.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="mt-0.5 p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-[15px] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-accent/20 via-transparent to-primary/20 blur-sm" />
              <div className="relative glass-card rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold text-white">
                    Why Choose Blueprints & Bookkeeping?
                  </span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Advanced Bookkeeping Expertise", value: true },
                    {
                      label: "Certified Ethical Hacker (CEH v12)",
                      value: true,
                    },
                    { label: "QuickBooks ProAdvisor Advanced", value: true },
                    { label: "Year-Round Availability", value: true },
                    { label: "Offshore Labor", value: false },
                    { label: "Tax Season Blackouts", value: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${item.value ? "bg-green-500/20 text-green-400" : "bg-red-500/15 text-red-400"}`}
                      >
                        {item.value ? "✓" : "✕"}
                      </div>
                      <span
                        className={`text-[14px] ${item.value ? "text-foreground" : "text-muted-foreground line-through"}`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-14">
            <div className="accent-bar mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Built for Strategic Clarity and Financial Control
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
A specialized partnership offering leadership-level advice, structured financial statements, and forward-thinking assistance as your business grows.            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                stat: "Week 1",
                label: "Books assessed & cleanup scoped",
                detail:
                  "You'll know exactly what needs to be fixed and how long it will take.",
              },
              {
                stat: "Month 1",
                label: "Reconciled, caught up, and current",
                detail:
                  "Historical cleanup completed. Monthly close process established. Reports ready for any stakeholder.",
              },
              {
                stat: "Ongoing",
                label: "Proactive, not reactive",
                detail:
                  "Monthly close, cash flow monitoring, and advisory communication — not just data entry.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-7"
              >
                <div className="text-2xl font-display font-extrabold text-accent mb-1">
                  {item.stat}
                </div>
                <div className="font-semibold text-white mb-3 text-[15px]">
                  {item.label}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
              <div>
                <div className="accent-bar mb-5" />
                <p className="text-sm font-semibold tracking-[0.16em] text-accent/80 mb-4">
                  FEATURED CLIENT OUTCOME
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  From backlog to board-ready reporting.
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                  A multi-entity service business came to us with a 2-year reconciliation backlog and cash flow blind spots. Millions in undeposited funds, negative asset and liability accounts, and no hope after being turned down by 3 accountants. We met with them, understood how their business had been operating, what caused them to fall behind, and took them on. Within 30 days, they had up-to-date books and could explain exactly where each number on their profit and loss or balance sheet came from. That is truly empowering. Now, they meet with us quarterly but maintain their books themselves monthly (and correctly), and they just expanded their business model and doubled their funding. Think about knowing you have reliable numbers every month. What is that worth to you?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: "5 months", label: "Backlog cleared" },
                    { value: "45 days", label: "To stable monthly close" },
                    { value: "100%", label: "US-based handling" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-foreground/[0.02] p-4"
                    >
                      <p className="text-xl font-display font-bold text-foreground mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/40 p-5 sm:p-6">
                <p className="text-sm font-semibold text-foreground mb-5">
                  Delivery timeline
                </p>
                <div className="space-y-5">
                  {[
                    {
                      phase: "Week 1",
                      detail:
                        "Full diagnostic, chart-of-accounts repair plan, and milestone map.",
                    },
                    {
                      phase: "Weeks 2–4",
                      detail:
                        "Historical cleanup, reconciliation, and reporting architecture.",
                    },
                    {
                      phase: "Weeks 5–6",
                      detail:
                        "Executive dashboard handoff and monthly close rhythm finalized.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-accent">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {item.phase}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoogleReviewsCallout />

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="py-24 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-accent/[0.02] to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            Stop Guessing.
            <br />
            <span className="text-gradient">Start Building Your Blueprint.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Success Starts with Our First Meeting. Book Today. 
          </p>
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold text-lg rounded-xl shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Book Your Consultation
            <ArrowRight size={20} />
          </Link>
          <FinalCtaTrustNote />
        </div>
      </section>
    </div>
  );
}
