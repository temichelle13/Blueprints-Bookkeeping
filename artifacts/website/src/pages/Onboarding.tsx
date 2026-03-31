import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Send,
  CheckCircle,
  Building2,
  User,
  Phone,
  FileText,
  Laptop,
  StickyNote,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import {
  buildOnboardingUrl,
  getOnboardingContextFromSearch,
} from "@/lib/onboarding-url";
import { getApiRoot } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

interface OnboardingFormValues {
  clientName: string;
  clientEmail: string;
  businessName: string;
  ownerName: string;
  phone: string;
  einBusinessType: string;
  currentBookkeepingSoftware: string;
  businessState: string;
  notes: string;
}

export default function Onboarding() {
  usePageTitle("Onboarding — Blueprints & Bookkeeping");
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const onboardingContext = useMemo(
    () => getOnboardingContextFromSearch(window.location.search),
    [],
  );
  const effectivePlan = onboardingContext.plan?.trim() || undefined;
  const sessionId = onboardingContext.sessionId?.trim() || "";
  const hasSessionId = Boolean(sessionId);
  const isMissingSessionId = !hasSessionId;
  const onboardingRetryHref = buildOnboardingUrl({
    plan: onboardingContext.plan,
    service: onboardingContext.service,
    sessionId: onboardingContext.sessionId,
  });
  const checkoutConfirmationHref = `/payment-success${
    onboardingContext.plan || onboardingContext.service
      ? `?${new URLSearchParams({
          ...(onboardingContext.plan ? { plan: onboardingContext.plan } : {}),
          ...(onboardingContext.service
            ? { service: onboardingContext.service }
            : {}),
        }).toString()}`
      : ""
  }`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>();

  const onSubmit = async (data: OnboardingFormValues) => {
    if (isMissingSessionId) {
      toast({
        title: "Missing checkout session",
        description:
          "Return to your checkout confirmation page to reopen onboarding with a valid session, or contact support for a new link.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`${getApiRoot()}/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          plan: effectivePlan,
          stripeSessionId: sessionId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      trackEvent("Payment Method Completion", {
        completion_stage: "onboarding_submitted",
        payment_method: onboardingContext.paymentMethod || "unknown",
        plan: onboardingContext.plan || "not_provided",
        service: onboardingContext.service || "not_provided",
      });

      setSubmitted(true);
      toast({
        title: "Onboarding Complete",
        description:
          "Your information has been submitted. Contracts will be sent shortly.",
      });
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
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
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Onboarding Complete!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for providing your business details. Your Engagement
              Letter and NDA will arrive via Adobe Sign shortly.
            </p>
            <div className="glass-card rounded-xl p-6 max-w-md mx-auto">
              <p className="text-muted-foreground text-sm">
                Check your email for contract documents. Questions? Email us at{" "}
                <a
                  href="mailto:tea@blueprintsandbookkeeping.com"
                  className="text-accent hover:underline"
                >
                  tea@blueprintsandbookkeeping.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-surface border border-white/[0.06] text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-2 focus:ring-accent/10 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO title="Onboarding" noindex />
      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Client Onboarding
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us get to know your business. This information allows us to set
            up your accounts and start delivering value immediately.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto mt-4">
            Payment options remain available throughout onboarding: pay online
            by card (Stripe) or pay from QuickBooks invoice / ACH (QuickBooks
            Payments).
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
              <h3 className="font-semibold text-white mb-1 text-sm">
                Already have QuickBooks Online?
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                No migration needed. Fill out this form and Tea will send you a{" "}
                <strong className="text-white">
                  QuickBooks accountant invitation
                </strong>{" "}
                directly. Here's what happens next:
              </p>
              <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                <li>You submit this intake form</li>
                <li>
                  Tea reviews it and sends a QBO accountant invite to your email
                </li>
                <li>
                  You open the invite and click{" "}
                  <strong className="text-white">Accept</strong> (takes about 2
                  minutes)
                </li>
                <li>
                  Tea gets read/write access to your company file — no data
                  export required
                </li>
                <li>Your engagement letter and NDA arrive via Adobe Sign</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {isMissingSessionId && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="text-amber-300 shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-200 mb-2">
                  Missing checkout session
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  We could not verify your checkout session in this link. To
                  avoid onboarding delays, return to your checkout confirmation
                  page and use the onboarding button there, or contact support
                  for a fresh link.
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <a
                    href={checkoutConfirmationHref}
                    className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Return to checkout confirmation
                  </a>
                  <a
                    href="mailto:tea@blueprintsandbookkeeping.com?subject=Need%20onboarding%20link"
                    className="inline-flex items-center justify-center rounded-md border border-amber-300/40 px-4 py-2 font-semibold text-amber-100 hover:bg-amber-400/10 transition-colors"
                  >
                    Contact support
                  </a>
                  <a
                    href={onboardingRetryHref}
                    className="inline-flex items-center justify-center rounded-md border border-white/20 px-4 py-2 font-semibold text-foreground hover:bg-white/5 transition-colors"
                  >
                    Retry this onboarding link
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hasSessionId ? (
          <div className="glass-card rounded-2xl p-8 md:p-10 border border-destructive/40">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle
                className="text-destructive shrink-0 mt-0.5"
                size={22}
              />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Payment verification required
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We couldn't verify your checkout session, so onboarding is
                  currently locked. Please return to the payment flow and
                  complete checkout using the onboarding link from your
                  confirmation page.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:shadow-xl hover:shadow-accent/20 transition-all"
              >
                Return to Pricing
              </a>
              <a
                href="mailto:tea@blueprintsandbookkeeping.com?subject=Onboarding%20Session%20Verification%20Help"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-foreground hover:bg-white/5 transition-all"
              >
                Contact Support
              </a>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Tip: if you already paid, open your confirmation email and use the
              onboarding button there to preserve your secure payment session.
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>
                    <User className="inline w-4 h-4 mr-1 text-accent" />
                    Your Name *
                  </label>
                  <input
                    {...register("clientName", {
                      required: "Name is required",
                    })}
                    className={inputClass}
                    placeholder="Jane Smith"
                  />
                  {errors.clientName && (
                    <span className="text-destructive text-xs mt-1">
                      {errors.clientName.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    <Send className="inline w-4 h-4 mr-1 text-accent" />
                    Email Address *
                  </label>
                  <input
                    {...register("clientEmail", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
                    })}
                    type="email"
                    className={inputClass}
                    placeholder="jane@company.com"
                  />
                  {errors.clientEmail && (
                    <span className="text-destructive text-xs mt-1">
                      {errors.clientEmail.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>
                    <Building2 className="inline w-4 h-4 mr-1 text-accent" />
                    Business Name *
                  </label>
                  <input
                    {...register("businessName", {
                      required: "Business name is required",
                    })}
                    className={inputClass}
                    placeholder="Acme Corp LLC"
                  />
                  {errors.businessName && (
                    <span className="text-destructive text-xs mt-1">
                      {errors.businessName.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    <User className="inline w-4 h-4 mr-1 text-accent" />
                    Business Owner Name *
                  </label>
                  <input
                    {...register("ownerName", {
                      required: "Owner name is required",
                    })}
                    className={inputClass}
                    placeholder="Jane Smith"
                  />
                  {errors.ownerName && (
                    <span className="text-destructive text-xs mt-1">
                      {errors.ownerName.message}
                    </span>
                  )}
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
                  <MapPin className="inline w-4 h-4 mr-1 text-accent" />
                  Business State *
                </label>
                <select
                  {...register("businessState", {
                    required: "Business state is required",
                  })}
                  className={inputClass}
                >
                  <option value="">Select your business state...</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.businessState && (
                  <span className="text-destructive text-xs mt-1">
                    {errors.businessState.message}
                  </span>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  <Laptop className="inline w-4 h-4 mr-1 text-accent" />
                  Current Bookkeeping Software
                </label>
                <select
                  {...register("currentBookkeepingSoftware")}
                  className={inputClass}
                >
                  <option value="">Select your current software...</option>
                  <option value="QuickBooks Online">QuickBooks Online</option>
                  <option value="QuickBooks Desktop">QuickBooks Desktop</option>
                  <option value="Xero">Xero</option>
                  <option value="FreshBooks">FreshBooks</option>
                  <option value="Wave">Wave</option>
                  <option value="Spreadsheets/Manual">
                    Spreadsheets / Manual
                  </option>
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
        )}

        <div className="glass-card rounded-xl p-6 mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Your data is submitted securely. We use this information solely to
            set up your bookkeeping engagement.
          </p>
        </div>
      </section>
    </div>
  );
}
