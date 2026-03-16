import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, CheckCircle, Building2, User, Phone, FileText, Laptop, StickyNote } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface OnboardingFormValues {
  clientName: string;
  clientEmail: string;
  businessName: string;
  ownerName: string;
  phone: string;
  einBusinessType: string;
  currentBookkeepingSoftware: string;
  notes: string;
}

export default function Onboarding() {
  usePageTitle("Onboarding — Blueprints & Bookkeeping");
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan") || "";
  const sessionId = params.get("session_id") || "";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OnboardingFormValues>();

  const onSubmit = async (data: OnboardingFormValues) => {
    try {
      const res = await fetch(`${API_BASE}/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          plan,
          stripeSessionId: sessionId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      setSubmitted(true);
      toast({ title: "Onboarding Complete", description: "Your information has been submitted. Contracts will be sent shortly." });
    } catch (err) {
      toast({ title: "Submission Failed", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    }
  };

  if (submitted) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <SEO title="Onboarding" noindex />
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 mb-8">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Onboarding Complete!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for providing your business details. Your Engagement Letter and NDA will arrive via Adobe Sign shortly.
            </p>
            <div className="glass-card rounded-xl p-6 max-w-md mx-auto">
              <p className="text-muted-foreground text-sm">
                Check your email for contract documents. Questions? Email us at{" "}
                <a href="mailto:tea@blueprintsandbookkeeping.com" className="text-accent hover:underline">tea@blueprintsandbookkeeping.com</a>.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-lg bg-surface border border-white/[0.06] text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-2 focus:ring-accent/10 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO title="Onboarding" noindex />
      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Client Onboarding</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us get to know your business. This information allows us to set up your accounts and start delivering value immediately.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div
          style={{
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 14,
            padding: "24px 28px",
          }}
        >
          <div className="flex items-start gap-3">
            <Laptop className="text-accent shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-white mb-1 text-sm">Already have QuickBooks Online?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                No migration needed. Fill out this form and Tea will send you a <strong className="text-white">QuickBooks accountant invitation</strong> directly. Here's what happens next:
              </p>
              <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                <li>You submit this intake form</li>
                <li>Tea reviews it and sends a QBO accountant invite to your email</li>
                <li>You open the invite and click <strong className="text-white">Accept</strong> (takes about 2 minutes)</li>
                <li>Tea gets read/write access to your company file — no data export required</li>
                <li>Your engagement letter and NDA arrive via Adobe Sign</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  <User className="inline w-4 h-4 mr-1 text-accent" />
                  Your Name *
                </label>
                <input
                  {...register("clientName", { required: "Name is required" })}
                  className={inputClass}
                  placeholder="Jane Smith"
                />
                {errors.clientName && <span className="text-destructive text-xs mt-1">{errors.clientName.message}</span>}
              </div>
              <div>
                <label className={labelClass}>
                  <Send className="inline w-4 h-4 mr-1 text-accent" />
                  Email Address *
                </label>
                <input
                  {...register("clientEmail", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Invalid email" } })}
                  type="email"
                  className={inputClass}
                  placeholder="jane@company.com"
                />
                {errors.clientEmail && <span className="text-destructive text-xs mt-1">{errors.clientEmail.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  <Building2 className="inline w-4 h-4 mr-1 text-accent" />
                  Business Name *
                </label>
                <input
                  {...register("businessName", { required: "Business name is required" })}
                  className={inputClass}
                  placeholder="Acme Corp LLC"
                />
                {errors.businessName && <span className="text-destructive text-xs mt-1">{errors.businessName.message}</span>}
              </div>
              <div>
                <label className={labelClass}>
                  <User className="inline w-4 h-4 mr-1 text-accent" />
                  Business Owner Name *
                </label>
                <input
                  {...register("ownerName", { required: "Owner name is required" })}
                  className={inputClass}
                  placeholder="Jane Smith"
                />
                {errors.ownerName && <span className="text-destructive text-xs mt-1">{errors.ownerName.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  <Phone className="inline w-4 h-4 mr-1 text-accent" />
                  Phone Number
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  className={inputClass}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className={labelClass}>
                  <FileText className="inline w-4 h-4 mr-1 text-accent" />
                  EIN / Business Type
                </label>
                <input
                  {...register("einBusinessType")}
                  className={inputClass}
                  placeholder="e.g. LLC, S-Corp, Sole Prop"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                <Laptop className="inline w-4 h-4 mr-1 text-accent" />
                Current Bookkeeping Software
              </label>
              <select {...register("currentBookkeepingSoftware")} className={inputClass}>
                <option value="">Select your current software...</option>
                <option value="QuickBooks Online">QuickBooks Online</option>
                <option value="QuickBooks Desktop">QuickBooks Desktop</option>
                <option value="Xero">Xero</option>
                <option value="FreshBooks">FreshBooks</option>
                <option value="Wave">Wave</option>
                <option value="Spreadsheets/Manual">Spreadsheets / Manual</option>
                <option value="None">None — starting fresh</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                <StickyNote className="inline w-4 h-4 mr-1 text-accent" />
                Additional Notes
              </label>
              <textarea
                {...register("notes")}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Anything else we should know? Special requests, timeline considerations, etc."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-accent text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {isSubmitting ? "Submitting..." : "Submit Onboarding Form"}
            </button>
          </form>
        </div>

        <div className="glass-card rounded-xl p-6 mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Your data is submitted securely. We use this information solely to set up your bookkeeping engagement.
          </p>
        </div>
      </section>
    </div>
  );
}
