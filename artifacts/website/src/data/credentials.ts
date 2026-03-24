import type { ComponentType } from "react";
import {
  Award,
  BadgeCheck,
  Brain,
  Code2,
  FileText,
  Github,
  Linkedin,
  Rss,
  ShieldCheck,
  Zap,
} from "lucide-react";

export type CredentialWithBadge = {
  name: string;
  issuer: string;
  description: string;
  badge: string;
  color: string;
  border: string;
  url?: string;
  verificationNote?: string;
};

export type CredentialWithIcon = {
  name: string;
  issuer: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  border: string;
  url?: string;
  verificationNote?: string;
};

export type CredentialEntry = CredentialWithBadge | CredentialWithIcon;

const base = import.meta.env.BASE_URL;

export const nationalSecurityCerts: CredentialEntry[] = [
  {
    name: "AI + AGI in National Security",
    issuer: "Special Competitive Studies Project (SCSP)",
    description:
      "Rare national security credential covering the geopolitical and strategic implications of AI and AGI — issued by the Special Competitive Studies Project, a US government-chartered advisory commission.",
    badge: `${base}images/badge-scsp-national-security.png`,
    color: "from-blue-600/10 to-indigo-700/5",
    border: "border-blue-500/20",
    url: "https://www.coursera.org/account/accomplishments/badge/5J6FiMaDQQ6ehYjGg7EOAQ",
  },
  {
    name: "AI in National Security: Microcredential",
    issuer: "Special Competitive Studies Project (SCSP)",
    description:
      "Microcredential edition of the SCSP national security AI program — focused applied competencies for professionals working at the intersection of technology, intelligence, and policy.",
    icon: ShieldCheck,
    color: "from-blue-600/10 to-indigo-700/5",
    border: "border-blue-500/20",
    url: "https://www.coursera.org/account/accomplishments/verify/TAIYT5DSJI1U",
  },
];

export const intuitCerts: CredentialWithBadge[] = [
  {
    name: "QuickBooks ProAdvisor — Level 1",
    issuer: "Intuit",
    description:
      "Core QuickBooks Online certification covering client onboarding, transaction management, bank reconciliation, and reporting fundamentals.",
    badge: `${base}images/badge-qb-level1.png`,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
    url: "https://www.credly.com/badges/97b2b906-189e-4921-ba7c-30f4f3334c8f/public_url",
  },
  {
    name: "QuickBooks ProAdvisor — Level 2",
    issuer: "Intuit",
    description:
      "Advanced QuickBooks Online certification covering complex workflows, automation, multi-entity management, and accountant-level tools.",
    badge: `${base}images/badge-qb-level2.png`,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
    url: "https://www.credly.com/badges/cf7b715a-a68b-4384-b5c0-b802bb9234fc/public_url",
  },
  {
    name: "QuickBooks Payroll Certification",
    issuer: "Intuit",
    description:
      "Certification in QuickBooks payroll management covering payroll setup, processing, tax compliance, and reporting.",
    badge: `${base}images/badge-qb-payroll.png`,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
    url: "https://www.credly.com/badges/c400e0bb-4ea5-4744-83da-af7e9bb890c1/public_url",
  },
  {
    name: "Intuit Bookkeeping Certification",
    issuer: "Intuit",
    description:
      "Professional-level bookkeeping certification validating expertise in financial record-keeping, accounts management, and reporting accuracy.",
    badge: `${base}images/badge-intuit-bookkeeping.png`,
    color: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/20",
    url: "https://www.credly.com/badges/e428bd41-b6fa-4a0e-9c90-4a6cbbc2d128/public_url",
  },
  {
    name: "Tax Exam — Level 1",
    issuer: "Intuit",
    description:
      "Foundational tax knowledge certification covering individual and small business tax concepts, preparation principles, and compliance basics.",
    badge: `${base}images/badge-tax-exam-l1.png`,
    color: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/20",
    url: "https://www.credly.com/badges/abc7661b-7147-4ccf-8fce-926ac6d32572/public_url",
  },
];

