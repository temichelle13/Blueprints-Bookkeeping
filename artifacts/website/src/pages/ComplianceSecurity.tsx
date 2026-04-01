import { Link } from "wouter";
import { ShieldCheck, Lock, FileCheck2, Siren, Users } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import {
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
  professionalServiceSchema,
} from "@/lib/seo-schemas";

const BASE_URL = "https://blueprintsandbookkeeping.com";

const complianceFaq = [
  {
    question: "How is client data protected?",
    answer:
      "All website traffic is protected with HTTPS and operational systems follow least-access handling, secure credential storage, and documented access controls for bookkeeping workflows.",
  },
  {
    question: "Do you share data with subcontractors?",
    answer:
      "Only when needed to deliver services, and only with vetted providers under contractual confidentiality and security obligations.",
  },
  {
    question: "What should I do if I suspect a security issue?",
    answer:
      "Email tea@blueprintsandbookkeeping.com with the subject line 'Security Incident' and include timeline, impacted accounts, and relevant screenshots.",
  },
];

export default function ComplianceSecurity() {
  usePageTitle("Compliance & Security");

  const jsonLd = [
    localBusinessSchema(),
    professionalServiceSchema({ url: `${BASE_URL}/compliance-security` }),
    faqPageSchema(complianceFaq),
    breadcrumbSchema([
      { name: "Home", url: BASE_URL },
      { name: "Compliance & Security", url: `${BASE_URL}/compliance-security` },
    ]),
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Compliance & Security"
        description="How Blueprints & Bookkeeping protects client information, handles subcontractors, and responds to incidents."
        path="/compliance-security"
        jsonLd={jsonLd}
      />

      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="accent-bar mb-6" />
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Compliance &amp; Security
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            We operate with privacy-first bookkeeping practices, secure payment
            workflows, and clear incident reporting. This page summarizes our
            baseline controls and contact path.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-5 mb-10">
        {[
          {
            icon: Lock,
            title: "Encryption & secure transmission",
            body: "We enforce HTTPS for website and client portal traffic. We avoid collecting full card details directly on-site and rely on Stripe-hosted payment infrastructure where applicable.",
          },
          {
            icon: FileCheck2,
            title: "Data handling",
            body: "Client data is collected only for service delivery, retained only as needed for operations and compliance, and handled using role-based access and secure document workflows.",
          },
          {
            icon: Users,
            title: "Subcontractors & service providers",
            body: "When subcontractors or SaaS vendors are used, access is limited to the minimum required and bound by confidentiality and data-protection obligations.",
          },
          {
            icon: Siren,
            title: "Incident response contact",
            body: "For suspected incidents, email tea@blueprintsandbookkeeping.com with subject line 'Security Incident'. Include the date/time, affected systems, and screenshots so we can triage quickly.",
          },
        ].map((item) => (
          <article key={item.title} className="glass-card rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <item.icon className="w-5 h-5 text-accent" aria-hidden="true" />
              {item.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.body}
            </p>
          </article>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            Compliance quick FAQ
          </h2>
          <div className="space-y-4">
            {complianceFaq.map((item) => (
              <div key={item.question}>
                <h3 className="font-semibold text-white text-sm">
                  {item.question}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Blueprints &amp; Bookkeeping LLC is not a CPA firm and does not
            provide tax filing services. For tax filing and legal matters,
            coordinate with licensed professionals.
          </p>

          <div className="mt-6 text-sm text-muted-foreground">
            Read also:{" "}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            ,{" "}
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
            </Link>
            , and{" "}
            <Link href="/cookies" className="text-accent hover:underline">
              Cookie Policy
            </Link>
            .
          </div>
        </div>
      </section>
    </div>
  );
}
