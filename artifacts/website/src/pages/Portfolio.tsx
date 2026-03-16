import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { ArrowRight, BadgeCheck, GraduationCap, ShieldCheck, Award, Brain, FileText, Code2, Rss, Zap, Linkedin, Github, ExternalLink } from "lucide-react";

type CertWithBadge = {
  name: string;
  issuer: string;
  description: string;
  badge: string;
  color: string;
  border: string;
  url: string;
};

type CertWithIcon = {
  name: string;
  issuer: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  border: string;
  url: string;
};

type CertEntry = CertWithBadge | CertWithIcon;

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
    badge: `${import.meta.env.BASE_URL}images/badge-qb-level1.png`,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
    url: "https://www.credly.com/badges/c400e0bb-4ea5-4744-83da-af7e9bb890c1/public_url",
  },
  {
    name: "QuickBooks ProAdvisor — Level 2",
    issuer: "Intuit",
    description: "Advanced QuickBooks Online certification covering complex workflows, automation, multi-entity management, and accountant-level tools.",
    badge: `${import.meta.env.BASE_URL}images/badge-qb-level2.png`,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
    url: "https://www.credly.com/badges/76acb9d5-763f-4768-acf5-5d7bdff90313/public_url",
  },
  {
    name: "QuickBooks Payroll Certification",
    issuer: "Intuit",
    description: "Certification in QuickBooks payroll management covering payroll setup, processing, tax compliance, and reporting.",
    badge: `${import.meta.env.BASE_URL}images/badge-qb-payroll.png`,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
    url: "https://www.credly.com/badges/5adba910-e07f-4ad7-ba97-2ffe67a76118/public_url",
  },
  {
    name: "Certified Bookkeeping Professional",
    issuer: "Intuit",
    description: "Professional-level bookkeeping certification validating expertise in financial record-keeping, accounts management, and reporting accuracy.",
    badge: `${import.meta.env.BASE_URL}images/badge-intuit-bookkeeping.png`,
    color: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/20",
    url: "https://www.credly.com/badges/e2823194-36dc-4ab3-ab1d-155b9189714f/public_url",
  },
  {
    name: "Tax Exam — Level 1",
    issuer: "Intuit",
    description: "Foundational tax knowledge certification covering individual and small business tax concepts, preparation principles, and compliance basics.",
    badge: `${import.meta.env.BASE_URL}images/badge-tax-exam-l1.png`,
    color: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/20",
    url: "https://www.credly.com/users/tealarson-hetrick",
  },
];

const licensesAndTech: CertEntry[] = [
  {
    name: "Ethical Hacking",
    issuer: "PACKT",
    description: "Cybersecurity training covering penetration testing, vulnerability assessment, and ethical hacking techniques — directly applied to client data protection and infrastructure security.",
    icon: ShieldCheck,
    color: "from-red-500/10 to-rose-500/5",
    border: "border-red-500/20",
    url: "https://www.credly.com/users/tealarson-hetrick",
  },
  {
    name: "Cybersecurity Foundations",
    issuer: "Microsoft",
    description: "Microsoft-certified foundational cybersecurity training covering threat landscapes, security controls, identity management, and data protection best practices.",
    icon: ShieldCheck,
    color: "from-blue-500/10 to-sky-500/5",
    border: "border-blue-500/20",
    url: "https://www.credly.com/users/tealarson-hetrick",
  },
  {
    name: "Google AI Essentials",
    issuer: "Google",
    description: "Foundational AI literacy certification from Google covering AI principles, practical applications, and responsible AI use in professional settings.",
    badge: `${import.meta.env.BASE_URL}images/badge-google-ai.png`,
    color: "from-yellow-500/10 to-amber-500/5",
    border: "border-yellow-500/20",
    url: "https://www.credly.com/badges/97b2b906-189e-4921-ba7c-30f4f3334c8f/public_url",
  },
];

