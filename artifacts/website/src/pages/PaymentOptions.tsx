import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, CreditCard, Landmark, Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import { usePageTitle } from "@/hooks/use-page-title";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { getApiRoot } from "@/lib/api";
import { buildMarketingUrl, buildPaymentsUrl } from "@/lib/payment-domains";

function getSearchValue(search: URLSearchParams, key: string): string | null {
  const value = search.get(key)?.trim();
  return value ? value : null;
}

function getStripeEndpoint(mode: string | null): string {
  return mode === "deposit"
    ? "/payments/create-deposit-session"
    : "/payments/create-checkout-session";
}

export default function PaymentOptions() {
  usePageTitle("Choose Payment Method");
  const { toast } = useToast();
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const [location] = useLocation();

  const context = useMemo(() => {
    const search = new URLSearchParams(window.location.search);
    const rawInterval = getSearchValue(search, "interval");
    const interval: "monthly" | "annual" =
      rawInterval === "monthly" || rawInterval === "annual"
        ? rawInterval
        : "monthly";

    return {
      mode: getSearchValue(search, "mode") || "subscription",
      planKey: getSearchValue(search, "plan"),
      serviceKey: getSearchValue(search, "service"),
      interval,
      source: getSearchValue(search, "source") || "pricing",
    };
  }, [location]);

  const stripeLabel =
    context.mode === "deposit"
      ? "Pay your deposit online by card in Stripe Checkout."
      : "Start your plan online by card in Stripe Checkout.";

  const quickbooksIntakeUrl = useMemo(() => {
    const query = new URLSearchParams({
      payment_method: "quickbooks_invoice_ach",
      source: context.source,
      ...(context.planKey ? { plan: context.planKey } : {}),
      ...(context.serviceKey ? { service: context.serviceKey } : {}),
      ...(context.interval ? { interval: context.interval } : {}),
    });

    return buildMarketingUrl(`/contact?${query.toString()}`);
  }, [context]);

  const handleStripeCheckout = async () => {
    setIsLoadingStripe(true);
    const endpoint = getStripeEndpoint(context.mode);

    try {
      trackEvent("Payment Method Selected", {
        payment_method: "stripe_card",
        checkout_mode: context.mode,
        plan: context.planKey || "not_provided",
        service: context.serviceKey || "not_provided",
        interval: context.interval,
        source: context.source,
      });

      const successParams = new URLSearchParams({
        ...(context.planKey ? { plan: context.planKey } : {}),
        ...(context.serviceKey ? { service: context.serviceKey } : {}),
        mode: context.mode,
        method: "stripe_card",
      });

      const cancelSearch = new URLSearchParams(
        window.location.search,
      ).toString();
      const cancelPath = cancelSearch
        ? `/payments/options?${cancelSearch}`
        : "/payments/options";

      const payload = {
        plan: context.planKey,
        service: context.serviceKey,
        interval: context.interval,
        source: context.source,
        successUrl: `${buildPaymentsUrl("/payment-success")}?${successParams.toString()}`,
        cancelUrl: buildPaymentsUrl(cancelPath),
      };

      const response = await fetch(`${getApiRoot()}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to start checkout.");
      }

      const data = await response.json();
      const checkoutUrl: string | undefined = data.url || data.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("Checkout session did not return a redirect URL.");
      }

      trackEvent("Payment Method Completion", {
        payment_method: "stripe_card",
        completion_stage: "stripe_checkout_redirect",
        checkout_mode: context.mode,
        plan: context.planKey || "not_provided",
        service: context.serviceKey || "not_provided",
      });

      window.location.assign(checkoutUrl);
    } catch (error) {
      const description =
        error instanceof Error
          ? error.message
          : "Please try again or choose QuickBooks invoice / ACH.";
      toast({
        title: "Payment setup failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoadingStripe(false);
    }
  };

  const handleQuickBooksRoute = () => {
    trackEvent("Payment Method Selected", {
      payment_method: "quickbooks_invoice_ach",
      checkout_mode: context.mode,
      plan: context.planKey || "not_provided",
      service: context.serviceKey || "not_provided",
      interval: context.interval,
      source: context.source,
    });

    trackEvent("Payment Method Completion", {
      payment_method: "quickbooks_invoice_ach",
      completion_stage: "intake_routed",
      checkout_mode: context.mode,
      plan: context.planKey || "not_provided",
      service: context.serviceKey || "not_provided",
    });

    window.location.assign(quickbooksIntakeUrl);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <SEO
        title="Choose Payment Method"
        description="Choose card checkout with Stripe or request a QuickBooks invoice with ACH options."
        path="/payments/options"
        noindex
      />
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3 text-center">
              Choose payment method
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Choose how you want to proceed: pay online by card (Stripe) or pay
              from QuickBooks invoice / ACH (QuickBooks Payments).
            </p>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleStripeCheckout}
                disabled={isLoadingStripe}
                className="w-full text-left rounded-xl border border-accent/30 bg-accent/10 hover:bg-accent/20 transition-colors p-5 disabled:opacity-70"
              >
                <div className="flex items-start gap-3">
                  <CreditCard className="text-accent mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-white text-base">
                      Pay online by card (Stripe)
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stripeLabel}
                    </p>
                  </div>
                  {isLoadingStripe ? (
                    <Loader2
                      className="ml-auto animate-spin text-accent"
                      size={16}
                    />
                  ) : (
                    <ArrowRight className="ml-auto text-accent" size={16} />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={handleQuickBooksRoute}
                className="w-full text-left rounded-xl border border-white/[0.08] bg-surface hover:border-accent/30 transition-colors p-5"
              >
                <div className="flex items-start gap-3">
                  <Landmark className="text-accent mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-white text-base">
                      Pay from QuickBooks invoice / ACH (QuickBooks Payments)
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We&apos;ll route you to intake so we can issue your
                      invoice and ACH payment instructions.
                    </p>
                  </div>
                  <ArrowRight className="ml-auto text-accent" size={16} />
                </div>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
              <a
                href={buildMarketingUrl("/pricing")}
                className="text-sm text-accent hover:underline underline-offset-2"
              >
                Back to pricing
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
