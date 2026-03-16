import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { ArrowRight, BadgeCheck, GraduationCap, ShieldCheck, BookOpen } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const certifications = [
  {
    name: "QuickBooks ProAdvisor Gold",
    issuer: "Intuit",
    description: "Advanced QuickBooks Online certification covering complex setups, automation, multi-entity management, and accountant workflows. Gold tier reflects ongoing continuing education.",
    badge: `${import.meta.env.BASE_URL}images/proadvisor-gold-badge.png`,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
  },
  {
    name: "Certified Ethical Hacker v12",
    issuer: "EC-Council",
    description: "Enterprise-grade cybersecurity certification. Directly applied to client data protection — no offshore labor, encrypted document handling, and secure client portal infrastructure.",
    icon: ShieldCheck,
    color: "from-red-500/10 to-rose-500/5",
    border: "border-red-500/20",
  },
  {
    name: "Advanced Crypto Accounting Certified",
    issuer: "Crypto Accounting Certification Program",
    description: "Specialized certification covering ASU 2023-08 compliance, FIFO/LIFO cost-basis methodology, DeFi transaction reconciliation, staking income treatment, and digital asset tax readiness.",
    icon: BookOpen,
    color: "from-orange-500/10 to-amber-500/5",
    border: "border-orange-500/20",
  },
  {
    name: "Oregon Remote Online Notary (RON)",
    issuer: "Oregon Secretary of State — RON Approved",
    description: "State-approved remote online notarization. Allows secure, legally binding document notarization for clients anywhere — no in-person visit required for engagement letters or contracts.",
    icon: BadgeCheck,
    color: "from-accent/10 to-primary/5",
    border: "border-accent/20",
  },
];

const education = [
  {
    degree: "MBA Coursework",
    school: "Walden University",
    focus: "Business strategy, financial management, and organizational leadership.",
  },
  {
    degree: "Business Administration Studies",
    school: "St. Andrews University",
    focus: "International business and financial systems.",
  },
];

const continuingEd = [
  "Advanced financial modeling and forecasting",
  "Business plan structure and financial documentation standards",
  "Multi-entity tax structure and consolidation",
  "Agriculture & timber accounting (Schedule F)",
  "Cybersecurity for financial data and cloud infrastructure",
  "Digital asset compliance and blockchain transaction analysis",
];

export default function Portfolio() {
  usePageTitle("Credentials & Certifications");

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Credentials & Certifications"
        description="Tea Larson-Hetrick's professional certifications, education, and continuing education — QuickBooks ProAdvisor Gold, CEH v12, Advanced Crypto Accounting, and Oregon RON Notary."
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
          <h2 className="text-2xl font-display font-bold text-white">Professional Certifications</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative glass-card rounded-2xl p-8 border ${cert.border} overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} pointer-events-none`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{cert.name}</h3>
                    <p className="text-sm text-accent font-medium">{cert.issuer}</p>
                  </div>
                  {cert.badge ? (
                    <img
                      src={cert.badge}
                      alt={cert.name}
                      className="w-16 h-16 object-contain shrink-0"
                    />
                  ) : (
                    cert.icon && (
                      <div className="p-3 rounded-xl bg-white/[0.06]">
                        <cert.icon className="w-7 h-7 text-accent" />
                      </div>
                    )
                  )}
                </div>
                <p className="text-muted-foreground text-[15px] leading-relaxed">
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
          <h2 className="text-2xl font-display font-bold text-white">Education</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((ed, i) => (
            <motion.div
              key={ed.school}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-8 flex gap-5"
            >
              <div className="p-3 rounded-xl bg-accent/10 text-accent h-fit shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{ed.degree}</h3>
                <p className="text-accent text-sm font-medium mb-3">{ed.school}</p>
                <p className="text-muted-foreground text-[15px] leading-relaxed">{ed.focus}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">Continuing Education</h2>
          <p className="text-muted-foreground mt-2">Active areas of professional development beyond base certifications.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {continuingEd.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-xl px-5 py-4 flex items-start gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
              <p className="text-foreground text-[15px] leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
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
              Book a free 30-minute discovery call — no sales pitch, just an honest look at your books.
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
