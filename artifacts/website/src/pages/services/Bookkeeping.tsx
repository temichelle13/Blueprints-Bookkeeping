import { Link } from "wouter";
import {
  Calculator,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  FileText,
  RefreshCw,
  Database,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BookkeepingDisclaimer } from "@/components/BookkeepingDisclaimer";
import {
  serviceSchema,
  breadcrumbSchema,
  localBusinessSchema,
  professionalServiceSchema,
} from "@/lib/seo-schemas";

const BASE_URL = "https://blueprintsandbookkeeping.com";

export default function Bookkeeping() {
  const jsonLd = [
    localBusinessSchema(),
    professionalServiceSchema({ url: `${BASE_URL}/services/bookkeeping` }),
    serviceSchema({
      name: "Advanced Bookkeeping & Cleanup",
      description:
        "Multi-entity structuring, historical cleanups, rule-based QBO automation, and rigorous monthly close procedures for complex businesses.",
      url: `${BASE_URL}/services/bookkeeping`,
    }),
    breadcrumbSchema([
      { name: "Home", url: BASE_URL },
      { name: "Services", url: `${BASE_URL}/services` },
      { name: "Bookkeeping", url: `${BASE_URL}/services/bookkeeping` },
    ]),
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Advanced Bookkeeping & Cleanup Services"
        description="Multi-entity structuring, historical data remediation, rule-based QBO automation, and rigorous monthly close procedures. Serving complex businesses nationwide from Roseburg, Oregon."
        path="/services/bookkeeping"
        jsonLd={jsonLd}
      />

      <section className="py-16 mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: "Bookkeeping" },
            ]}
          />
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <Calculator className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">
              ONGOING SERVICE
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Advanced Bookkeeping & Cleanup
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            For complex operations that have outgrown generalist data entry. We
            handle multi-entity structures, historical remediation, and
            automated workflows that keep your financials audit-ready
            year-round.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <Database className="w-5 h-5" />,
              title: "Multi-Entity Consolidation",
              desc: "Manage separate ledgers, resolve intercompany transactions, and produce consolidated financial statements across your entire portfolio.",
            },
            {
              icon: <RefreshCw className="w-5 h-5" />,
              title: "Historical Cleanup",
              desc: "Untangle months or years of disorganized books. We reconcile, reclassify, and correct records to restore full accuracy.",
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Rule-Based QBO Automation",
              desc: "Custom QuickBooks Online rules and workflows that reduce manual entry, eliminate human error, and accelerate your monthly close.",
            },
            {
              icon: <FileText className="w-5 h-5" />,
              title: "Monthly Close & Statements",
              desc: "Rigorous close procedures producing P&L, balance sheet, and cash flow statements formatted for bank review or internal reporting.",
            },
            {
              icon: <Clock className="w-5 h-5" />,
              title: "Year-Round Availability",
              desc: "A focused client roster keeps support consistent year-round, with bookkeeping systems maintained before deadlines become emergencies.",
            },
            {
              icon: <Calculator className="w-5 h-5" />,
              title: "Niche Reconciliation",
              desc: "Specialized handling for crypto transactions, agricultural revenue, timber operations, e-commerce multi-platform sales, and more.",
            },
          ].map((item, i) => (
            <div key={i} className="glass-card-hover rounded-2xl p-6 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white">{item.title}</h3>
              </div>
              <p className="text-muted-foreground text-[14px] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">
          Who This Is For
        </h2>
        <div className="glass-card rounded-2xl p-8">
          <ul className="space-y-3">
            {[
              "Founders operating multiple LLCs, holding companies, or DBA structures",
              "Businesses with crypto, DeFi, or digital asset revenue streams",
              "Companies needing clean, accurate financial statements for any purpose",
              "Operations exceeding what manual reconciliation can handle accurately",
              "Agriculture, timber, and resource-based businesses with complex seasonal cycles",
              "E-commerce sellers reconciling across Stripe, PayPal, Shopify, and Amazon",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-1" />
                <span className="text-foreground text-[15px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <BookkeepingDisclaimer
          compact
          title="Compliance note"
          className="max-w-3xl"
        />
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-primary/20" />
          <div className="absolute inset-[1px] rounded-2xl bg-card" />
          <div className="relative p-8 text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              Ready to Upgrade Your Financial Infrastructure?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Schedule a free discovery call and we'll assess your current
              setup, identify gaps, and build a custom plan.
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
