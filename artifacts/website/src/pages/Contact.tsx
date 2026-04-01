import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Phone,
  Send,
  Loader2,
  CheckCircle2,
  Video,
  ArrowRight,
  Globe,
  ShieldCheck,
  Clock3,
  Wallet,
} from "lucide-react";
import { useSubmitContactForm } from "@workspace/api-client-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { useContactMutation, CONTACT_CONSENT_TEXT_VERSION, CONTACT_CONSENT_SOURCE_PAGE } from "@/hooks/use-contact";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

const CALENDLY_URL = "https://calendly.com/tea-blueprintsandbookkeeping/30min";
const PHONE_DISPLAY = "(541) 319-8654";
const PHONE_HREF = "tel:+15413198654";
const SMS_HREF = "sms:+15413198654";
const EMAIL_ADDRESS = "tea@blueprintsandbookkeeping.com";
const BOOKKEEPER_INTENT = "bookkeeper";
const CONTACT_CONSENT_LANGUAGE =
  "I agree to receive text messages and phone calls from Blueprints & Bookkeeping at my provided contact number. Message and data rates may apply. Reply STOP to opt out.";
const INQUIRY_PROCESSING_DISCLOSURE =
  "By submitting this inquiry, you consent to Blueprints & Bookkeeping processing your contact and business details to respond to your request, provide service recommendations, maintain compliance records, and prevent abuse.";

const messageSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z
    .string()
    .min(10, "Please include a message (at least 10 characters)"),
  smsConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to receive text messages and phone calls",
  }),
  website: z.string().max(0).optional(),
});

type MessageValues = z.infer<typeof messageSchema>;

const bookkeeperIntakeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  businessName: z.string().optional(),
  servicesWanted: z.array(z.string()).min(1, "Select at least one service"),
  budgetRange: z.string().optional(),
  budgetUnknown: z.boolean(),
  deadlinePressure: z.string().min(2, "Please select your timeline"),
  additionalComments: z
    .string()
    .min(10, "Please include enough detail for Tea to review your request"),
  website: z.string().max(0).optional(),
});

type BookkeeperIntakeValues = z.infer<typeof bookkeeperIntakeSchema>;

const SERVICE_OPTIONS = [
  {
    value: "Cleanup / catch-up bookkeeping",
    title: "Cleanup",
    description:
      "Books are behind, messy, or need historical correction before moving forward.",
  },
  {
    value: "Ongoing monthly bookkeeping",
    title: "Ongoing bookkeeping",
    description:
      "You need recurring monthly support, reconciliations, and dependable closes.",
  },
  {
    value: "Financial reports / close support",
    title: "Reports",
    description:
      "You want dependable statements, monthly reporting, or close support.",
  },
  {
    value: "Planning / strategy support",
    title: "Planning & strategy",
    description:
      "You want forward-looking financial guidance in addition to clean books.",
  },
  {
    value: "Bundle / combination of services",
    title: "Bundle",
    description:
      "You likely need a combination of cleanup, monthly work, reports, or planning.",
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
    description: "You want the right fit more than a rush timeline.",
  },
  {
    value: "Soon, ideally within 30 days",
    title: "Within 30 days",
    description:
      "You would like to get started soon if there is room in the schedule.",
  },
  {
    value: "Urgent — tax time, lender, investor, or filing pressure",
    title: "Urgent",
    description:
      "There is time-sensitive pressure that affects scheduling or review priority.",
  },
] as const;

const contactCards = [
  {
    icon: Video,
    color: "#6366F1",
    title: "Book a Free Discovery Call",
    description:
      "30 minutes with Tea — talk through your situation, get a custom recommendation, zero obligation.",
    cta: "Pick a Time on Calendly",
    href: CALENDLY_URL,
    external: true,
    newTab: true,
  },
  {
    icon: Phone,
    color: "#10B981",
    title: "Call or Text",
    description:
      "(541) 319-8654 — voicemail and text are both welcome. Tea will get back to you within one business day.",
    cta: "Dial (541) 319-8654",
    href: "tel:+15413198654",
    external: true,
    newTab: false,
  },
  {
    icon: Mail,
    color: "#F59E0B",
    title: "Email",
    description:
      "Reach out by email if you want to share details or documents before talking.",
    cta: `Email ${EMAIL_ADDRESS}`,
    href: `mailto:${EMAIL_ADDRESS}`,
    external: true,
    newTab: false,
  },
] as const;

const quickbooksSetupSteps = [
  "In QuickBooks Online, open the gear icon and go to Manage users or Users.",
  "Choose the option to add an accountant or invite an accounting professional.",
  `Enter ${EMAIL_ADDRESS} and send the invitation from QuickBooks.`,
  "Email Tea after you send it so she can confirm the invite, review your setup, and tell you what to send next.",
];

function MessageForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const { submit: sendMessage, isPending } = useContactMutation();
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MessageValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: defaultMessage,
    },
  });

  const onSubmit = async (data: MessageValues) => {
    setSubmitError(null);
    const ok = await sendMessage({
      formType: "quick",
      name: data.name,
      email: data.email,
      message: data.message,
      smsConsent: data.smsConsent,
      website: data.website || "",
    });
    if (ok) {
      setSent(true);
      reset({
        name: "",
        email: "",
        message: defaultMessage,
        smsConsent: false,
        website: "",
      });
      return;
    }

    setSubmitError(
      "We couldn't submit your message. Please try again, or contact us at (541) 319-8654.",
    );
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
        <p className="text-white font-semibold text-lg">Message received!</p>
        <p className="text-muted-foreground text-sm">
          Tea will reply within one business day.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors text-sm";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Your Name
          </label>
          <input
            id="contact-name"
            {...register("name")}
            placeholder="Jane Smith"
            className={inputClass}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p
              id="contact-name-error"
              role="alert"
              className="text-destructive text-xs mt-1"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email Address
          </label>
          <input
            id="contact-email"
            {...register("email")}
            type="email"
            placeholder="jane@company.com"
            className={inputClass}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p
              id="contact-email-error"
              role="alert"
              className="text-destructive text-xs mt-1"
            >
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          {...register("message")}
          rows={4}
          placeholder="Tell me a little about your business and what you need help with…"
          className={`${inputClass} resize-none`}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            className="text-destructive text-xs mt-1"
          >
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <div className="min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0">
          <input
            id="contact-sms-consent"
            type="checkbox"
            {...register("smsConsent")}
            className="h-4 w-4 rounded border border-white/20 bg-white/[0.04] accent-accent cursor-pointer"
            aria-invalid={!!errors.smsConsent}
          />
        </div>
        <label
          htmlFor="contact-sms-consent"
          className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none min-h-[44px] flex items-center"
        >
          {CONTACT_CONSENT_LANGUAGE}
        </label>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed -mt-1">
        {INQUIRY_PROCESSING_DISCLOSURE} Consent language version:{" "}
        {CONTACT_CONSENT_TEXT_VERSION}.
      </p>
      {errors.smsConsent && (
        <p
          id="contact-sms-consent-error"
          role="alert"
          className="text-destructive text-xs -mt-2"
        >
          {errors.smsConsent.message}
        </p>
      )}
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
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

function BookkeeperIntakeForm() {
  const { toast } = useToast();
  const mutation = useSubmitContactForm();
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
      setValue("budgetRange", "", { shouldValidate: false, shouldDirty: true });
    }
  }, [budgetUnknown, setValue]);

  const onSubmit = async (data: BookkeeperIntakeValues) => {
    setSubmitError(null);

    try {
      await mutation.mutateAsync({
        data: {
          formType: "detailed",
          name: data.name,
          email: data.email,
          businessName: data.businessName?.trim() || null,
          industry: "Bookkeeper Intake",
          servicesInterested: data.servicesWanted,
          monthlyRevenueRange: data.budgetUnknown
            ? "Budget not decided yet"
            : data.budgetRange?.trim() || null,
          biggestChallenge: [
            `Deadline pressure: ${data.deadlinePressure}`,
            "",
            "Additional comments:",
            data.additionalComments,
          ].join("\n"),
          smsConsent: false,
          consentTextVersion: CONTACT_CONSENT_TEXT_VERSION,
          consentSourcePage: CONTACT_CONSENT_SOURCE_PAGE,
          website: data.website || "",
        },
      });
      trackEvent("Contact Form Submission", { form_type: BOOKKEEPER_INTENT });
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for reaching out. We will be in touch shortly.",
      });
      setSent(true);
      reset();
    } catch {
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
      setSubmitError(
        "We couldn't submit your intake. Please try again, or email tea@blueprintsandbookkeeping.com.",
      );
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-colors text-sm";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5";

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-2xl font-display font-bold text-white">
            Intake received.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Tea will assess your request and current books before recommending
            the right next step.
          </p>
        </div>
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left space-y-3">
          <div className="flex gap-3">
            <ArrowRight className="w-4 h-4 text-accent shrink-0 mt-1" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              You will receive an estimate either way after review, even if a
              different scope or sequence makes more sense.
            </p>
          </div>
          <div className="flex gap-3">
            <Wallet className="w-4 h-4 text-accent shrink-0 mt-1" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your budget helps with fit and scheduling, but it is optional and
              will never block the review.
            </p>
          </div>
          <div className="flex gap-3">
            <Clock3 className="w-4 h-4 text-accent shrink-0 mt-1" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Next steps will be discussed after review, including whether
              accountant access or a QuickBooks invitation is still the right
              move.
            </p>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-1" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              To avoid exposing access details on a public page, firm ID or
              invitation instructions will be sent manually by email only if
              they are appropriate after review.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <input
        type="text"
        {...register("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

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
      </div>

      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <label className={labelClass}>What services do you want?</label>
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
                That is completely fine — Tea can still review the request and
                estimate the right scope.
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
                    <span className="text-sm text-white">{option}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
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
          Include context like how far behind the books are, whether QuickBooks
          is already set up, or any tax-time, lender, or investor pressure.
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
      <p className="text-xs text-muted-foreground leading-relaxed -mt-2">
        {INQUIRY_PROCESSING_DISCLOSURE} Consent language version:{" "}
        {CONTACT_CONSENT_TEXT_VERSION}.
      </p>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 disabled:opacity-50"
      >
        {mutation.isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        {mutation.isPending ? "Submitting intake…" : "Submit Intake"}
      </button>
    </form>
  );
}

export default function Contact() {
  const search = window.location.search;
  const isBookkeeperIntent = useMemo(() => {
    const intent = new URLSearchParams(search).get("intent");
    return intent === BOOKKEEPER_INTENT;
  }, [search]);

  usePageTitle(isBookkeeperIntent ? "Add Me as Your Bookkeeper" : "Contact");

  return (
    <div className="pt-24 pb-20">
      <SEO
        path="/contact"
        description={
          isBookkeeperIntent
            ? "Start the Blueprints & Bookkeeping intake flow for adding Tea as your bookkeeper."
            : "Get in touch with Blueprints & Bookkeeping. Book a free discovery call or send us a message to discuss your virtual bookkeeping needs."
        }
      />

      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {isBookkeeperIntent ? "Add Me as Your Bookkeeper" : "Get in Touch"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {isBookkeeperIntent
              ? "Start with a short intake so Tea can review your books and confirm the right next step before any accountant invite is shared."
              : "Two easy ways to connect — pick whichever works best for you."}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/[0.06] px-5 py-4 mb-10">
          <Globe size={20} className="text-accent shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-white">
              100 % Virtual Practice
            </span>{" "}
            — All meetings, consultations, and services are conducted online. No
            in-person visits or physical office location.
          </p>
        </div>

        {!isBookkeeperIntent && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {contactCards.map((card) => {
              const CardIcon = card.icon;
              const inner = (
                <div className="glass-card rounded-2xl p-7 flex flex-col h-full min-h-[280px] group cursor-pointer transition-all duration-300 hover:border-accent/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shrink-0"
                    style={{
                      background: `${card.color}15`,
                      border: `1px solid ${card.color}30`,
                    }}
                  >
                    <CardIcon size={22} style={{ color: card.color }} />
                  </div>
                  <h2 className="text-lg font-display font-bold text-white mb-2">
                    {card.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                    {card.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    style={{ color: card.color }}
                  >
                    {card.cta}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              );

              return (
                <a
                  key={card.title}
                  href={card.href}
                  {...(card.newTab
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="no-underline"
                >
                  {inner}
                </a>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="accent-bar" />
              <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-accent">
                {isBookkeeperIntent ? "Bookkeeper Intake" : "Send a Message"}
              </h2>
            </div>
            <div className="glass-card rounded-2xl p-7">
              {isBookkeeperIntent ? <BookkeeperIntakeForm /> : <MessageForm />}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="accent-bar" />
              <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-accent">
                {isBookkeeperIntent ? "What Happens Next" : "Direct Contact"}
              </h2>
            </div>
            {isBookkeeperIntent ? (
              <div className="glass-card rounded-2xl p-7 space-y-6">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-semibold">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Tea reviews the request and books
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      This intake replaces a public firm-ID handoff and gives
                      room to review fit, scope, and timing first.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-semibold">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      You receive an estimate either way
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      If the work is a fit, you will get scope and timing. If
                      not, you will still get a clear answer after review.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-accent font-semibold">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Access instructions come later, if needed
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      Firm ID or QuickBooks invitation details are sent manually
                      by email after review if accountant access is still the
                      right next step.
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-accent/20 bg-accent/[0.06] px-4 py-4">
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
            ) : (
              <div className="glass-card rounded-2xl p-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      <a
                        href="tel:+15413198654"
                        className="hover:text-accent transition-colors"
                      >
                        (541) 319-8654
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Voicemail & text welcome
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      <a
                        href="mailto:tea@blueprintsandbookkeeping.com"
                        className="hover:text-accent transition-colors"
                      >
                        tea@blueprintsandbookkeeping.com
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Replies within one business day
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
