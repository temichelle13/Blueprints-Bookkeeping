import { Link } from "wouter";
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target,
  FileBarChart,
  BarChart3,
  PieChart,
  Briefcase,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  serviceSchema,
  breadcrumbSchema,
  localBusinessSchema,
  professionalServiceSchema,
} from "@/lib/seo-schemas";
import { BookkeepingDisclaimer } from "@/components/BookkeepingDisclaimer";

const BASE_URL = "https://blueprintsandbookkeeping.com";

export default function BusinessPlans() {
  const jsonLd = [
    localBusinessSchema(),
    professionalServiceSchema({ url: `${BASE_URL}/services/business-plans` }),
    serviceSchema({
      name: "Business Plans & Financial Forecasting",
      description:
        "Comprehensive, professionally written business plans with rigorous 3-to-5-year financial forecasting, market analysis, and strategic narrative development.",
      url: `${BASE_URL}/services/business-plans`,
    }),
    breadcrumbSchema([
      { name: "Home", url: BASE_URL },
      { name: "Services", url: `${BASE_URL}/services` },
      { name: "Business Plans", url: `${BASE_URL}/services/business-plans` },
    ]),
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Business Plans & Financial Forecasting"
        description="Comprehensive business plans with rigorous 3-to-5-year financial forecasting, deep market analysis, and strategic narratives built for any audience."
        path="/services/business-plans"
        jsonLd={jsonLd}
      />

      <section className="py-16 mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: "Business Plans" },
            ]}
          />
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">
              PROJECT-BASED SERVICE
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Business Plans & Financial Forecasting
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            We write comprehensive business plans that give your business a
            clear direction — from startup roadmaps to detailed strategic
            forecasts.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Two Tiers, One Standard of Excellence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card-hover rounded-2xl p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">
                STARTUP ROADMAP
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Startup Roadmap
            </h3>
            <p className="text-muted-foreground text-[15px] mb-5">
              Ideal for early-stage businesses seeking internal clarity or
              initial bank conversations.
            </p>
            <ul className="space-y-3 flex-grow">
              {[
                "3-year financial forecast",
                "Market overview and positioning",
                "Executive summary",
                "Operational plan outline",
                "Revenue model documentation",
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground text-[14px]">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card-hover rounded-2xl p-8 flex flex-col border border-accent/20">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-medium tracking-widest text-accent">
                FULL PLAN PACKAGE
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Full Plan Package
            </h3>
            <p className="text-muted-foreground text-[15px] mb-5">
              Comprehensive, in-depth document built for any audience — banks,
              partners, or strategic planning.
            </p>
            <ul className="space-y-3 flex-grow">
              {[
                "5-year rigorous financial modeling",
                "Professional plan formatting",
                "Deep competitor analysis",
                "Complete strategic narrative",
                "Burn rate and cash runway analysis",
                "Debt service coverage modeling",
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground text-[14px]">{f}</span>
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
              icon: <TrendingUp className="w-5 h-5" />,
              title: "Rigorous Forecasting",
              desc: "Financial models built on defensible assumptions, not templates. Every projection is tied to real market data and operational metrics.",
            },
            {
              icon: <FileBarChart className="w-5 h-5" />,
              title: "Professional Format",
              desc: "Structured, thorough documentation built to professional standards — ready for banks, partners, or your own strategic clarity.",
            },
            {
              icon: <PieChart className="w-5 h-5" />,
              title: "Market Intelligence",
              desc: "Deep market analysis, competitive positioning, and TAM/SAM/SOM documentation that demonstrates opportunity and defensibility.",
            },
          ].map((item, i) => (
            <div key={i} className="glass-card-hover rounded-2xl p-6 group">
              <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 inline-block mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-[14px] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Our Process
        </h2>
        <div className="glass-card rounded-2xl p-8">
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Discovery Call",
                desc: "We learn about your business, goals, and what the plan needs to accomplish during a free 30-minute call.",
              },
              {
                step: "2",
                title: "Data Collection",
                desc: "We gather your financial history, industry data, competitive landscape, and operational details.",
              },
              {
                step: "3",
                title: "Model & Draft",
                desc: "We build your financial model and draft the full narrative, reviewing key assumptions with you along the way.",
              },
              {
                step: "4",
                title: "Review & Refine",
                desc: "You review the draft; we refine based on your feedback until the document meets your exact requirements.",
              },
              {
                step: "5",
                title: "Final Delivery",
                desc: "You receive a polished, print-ready document and supporting financial spreadsheets within 2-4 weeks.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px] mb-1">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-[14px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookkeepingDisclaimer
          compact
          title="Service scope note"
          className="mb-6"
        />
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-primary/20" />
          <div className="absolute inset-[1px] rounded-2xl bg-card" />
          <div className="relative p-8 text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              Ready to Build Your Business Plan?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Book a free discovery call and we'll scope the right plan for your
              business goals and timeline.
            </p>
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
            >
              Book a Discovery Call <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
