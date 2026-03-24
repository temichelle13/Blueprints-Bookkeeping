import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Send,
  Users,
  Handshake,
  Gift,
  DollarSign,
  ArrowDown,
} from "lucide-react";
import { useContactMutation } from "@/hooks/use-contact";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";

const referralSchema = z.object({
  referrerName: z.string().min(2, "Your name is required"),
  referrerEmail: z.string().email("Valid email is required"),
  referrerType: z.enum(["client", "partner"], {
    required_error: "Please select your referral type",
  }),
  referredName: z.string().min(2, "Referred person's name is required"),
  referredContact: z.string().min(2, "Contact info is required"),
  notes: z.string().optional(),
  smsConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to receive text messages and phone calls",
  }),
  website: z.string().max(0).optional(),
});

type ReferralValues = z.infer<typeof referralSchema>;

export default function Referral() {
  usePageTitle("Referral Program");

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Refer a Client"
        description="Know a business owner who needs clean books or a solid business plan? Send them our way."
        path="/referral"
      />
      <section className="py-16 mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="accent-bar mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Referral Program
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Great businesses grow through great relationships. Earn rewards by
              connecting us with businesses that need expert bookkeeping and
              strategic planning.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-8 md:p-10 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white">
                Client Referrals
              </h2>
            </div>
            <p className="text-foreground leading-relaxed mb-6">
              Know a fellow business owner who's drowning in receipts or
              struggling with their books? Refer them to us and you'll both
              benefit.
            </p>
            <div className="glass-card rounded-xl p-6 mb-6 border border-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <Gift size={20} className="text-accent" />
                <h3 className="text-lg font-semibold text-white">
                  Your Reward
                </h3>
              </div>
              <p className="text-foreground leading-relaxed">
                Receive{" "}
                <span className="text-accent font-bold">
                  one month of bookkeeping service credit
                </span>{" "}
                (~$500 value) when your referred client signs on and completes
                their first month of service.
              </p>
            </div>
            <div className="mt-auto">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                How It Works
              </h4>
              <ol className="space-y-3">
                {[
                  "Submit the referral form below with your info and your contact's details",
                  "We reach out to your referral with a personalized introduction",
                  "Once they sign on and complete their first month, your credit is applied",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <a
              href="#referral-form"
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent/15 border border-accent/30 text-accent font-semibold rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
            >
              <Users size={16} />
              Refer a Client
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card rounded-2xl p-8 md:p-10 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                <Handshake size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white">
                Partner Referrals
              </h2>
            </div>
            <p className="text-foreground leading-relaxed mb-6">
              CPAs, attorneys, financial advisors, and other professionals —
              build a referral partnership that puts money in your pocket while
              serving your clients better.
            </p>
            <div className="glass-card rounded-xl p-6 mb-6 border border-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign size={20} className="text-accent" />
                <h3 className="text-lg font-semibold text-white">
                  Your Reward
                </h3>
              </div>
              <p className="text-foreground leading-relaxed">
                Earn a{" "}
                <span className="text-accent font-bold">
                  10% revenue share on the first three months
                </span>{" "}
                of the referred client's engagement, paid after the client pays.
              </p>
            </div>
            <div className="mt-auto">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Why Partner With Us
              </h4>
              <ul className="space-y-3">
                {[
                  "We handle bookkeeping so you can focus on tax prep, legal, or advisory work",
                  "Your clients get enterprise-grade financial management from a trusted partner",
                  "Recurring revenue share rewards you for every successful referral",
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                    <span className="text-sm text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="#referral-form"
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent/15 border border-accent/30 text-accent font-semibold rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
            >
              <Handshake size={16} />
              Refer a Partner
            </a>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center mb-2">
          <ArrowDown size={24} className="text-accent mx-auto animate-bounce" />
        </div>
      </section>

      <section
        id="referral-form"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card rounded-2xl p-8 md:p-10"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Submit a Referral
          </h2>
          <p className="text-muted-foreground mb-8 text-[15px]">
            Fill out the form below and we'll take it from here. We treat every
            referral with the same care and professionalism you'd expect for
            yourself.
          </p>
          <ReferralForm />
        </motion.div>
      </section>
    </div>
  );
}

function ReferralForm() {
  const { submit, isPending } = useContactMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReferralValues>({
    resolver: zodResolver(referralSchema),
  });

  const referrerType = watch("referrerType");

  const onSubmit = async (data: ReferralValues) => {
    setSubmitError(null);
    const message = [
      `[REFERRAL SUBMISSION]`,
      `Referrer Type: ${data.referrerType}`,
      `Referred Person: ${data.referredName}`,
      `Referred Contact: ${data.referredContact}`,
      data.notes ? `Notes: ${data.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const success = await submit({
      formType: "quick",
      name: data.referrerName,
      email: data.referrerEmail,
      message,
      smsConsent: data.smsConsent,
      website: data.website || "",
    });

    if (success) {
      reset();
      return;
    }

    setSubmitError(
      "We couldn't submit your referral. Please try again, or contact us at (541) 319-8654.",
    );
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-surface border border-white/[0.06] text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:ring-2 focus:ring-accent/10 outline-none transition-all";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label className={labelClass}>I am a... *</label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <label
            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
              referrerType === "client"
                ? "border-accent/50 bg-accent/10"
                : "border-white/[0.06] bg-surface/50 hover:bg-surface"
            }`}
          >
            <input
              type="radio"
              value="client"
              {...register("referrerType")}
              className="w-4 h-4 accent-accent"
            />
            <div>
              <span className="text-sm font-medium text-foreground">
                Current Client
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Earn service credit
              </p>
            </div>
          </label>
          <label
            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
              referrerType === "partner"
                ? "border-accent/50 bg-accent/10"
                : "border-white/[0.06] bg-surface/50 hover:bg-surface"
            }`}
          >
            <input
              type="radio"
              value="partner"
              {...register("referrerType")}
              className="w-4 h-4 accent-accent"
            />
            <div>
              <span className="text-sm font-medium text-foreground">
                Professional Partner
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Earn revenue share
              </p>
            </div>
          </label>
        </div>
        {errors.referrerType && (
          <span className="text-destructive text-xs mt-1 block">
            {errors.referrerType.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Your Name *</label>
          <input
            {...register("referrerName")}
            placeholder="Your full name"
            className={inputClass}
          />
          {errors.referrerName && (
            <span className="text-destructive text-xs mt-1">
              {errors.referrerName.message}
            </span>
          )}
        </div>
        <div>
          <label className={labelClass}>Your Email *</label>
          <input
            {...register("referrerEmail")}
            type="email"
            placeholder="you@example.com"
            className={inputClass}
          />
          {errors.referrerEmail && (
            <span className="text-destructive text-xs mt-1">
              {errors.referrerEmail.message}
            </span>
          )}
        </div>
      </div>

      <div className="glow-line" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Referred Person's Name *</label>
          <input
            {...register("referredName")}
            placeholder="Their full name"
            className={inputClass}
          />
          {errors.referredName && (
            <span className="text-destructive text-xs mt-1">
              {errors.referredName.message}
            </span>
          )}
        </div>
        <div>
          <label className={labelClass}>Referred Person's Contact *</label>
          <input
            {...register("referredContact")}
            placeholder="Email or phone number"
            className={inputClass}
          />
          {errors.referredContact && (
            <span className="text-destructive text-xs mt-1">
              {errors.referredContact.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Additional Notes</label>
        <textarea
          {...register("notes")}
          placeholder="Any context that would help us reach out (e.g., their business type, how you know them)"
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="referral-sms-consent"
          type="checkbox"
          {...register("smsConsent")}
          className="mt-1 h-4 w-4 rounded border border-white/20 bg-white/[0.04] accent-accent cursor-pointer shrink-0"
        />
        <label
          htmlFor="referral-sms-consent"
          className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none"
        >
          I agree to receive text messages and phone calls from Blueprints &amp;
          Bookkeeping at my provided contact number. Message and data rates may
          apply. Reply STOP to opt out.
        </label>
      </div>
      {errors.smsConsent && (
        <span className="text-destructive text-xs -mt-4 block">
          {errors.smsConsent.message}
        </span>
      )}
      {submitError && (
        <p className="text-destructive text-sm -mt-2">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-8 py-4 bg-accent text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
      >
        <Send size={18} />
        {isPending ? "Submitting Referral..." : "Submit Referral"}
      </button>
    </form>
  );
}
