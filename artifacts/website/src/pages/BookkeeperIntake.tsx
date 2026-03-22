import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Send,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Clock3,
  Wallet,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  bookkeeperIntakeSchema,
  type BookkeeperIntakeValues,
  useContactMutation,
} from "@/hooks/use-contact";

const SERVICE_OPTIONS = [
  {
    value: "Cleanup / catch-up bookkeeping",
    title: "Cleanup",
    description:
      "Books are behind, messy, or need historical correction before we move forward.",
  },
  {
    value: "Ongoing monthly bookkeeping",
    title: "Ongoing bookkeeping",
    description:
      "I need recurring monthly support, reconciliations, and reliable closes.",
  },
  {
    value: "Financial reports / close support",
    title: "Reports",
    description:
      "I need dependable monthly reporting, statements, or close support.",
  },
  {
    value: "Planning / strategy support",
    title: "Planning & strategy",
    description:
      "I want forward-looking financial guidance in addition to clean books.",
  },
  {
    value: "Bundle / combination of services",
    title: "Bundle",
    description:
      "I likely need a combination of cleanup, monthly work, reports, or planning.",
  },
] as const;

const BUDGET_OPTIONS = [
  "Under $500/month",
  "$500–$1,000/month",
  "$1,000–$2,500/month",
  "$2,500+/month",
  "Project-based / one-time cleanup budget",
] as const;

const DEADLINE_OPTIONS = [
  {
    value: "No hard deadline",
    title: "No hard deadline",
    description: "I want the right fit more than a rush timeline.",
  },
  {
    value: "Soon, ideally within 30 days",
    title: "Within 30 days",
    description:
      "I would like to get started soon if there is room in the schedule.",
  },
  {
    value: "Urgent — tax time, lender, investor, or filing pressure",
    title: "Urgent",
    description:
      "There is time-sensitive pressure that affects scheduling or review priority.",
  },
] as const;