const specializedCerts = [
  {
    name: "Cryptocurrency Tax Certification",
    issuer: "Intuit",
    description: "Specialized certification covering digital asset taxation, cost-basis methodology, transaction reconciliation, and crypto income reporting.",
    badge: `${import.meta.env.BASE_URL}images/badge-crypto-tax.png`,
    color: "from-orange-500/10 to-amber-500/5",
    border: "border-orange-500/20",
    url: "https://www.credly.com/badges/cf7b715a-a68b-4384-b5c0-b802bb9234fc/public_url",
  },
  {
    name: "Client Advisory Services Foundations",
    issuer: "Intuit",
    description: "Certification in delivering strategic advisory services to clients — moving beyond bookkeeping to actionable financial guidance and business insights.",
    badge: `${import.meta.env.BASE_URL}images/badge-client-advisory.png`,
    color: "from-accent/10 to-primary/5",
    border: "border-accent/20",
    url: "https://www.credly.com/badges/a7bd0f27-6dfa-439c-bbea-3bbac947fd5c/public_url",
  },
];

const leadershipCerts = [
  {
    title: "Organizational Management Professional",
    school: "Jack Welch Management Institute",
    focus: "Leadership strategy, organizational performance, and management excellence.",
  },
  {
    title: "American Negotiation Professional",
    school: "American Negotiation Institute",
    focus: "Professional negotiation techniques, conflict resolution, and deal-making strategy.",
  },
  {
    title: "Communications and Leadership",
    school: "HarvardX",
    focus: "Leadership communication, influence, and executive presence.",
  },
  {
    title: "Intro to Psychology",
    school: "Yale University",
    focus: "Foundational psychology principles covering human behavior, cognition, emotion, and social dynamics.",
  },
  {
    title: "Strategic Innovation and Entrepreneurship",
    school: "University of Illinois",
    focus: "Innovation frameworks, entrepreneurial strategy, and growth-stage business planning.",
  },
  {
    title: "Business Communications",
    school: "Dwayne University",
    focus: "Professional written and verbal communication in business contexts.",
  },
  {
    title: "Software Engineer",
    school: "HackerRank",
    focus: "Software engineering skills assessment and certification.",
  },
];

const academicStudies = [
  "Business",
  "Equine Science",
  "Psychology",
  "Communications",
];

const researchAndWork = [
  {
    title: "The Graph Protocol — Research Paper",
    outlet: "Published Research",
    description: "Published a research paper on The Graph Protocol covering decentralized query infrastructure, subgraph indexing, and network mechanics. Repository hosted on GitHub.",
    icon: FileText,
    color: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-500/20",
  },
  {
    title: "The Graph Sunrise Upgrade Program",
    outlet: "Contributor & Developer",
    description: "Active contributor and developer in The Graph's Sunrise upgrade program — working on protocol-level improvements and maintaining open-source tooling for graph querying.",
    icon: Code2,
    color: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/20",
  },
  {
    title: "Artificial Intelligence & Cryptocurrency",
    outlet: "Medium — Two Publications",
    description: "Commissioned writer for two Medium publications. Covers artificial intelligence developments, emerging technology, and the evolving cryptocurrency landscape.",
    icon: Rss,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
  },
  {
    title: "AI Model Training",
    outlet: "Active Contributor",
    description: "Contributes to AI model training and development outside of regular client work — applying domain expertise in finance and language to improve model performance and accuracy.",
    icon: Brain,
    color: "from-amber-500/10 to-yellow-500/5",
    border: "border-amber-500/20",
  },
];

