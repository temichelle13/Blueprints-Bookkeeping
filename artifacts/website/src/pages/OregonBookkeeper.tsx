import { Link } from "wouter";
import { MapPin, CheckCircle2, ArrowRight, Calculator, BookOpen, Shield, Clock, Users, TreePine } from "lucide-react";
import { SEO } from "@/components/SEO";
import { localBusinessSchema, serviceSchema, breadcrumbSchema } from "@/lib/seo-schemas";

const BASE_URL = "https://blueprintsandbookkeeping.com";

export default function OregonBookkeeper() {
  const jsonLd = [
    {
      ...localBusinessSchema(),
      description: "Professional bookkeeper in Roseburg, Oregon serving Southern Oregon businesses. Advanced bookkeeping, historical cleanup, multi-entity structuring, and SBA-ready business plans.",
      areaServed: [
        { "@type": "City", name: "Roseburg", containedInPlace: { "@type": "State", name: "Oregon" } },
        { "@type": "AdministrativeArea", name: "Douglas County" },
        { "@type": "AdministrativeArea", name: "Southern Oregon" }
      ]
    },
    serviceSchema({
      name: "Bookkeeping Services — Roseburg, Oregon",
      description: "Advanced bookkeeping and financial services for Southern Oregon businesses. Serving Roseburg, Douglas County, and the greater Southern Oregon region.",
      url: `${BASE_URL}/oregon-bookkeeper`
    }),
    breadcrumbSchema([
      { name: "Home", url: BASE_URL },
      { name: "Oregon Bookkeeper", url: `${BASE_URL}/oregon-bookkeeper` }
    ])
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Bookkeeper in Roseburg, Oregon — Southern Oregon Bookkeeping"
        description="Professional bookkeeping services in Roseburg, Oregon. Serving Douglas County and Southern Oregon with advanced bookkeeping, historical cleanup, multi-entity structuring, and SBA-ready business plans."
        path="/oregon-bookkeeper"
        jsonLd={jsonLd}
      />

      <section className="py-16 mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-8">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Roseburg, Oregon</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Your Southern Oregon<br />
            <span className="text-gradient">Bookkeeping Partner</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Blueprints & Bookkeeping provides advanced bookkeeping and business planning services from Roseburg, Oregon — serving Douglas County, Southern Oregon, and businesses nationwide.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass-card rounded-2xl p-8 border border-accent/10">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-white">Proudly Based in Roseburg, Oregon</h2>
          </div>
          <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
            We're a locally owned bookkeeping firm rooted in Roseburg, serving the unique needs of Southern Oregon businesses. From Douglas County timber operations and agricultural enterprises to downtown Roseburg retailers and growing startups, we understand the local economy and the specific financial challenges businesses face here.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Service Area", value: "Roseburg, Douglas County, Southern Oregon & Nationwide" },
              { label: "Founded In", value: "Roseburg, Oregon" },
              { label: "Availability", value: "Year-round, 12 months" }
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-white font-semibold text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">Services for Southern Oregon Businesses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/services/bookkeeping" className="glass-card-hover rounded-2xl p-6 group block">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">ONGOING</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">Advanced Bookkeeping</h3>
            <p className="text-muted-foreground text-[14px] leading-relaxed mb-4">
              Multi-entity structuring, historical cleanup, rule-based QBO automation, and rigorous monthly close procedures.
            </p>
            <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Learn more <ArrowRight size={14} />
            </span>
          </Link>

          <Link href="/services/business-plans" className="glass-card-hover rounded-2xl p-6 group block">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">PROJECT</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">Business Plans</h3>
            <p className="text-muted-foreground text-[14px] leading-relaxed mb-4">
              SBA-ready and investor-grade business plans with rigorous financial forecasting and deep market analysis.
            </p>
            <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Learn more <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">Local Industry Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <TreePine className="w-5 h-5" />,
              title: "Agriculture & Timber",
              desc: "Deep experience with Schedule F, equipment depreciation, seasonal payroll, and commodity revenue tracking for Douglas County operations."
            },
            {
              icon: <Users className="w-5 h-5" />,
              title: "Small Business & Retail",
              desc: "Point-of-sale reconciliation, inventory management, and multi-location financial reporting for Roseburg-area businesses."
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Contractors & Trades",
              desc: "Job costing, project-based accounting, contractor compliance, and equipment-heavy depreciation schedules."
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
        <h2 className="text-2xl font-display font-bold text-white mb-6">Why Choose a Local Bookkeeper?</h2>
        <div className="glass-card rounded-2xl p-8">
          <div className="space-y-5">
            {[
              {
                icon: <MapPin className="w-5 h-5" />,
                title: "Local Knowledge",
                desc: "We understand the Southern Oregon economy — from timber cycles and agricultural seasons to the challenges facing downtown Roseburg businesses."
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: "Year-Round Availability",
                desc: "Unlike tax-focused firms that disappear during Q1, we're available 12 months a year. No seasonal blackouts, ever."
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: "100% Domestic, No Offshore",
                desc: "Your sensitive financial data is handled personally — never outsourced offshore. Oregon-licensed and locally accountable."
              },
              {
                icon: <Users className="w-5 h-5" />,
                title: "Boutique Attention",
                desc: "We maintain a strictly capped client roster to ensure every Southern Oregon business gets executive-level dedication."
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-0.5 p-2.5 rounded-lg bg-accent/10 text-accent shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px] mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-[14px] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">Serving These Communities</h2>
        <div className="glass-card rounded-2xl p-8">
          <div className="flex flex-wrap gap-3">
            {[
              "Roseburg", "Sutherlin", "Myrtle Creek", "Winston", "Riddle",
              "Drain", "Glide", "Canyonville", "Oakland", "Reedsport",
              "Douglas County", "Southern Oregon", "Umpqua Valley"
            ].map((city, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-primary/20" />
          <div className="absolute inset-[1px] rounded-2xl bg-card" />
          <div className="relative p-8 text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              Ready to Work With a Local Expert?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Schedule a free discovery call with your Roseburg, Oregon bookkeeping partner. We'll assess your needs and build a custom plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
              >
                Book a Discovery Call <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-accent/30 text-accent font-semibold rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
