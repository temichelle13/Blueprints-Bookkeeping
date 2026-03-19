import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { ArrowRight, Award, BadgeCheck, ExternalLink, Zap } from "lucide-react";
import {
  academicStudies,
  CredentialEntry,
  CredentialWithBadge,
  CredentialWithIcon,
  intuitCerts,
  leadershipCerts,
  nationalSecurityCerts,
  professionalProfiles,
  researchAndWork,
  specializedCerts,
  technologyAndSecurityCerts,
} from "@/data/credentials";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function CredentialCard({ cert, delay = 0 }: { cert: CredentialEntry; delay?: number }) {
  const content = (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} pointer-events-none`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1 pr-3">
            <h3 className="text-base font-bold text-white mb-1 group-hover:text-accent transition-colors">{cert.name}</h3>
            <p className="text-sm text-accent font-medium">{cert.issuer}</p>
          </div>
          {"badge" in cert ? (
            <img src={(cert as CredentialWithBadge).badge} alt={cert.name} className="w-14 h-14 object-contain shrink-0" loading="lazy" />
          ) : (
            <div className="p-2.5 rounded-xl bg-white/[0.06] shrink-0">
              {(() => {
                const Icon = (cert as CredentialWithIcon).icon;
                return <Icon className="w-5 h-5 text-accent" />;
              })()}
            </div>
          )}
        </div>
        <p className="text-muted-foreground text-[14px] leading-relaxed">{cert.description}</p>
        {cert.verificationNote ? <p className="text-xs text-amber-300/90 mt-4">{cert.verificationNote}</p> : null}
      </div>
    </>
  );

  const commonProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { delay },
    className: `relative glass-card rounded-2xl p-7 border ${cert.border} overflow-hidden group hover:scale-[1.02] transition-all duration-200`,
  };

  return cert.url ? (
    <motion.a href={cert.url} target="_blank" rel="noopener noreferrer" {...commonProps}>
      {content}
    </motion.a>
  ) : (
    <motion.div {...commonProps}>
      {content}
    </motion.div>
  );
}

export default function CredentialsPage() {
  usePageTitle("Credentials & Certifications");

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Credentials & Certifications"
        description="Tea Larson-Hetrick's professional certifications, licenses, and education — QuickBooks ProAdvisor Level 1 & 2, payroll, bookkeeping, cybersecurity, HarvardX, Yale, and more."
        path="/about/credentials"
      />

      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <div className="accent-bar mx-auto mb-6" />
            <p className="text-xs uppercase tracking-[0.24em] text-accent/80 mb-4">About / Credentials</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Credentials &{" "}
              <span className="text-gradient">Certifications</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Public verification links are grouped here so every badge points to the specific issuer page for the credential that was actually earned.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-white font-semibold hover:bg-white/[0.08] transition-colors"
              >
                Back to About
              </Link>
              <a
                href="https://www.credly.com/users/tealarson-hetrick"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-accent/25 bg-accent/10 text-accent font-semibold hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
              >
                Verify on Credly <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div {...fadeUp} className="mb-8">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">Professional Profiles</h2>
          <p className="text-muted-foreground mt-2">Verified across research, development, and publishing platforms.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {professionalProfiles.map((profile, i) => {
            const Icon = profile.icon;
            return (
              <motion.a
                key={profile.label}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`glass-card rounded-2xl p-5 flex items-start gap-4 border ${profile.border} bg-gradient-to-br ${profile.color} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group`}
              >
                <div className={`p-2.5 rounded-xl bg-white/[0.06] shrink-0 ${profile.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-white font-semibold text-sm">{profile.label}</p>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                  </div>
                  <p className="text-accent text-xs font-mono mb-1.5 truncate">{profile.handle}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{profile.description}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">National Security & Strategic Intelligence</h2>
          <p className="text-muted-foreground mt-2">Rare in the financial advisory sector — credentials that signal data discipline and macroeconomic awareness at the highest level.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nationalSecurityCerts.map((cert, i) => (
            <CredentialCard key={cert.name} cert={cert} delay={i * 0.07} />
          ))}
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">QuickBooks & Intuit Certifications</h2>
          <p className="text-muted-foreground mt-2">Mapped to the exact public badge pages for the earned QuickBooks and Intuit credentials.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {intuitCerts.map((cert, i) => (
            <CredentialCard key={cert.name} cert={cert} delay={i * 0.07} />
          ))}
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">Technology & Security</h2>
          <p className="text-muted-foreground mt-2">Cybersecurity-trained, cloud-certified, and current on AI tools.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologyAndSecurityCerts.map((cert, i) => (
            <CredentialCard key={cert.name} cert={cert} delay={i * 0.07} />
          ))}
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">Leadership & Professional Development</h2>
          <p className="text-muted-foreground mt-2">Certifications in management, communication, strategy, and negotiation.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leadershipCerts.map((cert, i) => {
            const inner = (
              <>
                <div className="p-3 rounded-xl bg-accent/10 text-accent h-fit shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors">{cert.title}</h3>
                    {cert.url ? <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" /> : null}
                  </div>
                  <p className="text-accent text-sm font-medium mb-3">{cert.school}</p>
                  <p className="text-muted-foreground text-[14px] leading-relaxed">{cert.focus}</p>
                </div>
              </>
            );
            return cert.url ? (
              <motion.a
                key={cert.school + cert.title}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-7 flex gap-5 group hover:scale-[1.02] transition-all duration-200"
              >
                {inner}
              </motion.a>
            ) : (
              <motion.div
                key={cert.school + cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-7 flex gap-5 group"
              >
                {inner}
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fadeUp} className="mt-6 glass-card rounded-2xl p-6 border border-accent/10 flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-accent/10 shrink-0 mt-0.5">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm mb-1">Always Learning</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Currently active in school and continuously pursuing certifications, technology education, and professional development. ProAdvisor certifications are actively maintained. More credentials are being added as they are earned.
            </p>
          </div>
        </motion.div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">Research, Writing & Active Work</h2>
          <p className="text-muted-foreground mt-2">Published research, open-source contributions, and work beyond the day-to-day.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchAndWork.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card rounded-2xl p-7 flex gap-5 bg-gradient-to-br ${item.color} border ${item.border}`}
              >
                <div className="p-3 rounded-xl bg-accent/10 text-accent h-fit shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-accent text-sm font-medium mb-3">{item.outlet}</p>
                  <p className="text-muted-foreground text-[14px] leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">Academic Background</h2>
          <p className="text-muted-foreground mt-2">Areas of study across multiple institutions.</p>
        </motion.div>

        <div className="flex flex-wrap gap-4">
          {academicStudies.map((subject, i) => (
            <motion.div
              key={subject}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl px-6 py-4 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <p className="text-foreground font-medium text-[15px]">{subject}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <motion.div {...fadeUp} className="mb-10">
          <div className="accent-bar mb-4" />
          <h2 className="text-2xl font-display font-bold text-white">Specialized Services</h2>
          <p className="text-muted-foreground mt-2">Advanced certifications for niche financial services.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specializedCerts.map((cert, i) => (
            <CredentialCard key={cert.name} cert={cert} delay={i * 0.07} />
          ))}
        </div>
      </section>

      <div className="glow-line max-w-5xl mx-auto" />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-20 text-center">
        <motion.div {...fadeUp}>
          <a
            href="https://www.credly.com/users/tealarson-hetrick"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent/10 border border-accent/25 text-accent font-bold rounded-xl hover:bg-accent hover:text-white hover:border-accent hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
          >
            <BadgeCheck size={20} />
            Verify My Credentials on Credly
            <ExternalLink size={16} />
          </a>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="relative rounded-2xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10" />
          <div className="absolute inset-[1px] rounded-2xl bg-card" />
          <div className="absolute inset-0 border border-accent/15 rounded-2xl" />
          <div className="relative">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to work with a verified specialist?</h2>
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
