import { useMemo, useState } from "react";
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
  CalendarDays,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { useContactMutation } from "@/hooks/use-contact";

const CALENDLY_URL = "https://calendly.com/tea-blueprintsandbookkeeping/30min";
const PHONE_DISPLAY = "(541) 319-8654";
const PHONE_HREF = "tel:+15413198654";
const SMS_HREF = "sms:+15413198654";
const EMAIL_ADDRESS = "tea@blueprintsandbookkeeping.com";

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

const contactCards = [
  {
    icon: CalendarDays,
    color: "#8B5CF6",
    title: "Schedule",
    description:
      "Pick a time on Tea's calendar for a focused discovery conversation.",
    cta: "Open calendar",
    href: "/schedule",
    external: false,
    newTab: false,
  },
  {
    icon: Phone,
    color: "#10B981",
    title: "Call",
    description:
      "Prefer the phone? Call Tea directly during business hours or leave a voicemail.",
    cta: `Call ${PHONE_DISPLAY}`,
    href: PHONE_HREF,
    external: true,
    newTab: false,
  },
  {
    icon: MessageSquare,
    color: "#6366F1",
    title: "Text",
    description:
      "Send a text if you want a quick first touchpoint or have a simple question.",
    cta: "Text Tea",
    href: SMS_HREF,
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
      `We couldn't submit your message. Please try again, or contact us at ${PHONE_DISPLAY}.`,
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
          I agree to receive text messages and phone calls from Blueprints &amp;
          Bookkeeping at my provided contact number. Message and data rates may
          apply. Reply STOP to opt out.
        </label>
      </div>
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

function QuickBooksSetupNotice() {
  return (
    <section className="glass-card rounded-2xl p-7 md:p-8 mb-12 border border-accent/20 bg-accent/[0.04]">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
          <UserPlus size={22} className="text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-accent mb-2">
            Add Tea as your bookkeeper
          </p>
          <h2 className="text-2xl font-display font-bold text-white mb-3">
            Start with a quick note, then send the QuickBooks invite
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
            Use the options above to schedule, call, text, or email Tea. If you
            are ready to grant QuickBooks access, send the invite to{" "}
            <a
              href={`mailto:${EMAIL_ADDRESS}`}
              className="text-white underline decoration-accent/50 underline-offset-4 hover:text-accent transition-colors"
            >
              {EMAIL_ADDRESS}
            </a>{" "}
            and include your business name in your message so Tea can match the
            request promptly.
          </p>

          <ol className="space-y-3 mb-5">
            {quickbooksSetupSteps.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
              >
                <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-xs font-semibold text-accent shrink-0">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-muted-foreground leading-relaxed">
            <p className="text-white font-medium mb-1">Helpful note</p>
            <p>
              QuickBooks menu labels can vary slightly by subscription level and
              interface updates. If you do not see{" "}
              <span className="text-white">Manage users</span>, look for{" "}
              <span className="text-white">Users</span>,{" "}
              <span className="text-white">My Accountant</span>, or a similar
              accountant-invite option inside settings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  usePageTitle("Contact");
  const [location] = useLocation();

  const intent = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("intent");
  }, [location]);

  const showBookkeeperSetup = intent === "add-bookkeeper";
  const defaultMessage = showBookkeeperSetup
    ? "Hi Tea — I'd like to add you as my bookkeeper in QuickBooks."
    : "";

  return (
    <div className="pt-24 pb-20">
      <SEO
        path="/contact"
        description="Contact Blueprints & Bookkeeping to schedule a discovery call, call, text, email, or get help adding Tea as your bookkeeper in QuickBooks."
      />

      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            Schedule, call, text, or email — choose the contact method that
            feels easiest for you.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/[0.06] px-5 py-4 mb-10">
          <Globe size={20} className="text-accent shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-white">
              100% Virtual Practice
            </span>{" "}
            — All meetings, consultations, and services are conducted online. No
            in-person visits or physical office location.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 justify-center">
            {contactCards.map((card) => {
              const CardIcon = card.icon;
              const inner = (
                <div className="glass-card rounded-2xl p-7 flex flex-col h-full min-h-[260px] group cursor-pointer transition-all duration-300 hover:border-accent/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5">
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

              if (card.external) {
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
              }

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="no-underline"
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>

        {showBookkeeperSetup && <QuickBooksSetupNotice />}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="accent-bar" />
              <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-accent">
                Send a Message
              </h2>
            </div>
            <div className="glass-card rounded-2xl p-7">
              <MessageForm defaultMessage={defaultMessage} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="accent-bar" />
              <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-accent">
                Direct Contact
              </h2>
            </div>
            <div className="glass-card rounded-2xl p-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    <a
                      href={PHONE_HREF}
                      className="hover:text-accent transition-colors"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Voice calls and voicemail welcome
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <MessageSquare size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    <a
                      href={SMS_HREF}
                      className="hover:text-accent transition-colors"
                    >
                      Text {PHONE_DISPLAY}
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Best for quick questions and follow-ups
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
                      href={`mailto:${EMAIL_ADDRESS}`}
                      className="hover:text-accent transition-colors"
                    >
                      {EMAIL_ADDRESS}
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Replies within one business day
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Video size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    <a
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent transition-colors"
                    >
                      Book a video chat
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Calendly will open in a new tab
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
