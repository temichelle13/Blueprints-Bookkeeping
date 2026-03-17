import { useState, useMemo, type FormEvent } from "react";
import { z } from "zod";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Search,
  Shield,
  MapPin,
  Award,
  Users,
  ArrowRight,
  Globe,
  Phone,
  Mail,
  Filter,
  ChevronDown,
  CheckCircle2,
  Handshake,
  Building2,
  Send,
} from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { useContactMutation } from "@/hooks/use-contact";
import {
  taxPartners,
  US_STATES,
  SPECIALTIES,
  REGIONS,
  type TaxPartner,
} from "@/data/tax-partners";

function PartnerCard({ partner, index }: { partner: TaxPartner; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card-hover rounded-2xl p-6 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{partner.firmName}</h3>
          <p className="text-sm text-muted-foreground">{partner.contactName}</p>
        </div>
        <div className="flex gap-1.5">
          {partner.credentials.map((cred) => (
            <span
              key={cred}
              className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[11px] font-mono font-medium"
            >
              {cred}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {partner.nationwide ? (
          <div className="flex items-center gap-1.5 text-sm text-accent">
            <Globe size={14} />
            <span className="font-medium">Nationwide Coverage</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={14} className="text-accent/60" />
            <span>{partner.region}</span>
          </div>
        )}
      </div>

      {!partner.nationwide && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1.5">States Licensed:</p>
          <div className="flex flex-wrap gap-1">
            {partner.statesCovered.map((state) => (
              <span
                key={state}
                className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[11px] text-muted-foreground"
              >
                {state}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex-grow">
        <p className="text-xs text-muted-foreground mb-1.5">Specialties:</p>
        <div className="flex flex-wrap gap-1.5">
          {partner.specialties.map((spec) => (
            <span
              key={spec}
              className="px-2 py-0.5 rounded-full border border-white/[0.08] text-[11px] text-foreground"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.06]">
        <a
          href={`mailto:${partner.email}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <Mail size={14} className="text-accent/60" />
          {partner.email}
        </a>
        <a
          href={`tel:${partner.phone.replace(/[^+\d]/g, "")}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <Phone size={14} className="text-accent/60" />
          {partner.phone}
        </a>
      </div>
    </motion.div>
  );
}

const joinNetworkSchema = z.object({
  firmName: z.string().min(2, "Firm name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  credentials: z.string().min(2, "Credentials are required"),
  statesLicensed: z.string().min(2, "States licensed are required"),
  specialties: z.string().min(2, "Specialties are required"),
  message: z.string().optional(),
  smsConsent: z.boolean().refine((val) => val === true, { message: "You must consent to receive text messages and phone calls" }),
});

function JoinNetworkForm() {
  const { submit, isPending } = useContactMutation();
  const [formData, setFormData] = useState({
    firmName: "",
    contactName: "",
    email: "",
    phone: "",
    credentials: "",
    statesLicensed: "",
    specialties: "",
    message: "",
    smsConsent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = joinNetworkSchema.safeParse(formData);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please review your application details and try again.");
      return;
    }

    setFormError(null);
    const message = `[Tax Partner Network Application]
Firm: ${formData.firmName}
Credentials: ${formData.credentials}
States Licensed: ${formData.statesLicensed}
Specialties: ${formData.specialties}
Phone: ${formData.phone}

Additional Info: ${formData.message}`;
    const success = await submit({
      formType: "quick" as const,
      name: formData.contactName,
      email: formData.email,
      message,
      smsConsent: formData.smsConsent,
      website: "",
    });
    if (success) {
      setSubmitted(true);
      return;
    }

    setFormError("We couldn't submit your application. Please try again, or contact us at (541) 319-8654.");
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Application Received</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you for your interest in joining our Tax Partner Network. We'll review your
          application and be in touch within 5 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Firm Name *</label>
        <input
          required
          type="text"
          value={formData.firmName}
          onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all"
          placeholder="Your firm name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Contact Name *</label>
        <input
          required
          type="text"
          value={formData.contactName}
          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all"
          placeholder="Full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all"
          placeholder="you@yourfirm.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all"
          placeholder="(555) 555-5555"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Credentials *</label>
        <input
          required
          type="text"
          value={formData.credentials}
          onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all"
          placeholder="CPA, EA, MST, etc."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">States Licensed In *</label>
        <input
          required
          type="text"
          value={formData.statesLicensed}
          onChange={(e) => setFormData({ ...formData, statesLicensed: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all"
          placeholder="Oregon, Washington, California..."
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-foreground mb-1.5">Specialties *</label>
        <input
          required
          type="text"
          value={formData.specialties}
          onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all"
          placeholder="Crypto, agriculture, multi-entity, individual, etc."
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-foreground mb-1.5">Additional Information</label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all resize-none"
          placeholder="Tell us about your practice and why you'd like to join the network..."
        />
      </div>
      <div className="md:col-span-2">
        <div className="flex items-start gap-3">
          <input
            id="tax-partner-sms-consent"
            type="checkbox"
            checked={formData.smsConsent}
            onChange={(e) => {
              setFormError(null);
              setFormData({ ...formData, smsConsent: e.target.checked });
            }}
            className="mt-1 h-4 w-4 rounded border border-white/20 bg-white/[0.04] accent-accent cursor-pointer shrink-0"
          />
          <label htmlFor="tax-partner-sms-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
            I agree to receive text messages and phone calls from Blueprints &amp; Bookkeeping at my provided contact number. Message and data rates may apply. Reply STOP to opt out.
          </label>
        </div>
      </div>
      {formError && <p className="md:col-span-2 text-destructive text-sm">{formError}</p>}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isPending ? "Submitting..." : "Submit Application"}
          {!isPending && <Send size={16} />}
        </button>
      </div>
    </form>
  );
}

export default function TaxPartners() {
  usePageTitle("Tax Partner Network");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const filteredPartners = useMemo(() => {
    return taxPartners.filter((partner) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          partner.firmName.toLowerCase().includes(q) ||
          partner.contactName.toLowerCase().includes(q) ||
          partner.specialties.some((s) => s.toLowerCase().includes(q)) ||
          partner.credentials.some((c) => c.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      if (selectedState) {
        const coversState =
          partner.nationwide || partner.statesCovered.includes(selectedState);
        if (!coversState) return false;
      }

      if (selectedSpecialty) {
        if (!partner.specialties.includes(selectedSpecialty)) return false;
      }

      if (selectedRegion) {
        if (selectedRegion === "Nationwide") {
          if (!partner.nationwide) return false;
        } else {
          if (partner.region !== selectedRegion) return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedState, selectedSpecialty, selectedRegion]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedSpecialty("");
    setSelectedRegion("");
  };

  const hasActiveFilters = searchQuery || selectedState || selectedSpecialty || selectedRegion;

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="CPA & Tax Referral Partners"
        description="We don't do taxes — but we work closely with trusted CPAs and tax professionals nationwide."
        path="/tax-partners"
      />
      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm mb-8 w-fit mx-auto"
          >
            <Handshake size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Trusted Professionals &mdash; Vetted by Us</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
          >
            Tax Partner{" "}
            <span className="text-gradient">Network</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            While we focus on bookkeeping and business plans, tax season demands specialists.
            Our curated network of vetted, US-based tax professionals ensures a seamless
            handoff — so your financials stay clean from ledger to return.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#directory"
              className="group px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Browse Partners
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#join"
              className="px-8 py-4 rounded-xl bg-white/[0.04] text-white backdrop-blur-sm border border-white/10 font-semibold text-lg hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex items-center justify-center"
            >
              Join the Network
            </a>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Vetted Professionals",
              desc: "Every partner is reviewed for credentials, experience, and client satisfaction before joining the network.",
            },
            {
              icon: <Globe className="w-6 h-6" />,
              title: "50-State Coverage",
              desc: "Regional experts and nationwide firms ensure coverage no matter where your business operates.",
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Seamless Handoff",
              desc: "We coordinate with your tax partner to deliver clean, organized financials ready for filing season.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="accent-bar mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Find a Tax Partner
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Search by state, specialty, or region to find the right tax professional for your needs.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Filter Partners</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-xs text-accent hover:text-accent/80 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all text-sm"
              />
            </div>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground appearance-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all text-sm"
              >
                <option value="">All States</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground appearance-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all text-sm"
              >
                <option value="">All Specialties</option>
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground appearance-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all text-sm"
              >
                <option value="">All Regions</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPartners.length} of {taxPartners.length} partners
          </p>
        </div>

        {filteredPartners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner, index) => (
              <PartnerCard key={partner.id} partner={partner} index={index} />
            ))}
          </div>
        ) : taxPartners.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Handshake size={40} className="text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-bold text-white mb-2">Network Building</h3>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
              We're carefully vetting licensed CPA and EA partners. Use the form below to apply — qualified firms will be listed here once verified.
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Search size={40} className="text-muted-foreground mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-bold text-white mb-2">No Partners Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search filters or browse all partners.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="glass-card rounded-2xl p-8 border border-dashed border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <Handshake className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-white mb-2">How the Handoff Works</h3>
              <p className="text-muted-foreground text-[15px] mb-5">
                Our bookkeeping clients get a seamless experience when tax season arrives. Here's the process:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    step: "01",
                    title: "Clean Books",
                    desc: "We close your books and prepare organized, tax-ready financial statements.",
                  },
                  {
                    step: "02",
                    title: "Partner Match",
                    desc: "We recommend a network partner based on your state, industry, and filing needs.",
                  },
                  {
                    step: "03",
                    title: "Seamless Filing",
                    desc: "Your tax partner receives everything they need — no scrambling, no surprises.",
                  },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-display font-bold text-accent/40 mb-2">{item.step}</div>
                    <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="accent-bar mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Join the Network
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Are you a licensed CPA, EA, or tax professional? Apply to join our vetted partner
            network and receive client referrals year-round.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 pb-8 border-b border-white/[0.06]">
            {[
              {
                icon: <Award className="w-5 h-5" />,
                title: "Credentialed Only",
                desc: "CPA, EA, or equivalent state licensing required.",
              },
              {
                icon: <Building2 className="w-5 h-5" />,
                title: "Active Practice",
                desc: "Must maintain an active, insured tax practice.",
              },
              {
                icon: <CheckCircle2 className="w-5 h-5" />,
                title: "Quality Commitment",
                desc: "Partners agree to our standards of client communication and timeliness.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0">{item.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <JoinNetworkForm />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-3">
            Need Bookkeeping That's Tax-Ready?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our bookkeeping services are designed to make tax season painless. Clean books, organized
            records, and a direct line to trusted tax professionals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-all duration-300 group"
          >
            Get Started with Bookkeeping
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
