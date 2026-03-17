import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, FileText } from "lucide-react";
import { SEO } from "@/components/SEO";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const caseStudies = [
  {
    title: "E-commerce Brand Recovered Month-End Visibility",
    profile: "Direct-to-consumer home goods company, 7-figure annual revenue",
    problem:
      "Financial statements were running 6-8 weeks behind, cash flow decisions were being made from outdated reports, and inventory adjustments were inconsistent across sales channels.",
    intervention:
      "Completed a 10-week historical cleanup, rebuilt chart-of-accounts structure, implemented rule-based categorization in QuickBooks, and introduced a monthly close checklist with owner review checkpoints.",
    outcome:
      "Month-end close cycle moved from 45+ days to 8 business days. The owner identified a recurring margin leak and improved gross margin by 6.2 percentage points in the following two quarters.",
    timeframe: "Initial stabilization in 90 days; margin gains measured over 6 months",
    serviceLinks: [
      { href: "/services/bookkeeping", label: "Advanced Bookkeeping & Cleanup" },
      { href: "/services", label: "All Services" },
    ],
  },
  {
    title: "Construction Operator Improved Bid Accuracy",
    profile: "Regional specialty contractor with multiple project crews",
    problem:
      "The business lacked consistent job-cost reporting, so estimates were based on assumptions instead of historical performance. Several projects closed below target margin.",
    intervention:
      "Standardized job-cost classes, reconciled historical project data, and introduced a weekly WIP and variance reporting cadence tied to monthly owner strategy meetings.",
    outcome:
      "Within two quarters, average estimate accuracy improved by 18% and project gross margin variance narrowed from +/-14% to +/-5.5%.",
    timeframe: "Reporting system built in 12 weeks; results measured over 2 quarters",
    serviceLinks: [
      { href: "/services/bookkeeping", label: "Bookkeeping Systems Support" },
      { href: "/industries", label: "Industry Experience" },
    ],
  },
  {
    title: "Startup Founder Secured a Lender-Ready Plan",
    profile: "Early-stage food manufacturing startup preparing for financing",
    problem:
      "The founder had strong demand signals but lacked a credible financial model and lender-ready narrative to support expansion financing.",
    intervention:
      "Developed a full business plan package including market positioning, operating assumptions, 5-year financial forecasts, and scenario testing for debt-service coverage.",
    outcome:
      "Client entered lender meetings with standardized projections and successfully obtained a mid-six-figure equipment financing package with terms aligned to forecasted cash flow.",
    timeframe: "Plan delivered in 5 weeks; financing closed in under 4 months",
    serviceLinks: [
      { href: "/services/business-plans", label: "Business Plans & Forecasting" },
      { href: "/services/digital-handshake", label: "Digital Handshake Add-On" },
    ],
  },
];

export default function Results() {
  return (
    <div>
      <SEO
        title="Client Results & Case Studies"
        description="Anonymized bookkeeping and business planning case studies with measurable outcomes, project timeframes, and service details from Blueprints & Bookkeeping engagements."
        path="/results"
      />
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <div className="accent-bar mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Client <span className="text-gradient">Case Studies</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real outcomes from real founders. Every engagement is confidential — names and identifying details are anonymized to protect client privacy.
            </p>
            <p className="mt-6 text-sm text-muted-foreground/70 italic max-w-xl mx-auto">
              Past results are not a guarantee of future outcomes. Every business is unique, and individual results will vary based on circumstances, market conditions, and other factors.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {caseStudies.map((caseStudy, index) => (
              <motion.article key={caseStudy.title} {...fadeUp} className="glass-card rounded-2xl p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent">
                    {index % 2 === 0 ? <MessageSquare size={24} /> : <FileText size={24} />}
                  </div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground font-mono">Anonymized Client Case</p>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">{caseStudy.title}</h2>
                <p className="text-sm text-muted-foreground mb-6">{caseStudy.profile}</p>

                <div className="space-y-5 text-muted-foreground leading-relaxed">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Problem</h3>
                    <p>{caseStudy.problem}</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Intervention</h3>
                    <p>{caseStudy.intervention}</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Measurable Outcome</h3>
                    <p>{caseStudy.outcome}</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Timeframe</h3>
                    <p>{caseStudy.timeframe}</p>
                  </div>
                </div>

                <p className="mt-6 text-xs text-muted-foreground/80 italic">
                  Case details are composited and anonymized from real engagements to preserve confidentiality. Outcomes depend on implementation consistency, underlying business conditions, and market factors.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {caseStudy.serviceLinks.map((serviceLink) => (
                    <Link
                      key={serviceLink.href}
                      href={serviceLink.href}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
                    >
                      {serviceLink.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/schedule"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-semibold text-sm hover:brightness-110 transition-all"
                  >
                    Schedule a Consultation
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-foreground font-semibold text-sm hover:border-accent/40 hover:text-accent transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm text-muted-foreground">
            <p>
              <strong className="text-white">Transparency note:</strong> Each case study reflects authentic client scenarios and measured metrics, but company names, dates, and certain operational details have been modified for privacy.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-accent/[0.02] to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Write Your{" "}
              <span className="text-gradient">Success Story?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Book a free 30-minute discovery call. We'll look at your books together and build a custom plan.
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
