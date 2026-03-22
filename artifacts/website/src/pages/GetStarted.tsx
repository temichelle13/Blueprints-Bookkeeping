import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Video,
  MessageSquare,
  UserPlus,
  ArrowRight,
  HelpCircle,
  Send,
  CheckCircle,
} from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { getApiRoot } from "@/lib/api";

const CALENDLY_URL = "https://calendly.com/tea-blueprintsandbookkeeping/30min";

interface BasePath {
  icon: typeof CalendarDays;
  color: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  external: boolean;
  newTab?: boolean;
}

type PathCard = BasePath;

export default function GetStarted() {
  usePageTitle("Get Started — Blueprints & Bookkeeping");

  const [fallbackName, setFallbackName] = useState("");
  const [fallbackEmail, setFallbackEmail] = useState("");
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleFallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackMessage.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${getApiRoot()}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fallbackName || "Not provided",
          email: fallbackEmail || "",
          page: "Get Started",
          category: "not-sure",
          description: fallbackMessage,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong — please email tea@blueprintsandbookkeeping.com directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const paths: PathCard[] = [
    {
      icon: CalendarDays,
      color: "#8B5CF6",
      title: "Book a call",
      subtitle:
        "Open Tea's calendar and choose a time for a discovery call that fits your schedule.",
      cta: "Schedule now",
      href: "/schedule",
      external: false,
      newTab: false,
    },
    {
      icon: Video,
      color: "#6366F1",
      title: "Video chat",
      subtitle:
        "Prefer to meet face-to-face online? Jump straight to the video call booking flow.",
      cta: "Book video chat",
      href: CALENDLY_URL,
      external: true,
      newTab: true,
    },
    {
      icon: MessageSquare,
      color: "#10B981",
      title: "Text message me",
      subtitle:
        "Send a text to Tea for a quick first touchpoint or to ask a simple question.",
      cta: "Send a text",
      href: "sms:+15413198654",
      external: true,
      newTab: false,
    },
    {
      icon: UserPlus,
      color: "#F59E0B",
      title: "Add me as your bookkeeper",
      subtitle:
        "Start from the contact page to review the setup steps and connect with Tea directly before adding access in QuickBooks.",
      cta: "View setup steps",
      href: "/contact?intent=add-bookkeeper",
      external: false,
      newTab: false,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
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

  const renderCard = (path: PathCard, index: number) => {
    const Icon = path.icon;

    const cardBody = (
      <motion.div
        variants={item}
        style={{
          background: "#161B2E",
          border: "1px solid #252B3D",
          borderRadius: 16,
          padding: 32,
          display: "flex",
          flexDirection: "column" as const,
          height: "100%",
          position: "relative" as const,
          overflow: "hidden",
          cursor: "pointer",
          transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        }}
        whileHover={{
          borderColor: `${path.color}60`,
          y: -4,
          boxShadow: `0 8px 30px ${path.color}15`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: path.color,
            opacity: 0.6,
          }}
        />

        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: `${path.color}15`,
            border: `1px solid ${path.color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginBottom: 20,
          }}
        >
          <Icon size={26} style={{ color: path.color }} />
        </div>

        <h2 className="text-xl font-display font-bold text-white mb-2">
          {path.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
          {path.subtitle}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 20px",
            borderRadius: 10,
            background: path.color,
            color: "white",
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          {path.cta}
          <ArrowRight size={16} />
        </div>
      </motion.div>
    );

    if (path.external) {
      return (
        <a
          key={index}
          href={path.href}
          {...(path.newTab
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          style={{ textDecoration: "none", display: "block" }}
        >
          {cardBody}
        </a>
      );
    }

    return (
      <Link
        key={index}
        href={path.href}
        style={{ textDecoration: "none", display: "block" }}
      >
        {cardBody}
      </Link>
    );
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <SEO
        title="Get Started"
        description="Choose how to begin with Blueprints & Bookkeeping — schedule a call, book a video chat, send a text, or review the steps to add Tea as your bookkeeper."
        path="/get-started"
      />
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 mb-6 text-sm font-medium text-accent">
            <span className="glow-dot" />
            Four ways to get started
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4">
            How Would You Like to Begin?
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pick the option that fits how you want to connect right now. Every
            path leads straight to Tea and the next best step for your business.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12"
        >
          {paths.map((path, i) => renderCard(path, i))}
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
              <h2 className="text-lg font-display font-bold text-white mb-0.5">
                Not sure? Leave your info
              </h2>
              <p className="text-sm text-muted-foreground">
                Drop your name, email, and what you're working on — Tea will
                reach out within one business day. No pressure.
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
            <form onSubmit={handleFallbackSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="gs-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="gs-name"
                    type="text"
                    placeholder="Your name"
                    value={fallbackName}
                    onChange={(e) => setFallbackName(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) =>
                      Object.assign(e.currentTarget.style, inputFocusStyle)
                    }
                    onBlur={(e) =>
                      Object.assign(e.currentTarget.style, inputStyle)
                    }
                  />
                </div>
                <div>
                  <label htmlFor="gs-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="gs-email"
                    type="email"
                    placeholder="Your email"
                    value={fallbackEmail}
                    onChange={(e) => setFallbackEmail(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) =>
                      Object.assign(e.currentTarget.style, inputFocusStyle)
                    }
                    onBlur={(e) =>
                      Object.assign(e.currentTarget.style, inputStyle)
                    }
                  />
                </div>
              </div>
              <label htmlFor="gs-message" className="sr-only">
                Your message
              </label>
              <textarea
                id="gs-message"
                placeholder="Tell us a bit about your business and what you need help with…"
                value={fallbackMessage}
                onChange={(e) => setFallbackMessage(e.target.value)}
                rows={3}
                required
                className={inputClass}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) =>
                  Object.assign(e.currentTarget.style, {
                    ...inputStyle,
                    ...inputFocusStyle,
                  })
                }
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
              />
              {error && (
                <p role="alert" className="text-red-400 text-xs">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting || !fallbackMessage.trim()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 22px",
                  borderRadius: 10,
                  background:
                    submitting || !fallbackMessage.trim()
                      ? "rgba(99,102,241,0.3)"
                      : "#6366F1",
                  border: "none",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor:
                    submitting || !fallbackMessage.trim()
                      ? "not-allowed"
                      : "pointer",
                  transition: "opacity 0.15s",
                }}
              >
                <Send size={15} />
                {submitting ? "Sending…" : "Send to Tea"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