const professionalProfiles = [
  {
    label: "LinkedIn",
    handle: "tealarson-hetrick",
    url: "https://linkedin.com/in/tealarson-hetrick",
    description: "Professional profile, endorsements, and work history",
    icon: Linkedin,
    color: "from-blue-600/10 to-blue-500/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    label: "GitHub",
    handle: "temichelle13",
    url: "https://github.com/temichelle13",
    description: "Open-source repositories and technical contributions",
    icon: Github,
    color: "from-slate-500/10 to-slate-400/5",
    border: "border-slate-400/20",
    iconColor: "text-slate-300",
  },
  {
    label: "ORCID",
    handle: "0009-0001-9240-7160",
    url: "https://orcid.org/0009-0001-9240-7160",
    description: "Verified researcher identity and publication record",
    icon: BadgeCheck,
    color: "from-green-600/10 to-green-500/5",
    border: "border-green-500/20",
    iconColor: "text-green-400",
  },
  {
    label: "Medium",
    handle: "@tealarson-hetrick",
    url: "https://medium.com/@tealarson-hetrick",
    description: "Published writing on AI and cryptocurrency",
    icon: Rss,
    color: "from-stone-400/10 to-stone-300/5",
    border: "border-stone-400/20",
    iconColor: "text-stone-300",
  },
  {
    label: "ResearchGate",
    handle: "Tea-Larson-Hetrick",
    url: "https://www.researchgate.net/profile/Tea-Larson-Hetrick",
    description: "Academic research profile and published papers",
    icon: FileText,
    color: "from-teal-600/10 to-teal-500/5",
    border: "border-teal-500/20",
    iconColor: "text-teal-400",
  },
  {
    label: "Google Developer",
    handle: "tealarson-hetrick",
    url: "https://g.dev/tealarson-hetrick",
    description: "Google developer profile and technology work",
    icon: Code2,
    color: "from-yellow-500/10 to-amber-500/5",
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
  },
];

export default function Portfolio() {
  usePageTitle("Credentials & Certifications");

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Credentials & Certifications"
        description="Tea Larson-Hetrick's professional certifications, licenses, and education — QuickBooks ProAdvisor Level 1 & 2, Certified Bookkeeping Professional, Certified Ethical Hacker, HarvardX, Yale, and more."
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
          <h2 className="text-2xl font-display font-bold text-white">QuickBooks & Intuit Certifications</h2>
          <p className="text-muted-foreground mt-2">Intuit-certified across bookkeeping, tax, crypto, and advisory services.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {intuitCerts.map((cert, i) => (
            <motion.a
              key={cert.name}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative glass-card rounded-2xl p-7 border ${cert.border} overflow-hidden group hover:scale-[1.02] transition-all duration-200`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} pointer-events-none`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-3">
                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-accent transition-colors">{cert.name}</h3>
                    <p className="text-sm text-accent font-medium">{cert.issuer}</p>
                  </div>
                  {cert.badge ? (
                    <img
                      src={cert.badge}
                      alt={cert.name}
                      className="w-14 h-14 object-contain shrink-0"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </motion.a>
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
            <motion.a
              key={cert.name}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative glass-card rounded-2xl p-7 border ${cert.border} overflow-hidden group hover:scale-[1.02] transition-all duration-200`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} pointer-events-none`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-3">
                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-accent transition-colors">{cert.name}</h3>
                    <p className="text-sm text-accent font-medium">{cert.issuer}</p>
                  </div>
                  {"badge" in cert ? (
                    <img src={(cert as CertWithBadge).badge} alt={cert.name} className="w-14 h-14 object-contain shrink-0" loading="lazy" />
                  ) : (
                    <div className="p-2.5 rounded-xl bg-white/[0.06] shrink-0">
                      {(() => { const Icon = (cert as CertWithIcon).icon; return <Icon className="w-5 h-5 text-accent" />; })()}
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </motion.a>
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
          {leadershipCerts.map((cert, i) => (
            <motion.div
              key={cert.school + cert.title}
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
                <h3 className="text-base font-bold text-white mb-1">{cert.title}</h3>
                <p className="text-accent text-sm font-medium mb-3">{cert.school}</p>
                <p className="text-muted-foreground text-[14px] leading-relaxed">{cert.focus}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...fadeUp}
          className="mt-6 glass-card rounded-2xl p-6 border border-accent/10 flex items-start gap-4"
        >
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
            <motion.a
              key={cert.name}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative glass-card rounded-2xl p-7 border ${cert.border} overflow-hidden group hover:scale-[1.02] transition-all duration-200`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} pointer-events-none`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-3">
                    <h3 className="text-base font-bold text-white mb-1 group-hover:text-accent transition-colors">{cert.name}</h3>
                    <p className="text-sm text-accent font-medium">{cert.issuer}</p>
                  </div>
                  <img src={cert.badge} alt={cert.name} className="w-14 h-14 object-contain shrink-0" loading="lazy" />
                </div>
                <p className="text-muted-foreground text-[14px] leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </motion.a>
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
