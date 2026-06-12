import { useState } from "react";
import {
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { getApiRoot } from "@/lib/api";
import { getTurnstilePayload } from "@/lib/turnstile";

const CATEGORIES = [
  { value: "bug", label: "Something is broken" },
  { value: "content", label: "Incorrect or outdated content" },
  { value: "suggestion", label: "Suggestion or improvement" },
  { value: "other", label: "Other" },
];

const PAGES = [
  "Home",
  "About",
  "Services",
  "Pricing",
  "Industries",
  "Credentials",
  "Client Results",
  "Blog",
  "FAQ",
  "Schedule / Booking",
  "Contact Form",
  "AI Chat (Aria)",
  "Email / Notification",
  "Other / Not sure",
];

type Status = "idle" | "loading" | "success" | "error";

export default function Feedback() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    page: "",
    category: "",
    description: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.category) {
      setErrorMsg("Please select a category.");
      setStatus("error");
      return;
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      setErrorMsg("Please describe the issue in a bit more detail.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    const turnstilePayload = getTurnstilePayload(e.currentTarget);
    if (!turnstilePayload) {
      setErrorMsg("Please complete verification and try again.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(`${getApiRoot()}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          "cf-turnstile-response": turnstilePayload["cf-turnstile-response"],
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || "Something went wrong. Please try again.",
        );
      }
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors text-sm";

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <SEO title="Feedback" noindex />
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-3">
            Got it, thanks!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your feedback has been sent to Tea. If you left your email, she may
            follow up to let you know when it's resolved.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <SEO title="Feedback" noindex />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/15 border border-accent/30 mb-5">
            <MessageSquare size={24} className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-3">
            Site Feedback
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Spotted a broken link, an error, or something that just doesn't look
            right? Let us know and we'll get it fixed.
          </p>
        </div>

        <div
          style={{
            background: "#161B2E",
            border: "1px solid #252B3D",
            borderRadius: 16,
            padding: "40px",
          }}
        >
          {status === "error" && (
            <div
              role="alert"
              className="flex items-start gap-3 mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <AlertCircle
                size={18}
                className="text-red-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-red-300 text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="feedback-name"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  Your Name{" "}
                  <span className="text-muted-foreground/50">(optional)</span>
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  className={inputClass}
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="feedback-email"
                  className="block text-sm font-medium text-muted-foreground mb-2"
                >
                  Email{" "}
                  <span className="text-muted-foreground/50">(optional)</span>
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  className={inputClass}
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="feedback-category"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                What type of feedback is this?
              </label>
              <div className="relative">
                <select
                  id="feedback-category"
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="feedback-page"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Which page or area?{" "}
                <span className="text-muted-foreground/50">(optional)</span>
              </label>
              <div className="relative">
                <select
                  id="feedback-page"
                  className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                  value={form.page}
                  onChange={(e) => set("page", e.target.value)}
                >
                  <option value="">Select a page…</option>
                  {PAGES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="feedback-description"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Describe the issue
              </label>
              <textarea
                id="feedback-description"
                className={inputClass}
                rows={5}
                placeholder="Tell us what happened, what you expected, or what you'd like to see changed…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                required
              />
            </div>
            <TurnstileWidget />

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3.5 bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {status === "loading" ? "Sending…" : "Send Feedback"}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              For urgent issues, email{" "}
              <a
                href="mailto:tea@blueprintsandbookkeeping.com"
                className="text-accent hover:underline"
              >
                tea@blueprintsandbookkeeping.com
              </a>{" "}
              directly.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