export const technologyAndSecurityCerts: CredentialEntry[] = [
  {
    name: "Certified Ethical Hacker (CEH) v12",
    issuer: "Coursera / EC-Council",
    description:
      "Three-course specialization covering ethical hacking reconnaissance, system hacking and malware analysis, advanced network attacks, web hacking, and cryptography — directly applied to client data protection.",
    icon: ShieldCheck,
    color: "from-red-500/10 to-rose-500/5",
    border: "border-red-500/20",
    url: "https://www.coursera.org/account/accomplishments/specialization/AFOGOQ19VBCK",
  },
  {
    name: "Foundations of Cybersecurity",
    issuer: "Google",
    description:
      "Google-certified cybersecurity training covering threat landscapes, security frameworks, network defense, and data protection best practices.",
    icon: ShieldCheck,
    color: "from-blue-500/10 to-sky-500/5",
    border: "border-blue-500/20",
    url: "https://www.coursera.org/account/accomplishments/verify/VJ3GY10M8X48",
  },
  {
    name: "Google AI Essentials",
    issuer: "Google",
    description:
      "Foundational AI literacy certification from Google covering AI principles, practical applications, and responsible AI use in professional settings.",
    badge: `${base}images/badge-google-ai.png`,
    color: "from-yellow-500/10 to-amber-500/5",
    border: "border-yellow-500/20",
    url: "https://www.credly.com/badges/e2823194-36dc-4ab3-ab1d-155b9189714f/public_url",
  },
  {
    name: "Foundations of Business Intelligence",
    issuer: "Google",
    description:
      "Google-certified BI training covering data modeling, dashboard design, stakeholder communication, and analytics-driven decision making.",
    icon: Zap,
    color: "from-yellow-500/10 to-amber-500/5",
    border: "border-yellow-500/20",
    url: "https://www.coursera.org/account/accomplishments/verify/E8HX7LY389H8",
  },
  {
    name: "Foundations of Project Management",
    issuer: "Google",
    description:
      "Google-certified project management training covering methodologies, stakeholder management, risk analysis, and Agile frameworks.",
    icon: Award,
    color: "from-yellow-500/10 to-amber-500/5",
    border: "border-yellow-500/20",
    url: "https://www.coursera.org/account/accomplishments/verify/NGLNBSGTPKQ4",
  },
  {
    name: "Economics of Cloud Computing",
    issuer: "Microsoft",
    description:
      "Microsoft-certified training covering cloud economics, cost optimization, infrastructure-as-a-service models, and enterprise cloud migration strategy.",
    icon: Zap,
    color: "from-blue-500/10 to-sky-500/5",
    border: "border-blue-500/20",
    url: "https://learn.microsoft.com/api/achievements/share/en-us/tealarson-hetrick/2DMNZC8V?sharingId=3B49CB782E364529",
  },
  {
    name: "Generative AI Fundamentals",
    issuer: "Databricks",
    description:
      "Databricks Academy accreditation covering large language models, generative AI architecture, prompt engineering, and responsible AI deployment.",
    icon: Brain,
    color: "from-red-500/10 to-orange-500/5",
    border: "border-red-500/20",
    url: "https://credentials.databricks.com/99d6ab70-bf88-49e2-a650-8d7c765fe00d",
  },
];

export const aboutSecurityBadges: CredentialWithBadge[] = [
  {
    name: "Cybersecurity Fundamentals",
    issuer: "IBM",
    description:
      "IBM-issued foundational badge validating practical cybersecurity skills and core security concepts.",
    badge: `${base}images/badge-ibm-cybersecurity.png`,
    color: "from-blue-600/20 to-blue-800/20",
    border: "border-blue-500/20",
    url: "https://www.credly.com/badges/a7bd0f27-6dfa-439c-bbea-3bbac947fd5c/public_url",
  },
  {
    name: "Cybersecurity with Capstone",
    issuer: "IBM",
    description:
      "IBM capstone badge covering applied cybersecurity analysis and practical security workflows.",
    badge: `${base}images/badge-ibm-cybersecurity-capstone.png`,
    color: "from-blue-600/20 to-blue-800/20",
    border: "border-blue-500/20",
    url: "https://www.credly.com/badges/76acb9d5-763f-4768-acf5-5d7bdff90313/public_url",
  },
  {
    name: "IBM Granite Data Classification",
    issuer: "IBM",
    description:
      "IBM-issued badge validating data classification and summarization skills using Granite.",
    badge: `${base}images/badge-ibm-granite.png`,
    color: "from-blue-600/20 to-blue-800/20",
    border: "border-blue-500/20",
    url: "https://www.credly.com/badges/5adba910-e07f-4ad7-ba97-2ffe67a76118/public_url",
  },
  {
    name: "Google AI Essentials",
    issuer: "Google",
    description:
      "Google-issued AI literacy badge focused on practical and responsible AI use.",
    badge: `${base}images/badge-google-ai.png`,
    color: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/20",
    url: "https://www.credly.com/badges/e2823194-36dc-4ab3-ab1d-155b9189714f/public_url",
  },
];

