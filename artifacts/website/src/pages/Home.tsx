import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Clock,
  ShieldCheck,
  Users,
} from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  StatsProofBar,
  GoogleReviewsCallout,
  FinalCtaTrustNote,
} from "@/components/TrustSignals";
import { SEO } from "@/components/SEO";
import { trackHomeCtaClick } from "@/hooks/usePageTracking";
import { localBusinessSchema } from "@/lib/seo-schemas";

const servicePreviews = [
  {
    icon: <Calculator className="w-6 h-6" />,
    title: "Advanced Bookkeeping",
    description:
      "Ongoing QuickBooks Online bookkeeping for complex businesses that need clean records, reliable closes, and decision-ready reports.",
    href: "/services/bookkeeping",
    features: [
      "Monthly reconciliation and close",
      "Historical cleanup and catch-up support",
      "Multi-entity and niche-industry workflows",
      "Financial statements and management reporting",
    ],
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Business Plans",
    description:
      "Professional planning packages that turn your financials, market assumptions, and growth strategy into a usable business blueprint.",
    href: "/services/business-plans",
    features: [
      "3-to-5 year forecasting",
      "Target market and opportunity analysis",
      "Strategy, roadmap, and risk review",
      "Polished PDF plan deliverables",
    ],
  },
];

const trustPoints = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Security-aware financial handling",
    desc: "Sensitive records are handled with a cybersecurity-informed process and clear documentation standards.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Year-round bookkeeping focus",
    desc: "The practice is built around bookkeeping and planning support, so communication stays consistent throughout the year.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Boutique client capacity",
    desc: "A selective roster keeps the work personal, responsive, and aligned with the needs of each engagement.",
  },
];

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
            className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground tracking-tight max-w-4xl mb-6 leading-[1.05]"
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
            Bookkeeping and business planning that actually makes sense. Learn
            your numbers, find your direction, and grow your business.
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
              className="px-8 py-4 rounded-xl bg-card/80 text-foreground backdrop-blur-sm border border-border font-semibold text-lg hover:border-accent/30 hover:text-accent transition-all duration-300 flex items-center justify-center"
            >
              {secondaryCtaLabel}
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      <StatsProofBar />

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="accent-bar mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Build Your Business Blueprint
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Two focused services: clean up the numbers you rely on today, then
              use them to plan where the business goes next.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servicePreviews.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="glass-card-hover rounded-2xl p-8 group block"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {service.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[15px] mb-5">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-[14px] text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Explore {service.title} <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
            <div>
              <div className="accent-bar mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Built for clear numbers and careful execution
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Blueprints & Bookkeeping pairs technical bookkeeping depth with
                a selective service model, so every engagement gets practical
                analysis, documented workflows, and direct communication.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {trustPoints.map((item) => (
                <div key={item.title} className="glass-card rounded-2xl p-6">
                  <div className="p-2.5 rounded-lg bg-accent/10 text-accent w-fit mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-foreground text-[15px] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <GoogleReviewsCallout />

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-96 bg-accent/5 blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-6">
            Stop Guessing.
            <br />
            <span className="text-gradient">
              Start Building Your Blueprint.
            </span>
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