export default function BookkeeperIntake() {
  usePageTitle("Add Me as Your Bookkeeper");

  const { submit: submitIntake, isPending } = useContactMutation();
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookkeeperIntakeValues>({
    resolver: zodResolver(bookkeeperIntakeSchema),
    defaultValues: {
      formType: "bookkeeper-intake",
      businessName: "",
      servicesWanted: [],
      budgetRange: "",
      budgetUnknown: false,
      deadlinePressure: "No hard deadline",
      additionalComments: "",
      website: "",
    },
  });

  const budgetUnknown = watch("budgetUnknown");
  const selectedBudget = watch("budgetRange");
  const selectedDeadline = watch("deadlinePressure");
  const selectedServices = watch("servicesWanted") || [];

  useEffect(() => {
    if (budgetUnknown && selectedBudget) {
      setValue("budgetRange", "", { shouldValidate: true });
    }
  }, [budgetUnknown, selectedBudget, setValue]);

  const onSubmit = async (data: BookkeeperIntakeValues) => {
    setSubmitError(null);
    const ok = await submitIntake(data);

    if (ok) {
      setSent(true);
      reset({
        formType: "bookkeeper-intake",
        name: "",
        email: "",
        businessName: "",
        servicesWanted: [],
        budgetRange: "",
        budgetUnknown: false,
        deadlinePressure: "No hard deadline",
        additionalComments: "",
        website: "",
      });
      return;
    }

    setSubmitError(
      "We couldn't submit your intake. Please try again, or email tea@blueprintsandbookkeeping.com.",
    );
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors text-sm";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5";

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO
        title="Add Me as Your Bookkeeper"
        description="Share what bookkeeping help you need so Blueprints & Bookkeeping can review your books, confirm fit, and send the right next steps."
        path="/add-me-as-your-bookkeeper"
      />

      <section className="py-14 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
            Add Me as Your Bookkeeper
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Start with a short intake so Tea can review what you need before
            recommending the right setup, timing, and next step.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="accent-bar" />
            <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-accent">
              Bookkeeper Intake
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-7 md:p-8">
            {sent ? (
              <div className="flex flex-col items-center text-center gap-5 py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="space-y-3 max-w-2xl">
                  <h2 className="text-2xl font-display font-bold text-white">
                    Intake received.
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Tea will assess your request and current books before
                    recommending the right next step.
                  </p>
                </div>
                <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left space-y-3">
                  <div className="flex gap-3">
                    <ArrowRight className="w-4 h-4 text-accent shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You will receive an estimate either way after review, even
                      if the answer is that a different scope or sequence makes
                      more sense.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Wallet className="w-4 h-4 text-accent shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your budget helps with fit and scheduling, but it is
                      optional and will never block the review.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Clock3 className="w-4 h-4 text-accent shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Next steps will be discussed after review, including
                      whether accountant access or a QuickBooks invitation is
                      still the right move.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      To avoid exposing access details on a public page, firm ID
                      or invitation instructions will be sent manually by email
                      only if they are appropriate after review.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                <input
                  type="text"
                  {...register("website")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <input type="hidden" {...register("formType")} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bookkeeper-name" className={labelClass}>
                      Your Name
                    </label>
                    <input
                      id="bookkeeper-name"
                      {...register("name")}
                      placeholder="Jane Smith"
                      className={inputClass}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p role="alert" className="text-destructive text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bookkeeper-email" className={labelClass}>
                      Email Address
                    </label>
                    <input
                      id="bookkeeper-email"
                      type="email"
                      {...register("email")}
                      placeholder="jane@company.com"
                      className={inputClass}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p role="alert" className="text-destructive text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="bookkeeper-business" className={labelClass}>
                    Business Name{" "}
                    <span className="normal-case tracking-normal font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="bookkeeper-business"
                    {...register("businessName")}
                    placeholder="Acorn Studio LLC"
                    className={inputClass}
                    aria-invalid={!!errors.businessName}
                  />
                  {errors.businessName && (
                    <p role="alert" className="text-destructive text-xs mt-1">
                      {errors.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <label className={labelClass}>
                      What services do you want?
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Select all that apply
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICE_OPTIONS.map((option) => {
                      const checked = selectedServices.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className={`rounded-2xl border p-4 cursor-pointer transition-all ${checked ? "border-accent/50 bg-accent/[0.08]" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              value={option.value}
                              {...register("servicesWanted")}
                              className="mt-1 h-4 w-4 rounded border border-white/20 bg-white/[0.04] accent-accent"
                            />
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {option.title}
                              </p>
                              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {errors.servicesWanted && (
                    <p role="alert" className="text-destructive text-xs mt-2">
                      {errors.servicesWanted.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <label className={labelClass}>
                      Preferred budget range{" "}
                      <span className="normal-case tracking-normal font-normal">
                        (optional)
                      </span>
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Helps with fit and scheduling
                    </span>
                  </div>
                  <div className="space-y-3">
                    <label
                      className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${budgetUnknown ? "border-accent/50 bg-accent/[0.08]" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}
                    >
                      <input
                        type="checkbox"
                        {...register("budgetUnknown")}
                        className="mt-1 h-4 w-4 rounded border border-white/20 bg-white/[0.04] accent-accent"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          I don’t know my budget yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          That is completely fine — Tea can still review the
                          request and estimate the right scope.
                        </p>
                      </div>
                    </label>

                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${budgetUnknown ? "opacity-60" : ""}`}
                    >
                      {BUDGET_OPTIONS.map((option) => {
                        const checked = selectedBudget === option;
                        return (
                          <label
                            key={option}
                            className={`rounded-2xl border p-4 cursor-pointer transition-all ${checked ? "border-accent/50 bg-accent/[0.08]" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                value={option}
                                {...register("budgetRange")}
                                disabled={budgetUnknown}
                                className="h-4 w-4 border border-white/20 bg-white/[0.04] accent-accent"
                              />
                              <span className="text-sm text-white">
                                {option}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  {errors.budgetRange && (
                    <p role="alert" className="text-destructive text-xs mt-2">
                      {errors.budgetRange.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Deadline pressure</label>
                  <div className="grid grid-cols-1 gap-3">
                    {DEADLINE_OPTIONS.map((option) => {
                      const checked = selectedDeadline === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`rounded-2xl border p-4 cursor-pointer transition-all ${checked ? "border-accent/50 bg-accent/[0.08]" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              value={option.value}
                              {...register("deadlinePressure")}
                              className="mt-1 h-4 w-4 border border-white/20 bg-white/[0.04] accent-accent"
                            />
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {option.title}
                              </p>
                              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {errors.deadlinePressure && (
                    <p role="alert" className="text-destructive text-xs mt-2">
                      {errors.deadlinePressure.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="bookkeeper-comments" className={labelClass}>
                    Additional comments
                  </label>
                  <textarea
                    id="bookkeeper-comments"
                    rows={5}
                    {...register("additionalComments")}
                    placeholder="Tell Tea what is happening in the books, what feels urgent, and anything that would help with review."
                    className={`${inputClass} resize-none`}
                    aria-invalid={!!errors.additionalComments}
                  />
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Include context like how far behind the books are, whether
                    QuickBooks is already set up, or any tax-time, lender, or
                    investor pressure.
                  </p>
                  {errors.additionalComments && (
                    <p role="alert" className="text-destructive text-xs mt-2">
                      {errors.additionalComments.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p role="alert" className="text-destructive text-sm -mt-2">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {isPending ? "Submitting intake…" : "Submit Intake"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="accent-bar" />
            <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-accent">
              What Happens Next
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-semibold">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Tea reviews the request and books
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  The intake replaces a public firm-ID handoff and gives room to
                  review scope, fit, and timing first.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-semibold">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  You receive an estimate either way
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  If the work is a fit, you will get scope and timing. If not,
                  you will still get a clear answer.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-semibold">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Access instructions come later, if needed
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Firm ID or QuickBooks invitation details are sent manually by
                  email after review if accountant access is still the right
                  next step.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-accent/20 bg-accent/[0.06] p-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-white">
                Why ask about budget?
              </span>{" "}
              Budget does not need to be final. It simply helps determine
              whether a light cleanup, ongoing monthly scope, or a bundled
              engagement makes the most sense.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