export const specializedCerts: CredentialWithBadge[] = [
  {
    name: "Advanced Crypto Accounting Certified",
    issuer: "Intuit",
    description:
      "Specialized certification covering digital asset taxation, cost-basis methodology, transaction reconciliation, and crypto income reporting.",
    badge: `${base}images/badge-crypto-tax.png`,
    color: "from-orange-500/10 to-amber-500/5",
    border: "border-orange-500/20",
    url: "https://www.credly.com/badges/44179f58-1ad3-4b02-9f5d-6bf2258a3c49/public_url",
  },
  {
    name: "Client Advisory Services Foundations",
    issuer: "Intuit",
    description:
      "Certification in delivering strategic advisory services to clients — moving beyond bookkeeping to actionable financial guidance and business insights.",
    badge: `${base}images/badge-client-advisory.png`,
    color: "from-accent/10 to-primary/5",
    border: "border-accent/20",
    verificationNote: "Public badge link still needs manual confirmation.",
  },
];

export const leadershipCerts = [
  {
    title: "Exercising Leadership: Foundational Principles",
    school: "HarvardX",
    focus: "Leadership communication, influence, and executive presence.",
    url: "https://courses.edx.org/certificates/04f26e09cd414470bebc4a9852865dba",
  },
  {
    title: "Managing Emotions in Times of Uncertainty & Stress",
    school: "Yale University",
    focus:
      "Emotional intelligence and resilience frameworks for high-stakes professional environments.",
    url: "https://www.coursera.org/account/accomplishments/certificate/7MPSBTXW624E",
  },
  {
    title: "Intro to Psychology",
    school: "Yale University",
    focus:
      "Foundational psychology principles covering human behavior, cognition, emotion, and social dynamics.",
    url: "https://coursera.org/share/e9d32ec91ee35b8ad28c00f99aa8dcd7",
  },
  {
    title: "Strategic Innovation and Entrepreneurship",
    school: "University of Illinois",
    focus:
      "Innovation frameworks, entrepreneurial strategy, and growth-stage business planning.",
    url: "https://www.coursera.org/account/accomplishments/records/MVW4VCQQQ9A2",
  },
  {
    title: "Organizational Management Professional",
    school: "Jack Welch Management Institute",
    focus:
      "Leadership strategy, organizational performance, and management excellence.",
  },
  {
    title: "American Negotiation Professional",
    school: "American Negotiation Institute",
    focus:
      "Professional negotiation techniques, conflict resolution, and deal-making strategy.",
  },
  {
    title: "Business Communications",
    school: "Dwayne University",
    focus:
      "Professional written and verbal communication in business contexts.",
  },
  {
    title: "Software Engineer",
    school: "HackerRank",
    focus: "Software engineering skills assessment and certification.",
    url: "https://www.hackerrank.com/certificates/1bcc726ea337",
  },
];

export const footerCredentialBadges = intuitCerts.slice(0, 3);

export const aboutFeaturedBadges: CredentialWithBadge[] = [
  intuitCerts[0],
  intuitCerts[1],
  intuitCerts[2],
  intuitCerts[3],
];

export const academicStudies = [
  "Business",
  "Equine Science",
  "Psychology",
  "Communications",
];

export const researchAndWork = [
  {
    title: "The Graph Protocol — Research Paper",
    outlet: "Published Research",
    description:
      "Published a research paper on The Graph Protocol covering decentralized query infrastructure, subgraph indexing, and network mechanics. Repository hosted on GitHub.",
    icon: FileText,
    color: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-500/20",
  },
  {
    title: "The Graph Sunrise Upgrade Program",
    outlet: "Contributor & Developer",
    description:
      "Active contributor and developer in The Graph's Sunrise upgrade program — working on protocol-level improvements and maintaining open-source tooling for graph querying.",
    icon: Code2,
    color: "from-blue-500/10 to-indigo-500/5",
    border: "border-blue-500/20",
  },
  {
    title: "Artificial Intelligence & Cryptocurrency",
    outlet: "Medium — Two Publications",
    description:
      "Commissioned writer for two Medium publications. Covers artificial intelligence developments, emerging technology, and the evolving cryptocurrency landscape.",
    icon: Rss,
    color: "from-green-500/10 to-emerald-500/5",
    border: "border-green-500/20",
  },
  {
    title: "AI Model Training",
    outlet: "Active Contributor",
    description:
      "Contributes to AI model training and development outside of regular client work — applying domain expertise in finance and language to improve model performance and accuracy.",
    icon: Brain,
    color: "from-amber-500/10 to-yellow-500/5",
    border: "border-amber-500/20",
  },
];

export const professionalProfiles = [
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
