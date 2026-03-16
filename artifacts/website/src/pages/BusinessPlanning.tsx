import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Globe,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Target,
  BarChart3,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const services = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Startup Business Plans",
    description:
      "For founders launching a new venture. We build a comprehensive plan covering your business model, market analysis, operations strategy, and financial projections — professionally formatted and ready to share.",
    features: [
      "Executive summary & company overview",
      "Market research & competitive landscape",
      "3-to-5-year financial projections",
      "Professional plan formatting",
    ],
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Full Plan Package",
    description:
      "For businesses that need a comprehensive, in-depth plan. Goes deeper on market sizing, unit economics, and growth strategy with a complete 5-year financial model.",
    features: [
      "Detailed unit economics & burn-rate analysis",
      "Revenue model validation",
      "Use-of-funds breakdown",
      "Complete strategic narrative and financials",
    ],
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Advisory & Forecasting",
    description:
      "For existing businesses that need ongoing strategic planning. We create rolling forecasts, scenario models, and quarterly reviews to keep your financials aligned with your goals.",
    features: [
      "Rolling financial forecasts",
      "Scenario planning & sensitivity analysis",
      "KPI dashboards & performance tracking",
      "Quarterly strategic reviews",
    ],
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Plan-as-a-Website",
    description:
      "Your business plan delivered as a custom static website instead of a PDF. Interactive financials, instant loading, and a modern alternative to traditional pitch decks.",
    features: [
      "Custom-designed static website",
      "Interactive financial charts & models",
      "Password-protected or invite-only access",
      "No ongoing maintenance required",
    ],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery Call",
    description:
      "We learn about your business, goals, and what the plan needs to accomplish — who it's for and what purpose it serves.",
  },
  {
    step: "02",
    title: "Research & Analysis",
    description:
      "We dig into your market, competitors, and financial data. Using LivePlan's forecasting tools, we build rigorous projections grounded in real numbers.",
  },
  {
    step: "03",
    title: "Draft & Collaborate",
    description:
      "You receive a full draft for review. We refine the narrative, sharpen the financials, and iterate until every section is polished.",
  },
  {
    step: "04",
    title: "Delivery & Support",
    description:
      "Your finalized plan is delivered in your chosen format — PDF, LivePlan dashboard, or custom website. We're available for follow-up revisions and questions.",
  },
];

