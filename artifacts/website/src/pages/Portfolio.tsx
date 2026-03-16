import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { ArrowRight, BadgeCheck, GraduationCap, ShieldCheck, BookOpen, Award, Briefcase, Brain } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const intuitCerts = [
  {
    name: "QuickBooks ProAdvisor — Level 1",
    issuer: "Intuit",
    description: "Core QuickBooks Online certification covering client onboarding, transaction management, bank reconciliation, and reporting fundamentals.",
    badge: `${import.meta.env.BASE_URL}images/proadvisor-gold-badge.png`,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
  },
  {
    name: "QuickBooks ProAdvisor — Level 2",
    issuer: "Intuit",
    description: "Advanced QuickBooks Online certification covering complex workflows, automation, multi-entity management, and accountant-level tools.",
    badge: `${import.meta.env.BASE_URL}images/intuit-proadvisor-badge-tier-gold.png`,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
  },
  {
    name: "Certified Bookkeeping Professional",
    issuer: "Intuit",
    description: "Professional-level bookkeeping certification validating expertise in financial record-keeping, accounts management, and reporting accuracy.",
    icon: BookOpen,
    color: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/20",
  },
  {
    name: "Tax Exam — Level 1",
    issuer: "Intuit",
    description: "Foundational tax knowledge certification covering individual and small business tax concepts, preparation principles, and compliance basics.",
    icon: BookOpen,
    color: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/20",
  },
  {
    name: "Crypto Tax Certification",
    issuer: "Intuit",
    description: "Specialized certification covering digital asset taxation, cost-basis methodology, transaction reconciliation, and crypto income reporting.",
    icon: BookOpen,
    color: "from-orange-500/10 to-amber-500/5",
    border: "border-orange-500/20",
  },
  {
    name: "Client Advisory Services",
    issuer: "Intuit",
    description: "Certification in delivering strategic advisory services to clients — moving beyond bookkeeping to actionable financial guidance and business insights.",
    icon: Briefcase,
    color: "from-accent/10 to-primary/5",
    border: "border-accent/20",
  },
];

const licensesAndTech = [
  {
    name: "Oregon Remote Online Notary (RON)",
    issuer: "Oregon Secretary of State",
    description: "State-approved remote online notarization. Legally binding document notarization for clients anywhere — no in-person visit required.",
    icon: BadgeCheck,
    color: "from-accent/10 to-primary/5",
    border: "border-accent/20",
  },
  {
    name: "Oregon Notary Public Commission",
    issuer: "Oregon Secretary of State",
    description: "Active in-person notary commission for the State of Oregon.",
    icon: BadgeCheck,
    color: "from-accent/10 to-primary/5",
    border: "border-accent/20",
  },
  {
    name: "Ethical Hacking",
    issuer: "PACKT",
    description: "Cybersecurity training covering penetration testing, vulnerability assessment, and ethical hacking techniques — directly applied to client data protection and infrastructure security.",
    icon: ShieldCheck,
    color: "from-red-500/10 to-rose-500/5",
    border: "border-red-500/20",
  },
  {
    name: "Cybersecurity Foundations",
    issuer: "Microsoft",
    description: "Microsoft-certified foundational cybersecurity training covering threat landscapes, security controls, identity management, and data protection best practices.",
    icon: ShieldCheck,
    color: "from-blue-500/10 to-sky-500/5",
    border: "border-blue-500/20",
  },
  {
    name: "Google AI Essentials",
    issuer: "Google",
    description: "Foundational AI literacy certification from Google covering AI principles, practical applications, and responsible AI use in professional settings.",
    icon: Brain,
    color: "from-yellow-500/10 to-amber-500/5",
    border: "border-yellow-500/20",
  },
];

