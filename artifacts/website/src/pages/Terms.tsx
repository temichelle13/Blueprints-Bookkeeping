import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import {
  breadcrumbSchema,
  localBusinessSchema,
  professionalServiceSchema,
} from "@/lib/seo-schemas";
import { Link } from "wouter";

export default function Terms() {
  usePageTitle("Terms of Service");
  const BASE_URL = "https://blueprintsandbookkeeping.com";
  const jsonLd = [
    localBusinessSchema(),
    professionalServiceSchema({ url: `${BASE_URL}/terms` }),
    breadcrumbSchema([
      { name: "Home", url: BASE_URL },
      { name: "Terms of Service", url: `${BASE_URL}/terms` },
    ]),
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Terms of Service"
        path="/terms"
        description="Review service terms, limitations, and legal conditions for working with Blueprints & Bookkeeping."
        jsonLd={jsonLd}
      />
      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="accent-bar mb-6" />
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: March 31, 2026
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="glass-card rounded-2xl p-8 space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Blueprints & Bookkeeping LLC website
              (blueprintsandbookkeeping.com) or engaging our services, you agree
              to be bound by these Terms of Service. If you do not agree, please
              do not use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Services</h2>
            <p className="mb-3">
              Blueprints & Bookkeeping LLC provides bookkeeping, business
              planning, and related financial support services. Tax-related
              business support may be available when included in a client
              agreement. Our services do not include:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Personal income tax return preparation</li>
              <li>
                State tax return preparation unless explicitly included in a
                signed engagement
              </li>
              <li>Legal advice or legal representation</li>
              <li>Licensed investment or securities advice</li>
              <li>Audit or attest services</li>
            </ul>
            <p className="mt-3">
              Specific terms governing each engagement are set forth in a
              separate client agreement or engagement letter.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              3. Professional Scope Limits
            </h2>
            <p>
              Blueprints & Bookkeeping LLC is not a CPA firm, public accounting
              firm, law firm, auditor, investment adviser, Enrolled Agent, or
              unlimited tax representative. Website content is general
              information and should not be treated as legal, investment, or
              individualized tax advice.
            </p>
            <p className="mt-3">
              Personal income tax and state tax return preparation are not
              advertised services. Please work with an appropriately licensed
              professional when legal, investment, or regulated tax decisions
              are required.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              4. Intellectual Property
            </h2>
            <p>
              All content on this website — including text, graphics, logos, and
              design — is the property of Blueprints & Bookkeeping LLC and
              protected by applicable copyright and intellectual property laws.
              You may not reproduce, distribute, or use our content without
              prior written permission.
            </p>
            <p className="mt-3">
              Deliverables created for clients (business plans, financial
              models, etc.) are subject to the intellectual property terms in
              your individual client agreement.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              5. Confidentiality
            </h2>
            <p>
              We treat all client financial information as strictly
              confidential. We do not share client data with third parties
              except as required by law or as necessary to perform our services.
              All case studies and client results on this website are anonymized
              to protect client privacy.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              6. Inquiry Data Processing and Retention
            </h2>
            <p>
              When you submit a website inquiry, we process your contact and
              business details to respond to your request, evaluate service fit,
              maintain communication-consent records, and comply with legal and
              regulatory obligations (including privacy/TCPA workflows). Inquiry
              data is retained for up to 12 months while active, then
              auto-archived/redacted, and permanently deleted after 24 months
              unless a legal hold applies.
            </p>
            <p className="mt-3">
              Additional details are provided in our{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              7. Disclaimer of Warranties
            </h2>
            <p>
              Our website and services are provided "as is" without warranties
              of any kind. We make no guarantees regarding specific business
              outcomes, loan approvals, or investment results from our services.
              Financial projections and business plans are forward-looking
              estimates based on available information and assumptions — actual
              results may vary.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              8. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Blueprints & Bookkeeping
              LLC shall not be liable for any indirect, incidental, special, or
              consequential damages arising from the use of our website or
              services. Our total liability for any claim shall not exceed the
              amount paid for the specific service giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              9. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the State of Oregon. Any
              disputes arising from these Terms or our services shall be
              resolved in the courts of Douglas County, Oregon.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              10. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of our
              website or services after changes are posted constitutes your
              acceptance of the updated Terms. The "last updated" date at the
              top of this page reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">11. Contact</h2>
            <p>Questions about these Terms? Contact us:</p>
            <div className="mt-3 pl-4 border-l border-accent/30 space-y-1">
              <p>Blueprints & Bookkeeping LLC</p>
              <p>Roseburg, Oregon</p>
              <p>
                <a
                  href="mailto:tea@blueprintsandbookkeeping.com"
                  className="text-accent hover:underline"
                >
                  tea@blueprintsandbookkeeping.com
                </a>
              </p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground/80">
              Important: These Terms are provided for general informational
              purposes and should be reviewed by qualified business counsel
              before publication or reliance.
            </p>
          </section>
        </div>

        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/" className="text-accent hover:underline">
              ← Back to Home
            </Link>
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            <Link
              href="/compliance-security"
              className="text-accent hover:underline"
            >
              Compliance & Security
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
