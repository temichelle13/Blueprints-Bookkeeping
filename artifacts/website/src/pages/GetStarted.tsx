import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CreditCard, UserCheck, CalendarDays, MessageSquare, ArrowRight, BookOpen, FileText, Building2, HelpCircle, Send, CheckCircle } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const STRIPE_CONFIGURED = !!import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export default function GetStarted() {
  usePageTitle("Get Started — Blueprints & Bookkeeping");

  const [otherName, setOtherName] = useState("");
  const [otherEmail, setOtherEmail] = useState("");
  const [otherMessage, setOtherMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleOtherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otherMessage.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: otherName || "Not provided",
          email: otherEmail || "",
          page: "Get Started",
          category: "other",
          description: otherMessage,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong — please email tea@blueprintsandbookkeeping.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const paths = [
    {
      icon: CreditCard,
      color: "#6366F1",
      badge: "FASTEST",
      title: STRIPE_CONFIGURED ? "Sign Up Online" : "Get Started",
      subtitle: "For Essentials or Growth bookkeeping",
      description: STRIPE_CONFIGURED
        ? "Choose your tier, complete checkout, and submit your onboarding intake form — all in one visit. Contracts are sent automatically and you'll have access to the client portal immediately."
        : "Review our plans and pricing, then reach out to get started. Contracts are sent after your discovery call and you'll have access to the client portal right away.",
      steps: STRIPE_CONFIGURED
        ? [
            "Pick Essentials ($500/mo) or Growth ($900/mo)",
            "Checkout securely via Stripe",
            "Complete your intake form",
            "Receive & sign contracts",
            "Upload your first documents",
          ]
        : [
            "Review Essentials ($500/mo) or Growth ($900/mo)",
            "Book a quick discovery call or send your info",
            "Complete your intake form",
            "Receive & sign contracts",
            "Upload your first documents",
          ],
      cta: STRIPE_CONFIGURED ? "View Plans & Pricing" : "Get in Touch to Get Started",
      href: STRIPE_CONFIGURED ? "/pricing" : "/contact",
      external: false,
      primary: true,
    },
    {
      icon: UserCheck,
      color: "#10B981",
      badge: "EXISTING QB USERS",
      title: "Already Have QuickBooks?",
      subtitle: "Connect your existing account to Tea's firm",
      description:
        "If you're already on QuickBooks Online, skip the setup — we'll connect to your existing company file. Complete the intake form and Tea will send you a QuickBooks accountant invitation.",
      steps: [
        "Fill out the intake form",
        "Tea sends a QuickBooks accountant invite",
        "Accept the invite in QBO (takes 2 minutes)",
        "Sign your engagement letter",
        "Clean-up and handoff begins",
      ],
      cta: "Start Intake Form",
      href: "/onboarding",
      external: false,
      primary: false,
    },
    {
      icon: MessageSquare,
      color: "#F59E0B",
      badge: "NO COMMITMENT",
      title: "Leave Your Info",
      subtitle: "Tea will reach out within one business day",
      description:
        "Not ready to commit yet? Just drop your name, email, and what you're working on. Tea will reach out personally to answer questions and figure out the best fit — no sales pressure.",
      steps: [
        "Fill out a quick form",
        "Tea reviews your info",
        "Personal follow-up within 1 business day",
        "No calls required unless you want one",
      ],
      cta: "Send Your Info",
      href: "/contact",
      external: false,
      primary: false,
    },
    {
      icon: CalendarDays,
      color: "#8B5CF6",
      badge: "RECOMMENDED FOR ADVANCED",
      title: "Book a Discovery Call",
      subtitle: "30 minutes, free, no obligation",
      description:
        "Best for Advanced bookkeeping, Business Plans, or complex situations (multi-entity, crypto). We'll learn about your business together and build a custom scope and quote.",
      steps: [
        "Pick a time that works for you",
        "30-min video or phone call with Tea",
        "Walk through your current situation",
        "Get a custom scope and pricing",
        "Move forward when ready",
      ],
      cta: "Book a Free Call",
      href: "https://calendly.com/tea-blueprintsandbookkeeping/30min",
      external: true,
      primary: false,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-muted-foreground outline-none transition-all";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
  };
  const inputFocusStyle = {
    borderColor: "rgba(99,102,241,0.5)",
    boxShadow: "0 0 0 2px rgba(99,102,241,0.1)",
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <SEO
        title="Get Started"
        description="Choose how to begin your bookkeeping or business plan engagement. Book a call, connect your QuickBooks, or leave your info."
        path="/get-started"
      />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-6 text-sm font-medium text-accent">
            <span className="glow-dot" />
            You choose how to start
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4">
            Get Started Your Way
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {STRIPE_CONFIGURED
              ? "No single path required. Sign up online in minutes, connect your existing QuickBooks, leave your info for a callback, or book a call for complex situations."
              : "No single path required. Review our plans, connect your existing QuickBooks, leave your info for a callback, or book a call for complex situations."}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        >
          {paths.map((path) => (
            <motion.div
              key={path.title}
              variants={item}
              style={{
                background: path.primary
                  ? "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))"
                  : "#161B2E",
                border: path.primary ? "1px solid rgba(99,102,241,0.4)" : "1px solid #252B3D",
                borderRadius: 16,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {path.primary && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "linear-gradient(90deg, #6366F1, #818CF8)",
                  }}
                />
              )}

              <div className="flex items-start justify-between mb-5">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${path.color}18`,
                    border: `1px solid ${path.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <path.icon size={22} style={{ color: path.color }} />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: path.color,
                    background: `${path.color}15`,
                    border: `1px solid ${path.color}30`,
                    borderRadius: 20,
                    padding: "3px 10px",
                  }}
                >
                  {path.badge}
                </span>
              </div>

              <h2 className="text-xl font-display font-bold text-white mb-1">{path.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">{path.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{path.description}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {path.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: `${path.color}18`,
                        border: `1px solid ${path.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 10,
                        fontWeight: 700,
                        color: path.color,
                        marginTop: 1,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ul>

              {path.external ? (
                <a
                  href={path.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 20px",
                    borderRadius: 10,
                    background: path.primary ? "#6366F1" : `${path.color}18`,
                    border: path.primary ? "none" : `1px solid ${path.color}30`,
                    color: path.primary ? "white" : path.color,
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {path.cta}
                  <ArrowRight size={16} />
                </a>
              ) : (
                <Link
                  href={path.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 20px",
                    borderRadius: 10,
                    background: path.primary ? "#6366F1" : `${path.color}18`,
                    border: path.primary ? "none" : `1px solid ${path.color}30`,
                    color: path.primary ? "white" : path.color,
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {path.cta}
                  <ArrowRight size={16} />
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            background: "#161B2E",
            border: "1px solid #252B3D",
            borderRadius: 16,
            padding: "32px",
            marginBottom: 24,
          }}
        >
          <div className="flex items-start gap-3 mb-5">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(139,145,160,0.1)",
                border: "1px solid rgba(139,145,160,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HelpCircle size={18} className="text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white mb-0.5">Something else?</h2>
              <p className="text-sm text-muted-foreground">
                None of the above quite fits — tell us what you're working on in your own words and Tea will reach out.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="flex items-center gap-3 py-4 px-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle size={18} className="text-emerald-400 shrink-0" />
              <p className="text-sm text-emerald-300">
                Got it — Tea will follow up with you within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleOtherSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="gs-other-name" className="sr-only">Your name (optional)</label>
                  <input
                    id="gs-other-name"
                    type="text"
                    placeholder="Your name (optional)"
                    value={otherName}
                    onChange={(e) => setOtherName(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                  />
                </div>
                <div>
                  <label htmlFor="gs-other-email" className="sr-only">Your email</label>
                  <input
                    id="gs-other-email"
                    type="email"
                    placeholder="Your email (so Tea can reply)"
                    value={otherEmail}
                    onChange={(e) => setOtherEmail(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                  />
                </div>
              </div>
              <label htmlFor="gs-other-message" className="sr-only">Describe your situation</label>
              <textarea
                id="gs-other-message"
                placeholder="Describe your situation — business type, what you need, any questions. No right or wrong answer."
                value={otherMessage}
                onChange={(e) => setOtherMessage(e.target.value)}
                rows={4}
                required
                className={inputClass}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, ...inputFocusStyle })}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
              {error && <p role="alert" className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={submitting || !otherMessage.trim()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 22px",
                  borderRadius: 10,
                  background: submitting || !otherMessage.trim() ? "rgba(99,102,241,0.3)" : "#6366F1",
                  border: "none",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: submitting || !otherMessage.trim() ? "not-allowed" : "pointer",
                  transition: "opacity 0.15s",
                }}
              >
                <Send size={15} />
                {submitting ? "Sending…" : "Send to Tea"}
              </button>
            </form>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{
            background: "#161B2E",
            border: "1px solid #252B3D",
            borderRadius: 16,
            padding: "40px",
          }}
        >
          <h2 className="text-xl font-display font-bold text-white mb-2 text-center">
            Once You're a Client
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-8 max-w-xl mx-auto">
            Everything lives in one place — documents, contracts, communication, and payments.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Sign Contracts",
                desc: "Engagement letters sent via Adobe Acrobat Sign. Sign from any device in minutes.",
                href: undefined,
              },
              {
                icon: BookOpen,
                title: "Upload Documents",
                desc: "Securely send statements, receipts, and records through the encrypted client portal.",
                href: "/client-portal",
              },
              {
                icon: Building2,
                title: "QuickBooks Access",
                desc: "Tea works directly in your QuickBooks Online account — no exports, no data re-entry.",
                href: undefined,
              },
            ].map((card) => (
              <div key={card.title} className="text-center p-5 rounded-xl bg-surface/50">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 mb-3">
                  <card.icon size={18} className="text-accent" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{card.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{card.desc}</p>
                {card.href && (
                  <Link href={card.href} className="inline-block mt-2 text-xs text-accent hover:underline">
                    Open portal →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