const leadershipCerts = [
  {
    degree: "Organizational Management Professional",
    school: "Jack Welch Management Institute",
    focus: "Leadership strategy, organizational performance, and management excellence based on the Jack Welch framework.",
  },
  {
    degree: "American Negotiation Professional",
    school: "American Negotiation Institute",
    focus: "Professional negotiation techniques, conflict resolution, and deal-making strategy.",
  },
  {
    degree: "Communications and Leadership",
    school: "HarvardX",
    focus: "Leadership communication, influence, and executive presence from Harvard's online platform.",
  },
  {
    degree: "Strategic Innovation and Entrepreneurship",
    school: "University of Illinois",
    focus: "Innovation frameworks, entrepreneurial strategy, and growth-stage business planning.",
  },
  {
    degree: "Business Communications",
    school: "Dwayne University",
    focus: "Professional written and verbal communication in business contexts.",
  },
];

export default function Portfolio() {
  usePageTitle("Credentials & Certifications");

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Credentials & Certifications"
        description="Tea Larson-Hetrick's professional certifications, licenses, and continuing education — QuickBooks ProAdvisor, Certified Bookkeeping Professional, Oregon Notary, and more."
        path="/portfolio"
      />

      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <div className="accent-bar mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Credentials &{" "}
              <span className="text-gradient">Certifications</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every certification is active and maintained. You're not hiring a generalist — you're working with a specialist who has the credentials to prove it.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">QuickBooks & Intuit Certifications</h2>
          <p className="text-muted-foreground mt-2">Intuit-certified across bookkeeping, tax, crypto, and advisory services.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {intuitCerts.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative glass-card rounded-2xl p-7 border ${cert.border} overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} pointer-events-none`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-3">
                    <h3 className="text-base font-bold text-white mb-1">{cert.name}</h3>
                    <p className="text-sm text-accent font-medium">{cert.issuer}</p>
                  </div>
                  {"badge" in cert && cert.badge ? (
                    <img
                      src={cert.badge as string}
                      alt={cert.name}
                      className="w-14 h-14 object-contain shrink-0"
                    />
                  ) : (
                    "icon" in cert && cert.icon && (
                      <div className="p-2.5 rounded-xl bg-white/[0.06]">
                        <cert.icon className="w-5 h-5 text-accent" />
                      </div>
                    )
                  )}
                </div>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">Licenses, Technology & Security</h2>
          <p className="text-muted-foreground mt-2">State-licensed notary, cybersecurity-trained, and current on AI tools.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {licensesAndTech.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative glass-card rounded-2xl p-7 border ${cert.border} overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} pointer-events-none`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-3">
                    <h3 className="text-base font-bold text-white mb-1">{cert.name}</h3>
                    <p className="text-sm text-accent font-medium">{cert.issuer}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.06] shrink-0">
                    <cert.icon className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">Leadership & Professional Development</h2>
          <p className="text-muted-foreground mt-2">Certifications and coursework in management, communication, strategy, and negotiation.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leadershipCerts.map((ed, i) => (
            <motion.div
              key={ed.school + ed.degree}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-7 flex gap-5"
            >
              <div className="p-3 rounded-xl bg-accent/10 text-accent h-fit shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">{ed.degree}</h3>
                <p className="text-accent text-sm font-medium mb-3">{ed.school}</p>
                <p className="text-muted-foreground text-[14px] leading-relaxed">{ed.focus}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...fadeUp}
          className="mt-6 glass-card rounded-2xl p-6 border border-accent/10 flex items-center gap-4"
        >
          <div className="p-2.5 rounded-xl bg-accent/10 shrink-0">
            <GraduationCap className="w-5 h-5 text-accent" />
          </div>
          <p className="text-muted-foreground text-sm">
            Additional certifications are being compiled and will be added here shortly.
          </p>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="relative rounded-2xl p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10" />
          <div className="absolute inset-[1px] rounded-2xl bg-card" />
          <div className="absolute inset-0 border border-accent/15 rounded-2xl" />
          <div className="relative">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Ready to work with a verified specialist?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Book a free 30-minute discovery call — no sales pitch, just an honest look at your needs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
            >
              Get in Touch <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