const faqs = [
  {
    question: "How long does it take to complete a business plan?",
    answer:
      "Most plans are completed within 2–4 weeks, depending on complexity and how quickly we receive your input. Investor-ready plans with detailed market research may take closer to 4–6 weeks.",
  },
  {
    question: "Do I need to use LivePlan directly?",
    answer:
      "No. We handle all the work inside LivePlan as your advisor. You'll receive your finished plan in whatever format you prefer — PDF, a shared LivePlan dashboard, or a custom website. You don't need your own LivePlan account unless you want one.",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "We've written plans across agriculture, cannabis, construction, e-commerce, food & beverage, professional services, and more. Our financial modeling expertise applies to virtually any industry.",
  },
  {
    question: "Who is the business plan for?",
    answer:
      "That depends on your goals — we discuss this during the discovery call. Plans can be written for internal planning, bank conversations, partner presentations, or any other purpose. We tailor the content and format to fit your specific situation.",
  },
  {
    question: "What is the 'Plan-as-a-Website' option?",
    answer:
      "Instead of a traditional PDF, we deliver your business plan as a custom-built static website. It includes interactive financial charts, clean navigation, and can be password-protected. It's a modern, professional way to share your plan with anyone who needs to see it.",
  },
  {
    question: "What does LivePlan Certified Advisor mean?",
    answer:
      "It means we've been vetted and certified by LivePlan — the leading business planning software used by over 1 million businesses. We use their professional-grade forecasting and benchmarking tools to build your plan, ensuring industry-standard rigor.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[15px] font-medium text-foreground pr-4 group-hover:text-white transition-colors">
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-5" : "max-h-0"}`}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function BusinessPlanning() {
  usePageTitle("Business Planning");

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Business Planning Services"
        description="Professional business plan consulting for founders who need more than a template."
        path="/business-planning"
      />
      <section className="py-16 mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <div className="accent-bar mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Business Planning Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              From startup blueprints to comprehensive financial models — we build
              business plans that clarify your direction and communicate your vision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/get-started"
                className="px-8 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-all duration-300"
              >
                Start Your Business Plan
              </Link>
              <Link
                href="/schedule"
                className="px-8 py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
              >
                Book a Discovery Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            What We Offer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every business is different. We tailor each plan to your stage, industry,
            and goals — whether you're launching, growing, or planning your next move.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card-hover rounded-2xl p-8 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                  {svc.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{svc.title}</h3>
              <p className="text-muted-foreground text-[15px] mb-6">
                {svc.description}
              </p>
              <ul className="space-y-3 mb-6">
                {svc.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground text-[14px]">{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-all duration-300"
                >
                  Book a Call to Get Started
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          {...fadeUp}
          className="glass-card rounded-2xl overflow-hidden border border-accent/20"
        >
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="flex-grow">
                <span className="text-[11px] font-mono font-medium tracking-widest text-accent mb-3 block">
                  LIVEPLAN CERTIFIED ADVISOR
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                  Powered by LivePlan
                </h2>
                <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
                  We're proud to be a{" "}
                  <strong className="text-foreground">LivePlan Certified Advisor</strong>{" "}
                  — part of a select network of financial professionals trusted by the
                  leading business planning platform. LivePlan is used by over 1 million
                  entrepreneurs and is recommended by SCORE and business advisors
                  nationwide.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    "Industry-standard financial modeling tools",
                    "500+ sample plans and benchmark data",
                    "Automatic financial statement generation",
                    "Real-time performance dashboards",
                    "Professional formatting and polished outputs",
                    "One-page executive summary exports",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-[14px] text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  When you work with us, you get the power of LivePlan's
                  professional-grade software combined with hands-on advisory from a real
                  financial expert. We handle the heavy lifting — you get a plan that's
                  ready for banks, partners, and your own strategic clarity.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.liveplan.com/accountants"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:text-white transition-colors"
                  >
                    Learn about LivePlan for Advisors
                    <ArrowRight size={14} />
                  </a>
                  <a
                    href="https://www.liveplan.com/affiliates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    LivePlan Affiliate Program
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Our Process
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A proven, collaborative approach that produces plans built on real data
            and strategic thinking.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6"
            >
              <span className="text-3xl font-display font-bold text-accent/30 mb-3 block">
                {step.step}
              </span>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="glass-card rounded-2xl p-6 md:p-8"
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <motion.div
          {...fadeUp}
          className="glass-card rounded-2xl p-8 md:p-12 text-center border border-white/[0.06]"
        >
          <div className="max-w-2xl mx-auto">
            <Target className="w-10 h-10 text-accent mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Ready to Build Your Business Plan?
            </h2>
            <p className="text-muted-foreground mb-8">
              Whether you're planning a launch, charting your next phase of growth, or
              just need a clear picture of where you're going — let's build a plan that gets you there.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/get-started"
                className="px-8 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-all duration-300"
              >
                Get Started
              </Link>
              <Link
                href="/schedule"
                className="px-8 py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
              >
                Book a Discovery Call
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs text-muted-foreground/60 leading-relaxed">
            <strong className="text-muted-foreground/80">Affiliate Disclosure:</strong>{" "}
            Blueprints & Bookkeeping is a LivePlan Certified Advisor and may earn a
            commission when clients sign up for LivePlan directly through our referral
            links. This does not affect the price you pay or the quality of our
            advisory services. We recommend LivePlan because we genuinely believe it's
            the best tool for building rigorous, professional business plans.
          </p>
        </div>
      </section>
    </div>
  );
}
