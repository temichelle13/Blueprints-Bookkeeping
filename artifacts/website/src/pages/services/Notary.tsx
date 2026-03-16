import { Link } from "wouter";
import { Stamp, CheckCircle2, ArrowRight, Shield, FileText, MapPin, Clock, Monitor, AlertTriangle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo-schemas";

const BASE_URL = "https://blueprintsandbookkeeping.com";

export default function Notary() {
  const jsonLd = [
    serviceSchema({
      name: "Notary Services — Roseburg, Oregon",
      description: "Professional notary services available in Roseburg, Oregon and surrounding Douglas County. Convenient scheduling for business and personal documents.",
      url: `${BASE_URL}/services/notary`
    }),
    breadcrumbSchema([
      { name: "Home", url: BASE_URL },
      { name: "Services", url: `${BASE_URL}/services` },
      { name: "Notary Services", url: `${BASE_URL}/services/notary` }
    ])
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Notary Services — Roseburg, Oregon"
        description="Professional notary services in Roseburg, Oregon and surrounding Douglas County. Convenient scheduling for business formations, real estate, contracts, and personal documents."
        path="/services/notary"
        jsonLd={jsonLd}
      />

      <section className="py-16 mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Notary Services" }
          ]} />
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <Stamp className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-mono font-medium tracking-widest text-muted-foreground">LOCAL SERVICE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Notary Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Convenient, professional notary services in Roseburg, Oregon. Available by appointment for business and personal document notarization throughout Douglas County.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">Documents We Notarize</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <FileText className="w-5 h-5" />,
              title: "Business Documents",
              items: ["LLC operating agreements", "Articles of incorporation", "Business contracts and agreements", "Partnership documents", "Board resolutions"]
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Personal Documents",
              items: ["Powers of attorney", "Affidavits and sworn statements", "Real estate documents", "Estate planning documents", "Vehicle title transfers"]
            }
          ].map((category, i) => (
            <div key={i} className="glass-card-hover rounded-2xl p-6 group">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  {category.icon}
                </div>
                <h3 className="font-bold text-white">{category.title}</h3>
              </div>
              <ul className="space-y-2">
                {category.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground text-[14px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-6">In-Person vs. Remote Online Notarization (RON)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card-hover rounded-2xl p-6 group">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">In-Person Notarization</h3>
            </div>
            <p className="text-muted-foreground text-[14px] leading-relaxed mb-4">
              Traditional notarization performed face-to-face in Roseburg or surrounding Douglas County. Available by appointment for all document types.
            </p>
            <ul className="space-y-2">
              {["All document types accepted", "Valid government-issued photo ID required", "Available by appointment"].map((item, j) => (
                <li key={j} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground text-[14px]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card-hover rounded-2xl p-6 group">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">Remote Online Notarization (RON)</h3>
            </div>
            <p className="text-muted-foreground text-[14px] leading-relaxed mb-4">
              Notarization performed via a secure audio-video session. Convenient for clients who cannot meet in person. Oregon-commissioned RON.
            </p>
            <div className="mb-3">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Eligible for RON</span>
            </div>
            <ul className="space-y-2 mb-5">
              {["Powers of attorney", "Affidavits and sworn statements", "Business contracts and agreements", "LLC operating agreements", "Real estate transfer documents", "Loan and mortgage documents"].map((item, j) => (
                <li key={j} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground text-[14px]">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mb-3">
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Not eligible for RON — Require in-person</span>
            </div>
            <ul className="space-y-2 mb-5">
              {["Self-proved wills and codicils (Oregon law requires physical presence)", "Documents requiring witness signatures not supported by the RON platform", "Court-ordered documents specifying in-person notarization", "Documents where the receiving agency or county explicitly requires wet-ink notarization"].map((item, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="w-4 h-4 text-red-400 shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold">✕</span>
                  <span className="text-foreground text-[14px]">{item}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground text-[14px]">Identity verified via knowledge-based authentication (KBA) + credential analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground text-[14px]">Session recorded and tamper-sealed per Oregon RON requirements</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-5 py-4">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-amber-200/80">
            <span className="font-semibold text-amber-300">Out-of-state clients:</span> RON acceptance varies by state. Some states may not recognize a notarization performed via Oregon RON for certain document types. If you are located outside Oregon, please verify with your local authority, receiving agency, or attorney that Oregon RON is accepted in your jurisdiction before scheduling. Eligibility of specific document types may also depend on the requirements of the receiving county or agency.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <MapPin className="w-5 h-5" />,
              title: "Roseburg & Douglas County",
              desc: "Serving Roseburg, Sutherlin, Myrtle Creek, Winston, and surrounding Douglas County communities."
            },
            {
              icon: <Clock className="w-5 h-5" />,
              title: "By Appointment",
              desc: "Flexible scheduling to accommodate your timeline. Same-day appointments available when possible."
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Bonded & Commissioned",
              desc: "Oregon State commissioned notary public. Bonded and insured for your protection."
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
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">Existing Clients</h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            If you're an existing bookkeeping or business plan client, notary services for related business documents are included as a courtesy when performed during your regular meeting schedule. For standalone notary appointments or non-client requests, standard notary fees apply.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-primary/20" />
          <div className="absolute inset-[1px] rounded-2xl bg-card" />
          <div className="relative p-8 text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Need a Document Notarized?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Contact us to schedule a notary appointment in Roseburg or Douglas County.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
              >
                Schedule an Appointment <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+15413198654"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-accent/30 text-accent font-semibold rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
              >
                Call (541) 319-8654
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
