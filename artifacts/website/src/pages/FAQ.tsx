import { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { BookkeepingDisclaimer } from "@/components/BookkeepingDisclaimer";
import { faqPageSchema } from "@/lib/seo-schemas";

interface FAQItemData {
  id?: string;
  q: string;
  a: string;
}

interface FAQSection {
  category: string;
  items: FAQItemData[];
}

const faqs: FAQSection[] = [
  {
    category: "Bookkeeping",
    items: [
      {
        q: "What's included in your bookkeeping service?",
        a: "Every bookkeeping engagement includes monthly transaction categorization and reconciliation, monthly close procedures, financial statement preparation (P&L, balance sheet, cash flow), and proactive communication on anything unusual. We also set up rule-based automation in QuickBooks Online to reduce manual entry and errors."
      },
      {
        id: "taxes",
        q: "Do you do taxes or tax preparation?",
        a: "No — and that's intentional. We focus exclusively on bookkeeping and financial planning year-round, which means we're always available and never disappear during tax season. Your CPA handles taxes; we make sure your books are clean and accurate so that handoff is seamless."
      },
      {
        q: "Can you clean up old or messy books?",
        a: "Yes — historical cleanup is one of our specialties. Whether your books haven't been touched in months or you've inherited a disorganized chart of accounts, we'll work backward to reconcile and correct the records. Cleanup projects are scoped and quoted separately before we begin."
      },
      {
        q: "Do you work with multiple business entities?",
        a: "Absolutely. We handle multi-entity structures, intercompany transactions, and consolidated reporting. This is common for clients with an operating company, holding company, or real estate entities alongside a main business."
      },
      {
        q: "What industries do you specialize in?",
        a: "We have deep experience in agriculture, timber, small manufacturing, real estate, e-commerce, and businesses with crypto asset activity. If your business has niche reconciliation needs — livestock sales, commodity revenue, crypto purchases — we know how to handle it correctly."
      },
    ]
  },
  {
    category: "Business Plans",
    items: [
      {
        q: "What's the difference between your Business Plan tiers?",
        a: "The Startup Roadmap is ideal for early-stage businesses — it includes a 3-year forecast, market overview, and executive summary. The Full Plan Package is a comprehensive, in-depth document with 5-year rigorous modeling, deep competitor analysis, and a complete strategic narrative."
      },
      {
        q: "How long does a business plan take?",
        a: "Most plans are delivered within 2 to 4 weeks from the time we receive your input documents and complete the onboarding call. Turnaround depends on how quickly we can gather your financial history, industry data, and goals — the more prepared you are, the faster we move."
      },
      {
        q: "Who is the business plan written for?",
        a: "That depends on your goals. We discuss the purpose of the plan during our discovery call — whether it's for a bank conversation, a partner presentation, an internal roadmap, or something else entirely — and tailor the content and format accordingly."
      },
      {
        q: "Can the plan be used for different purposes?",
        a: "Yes. A well-written business plan can serve multiple purposes — presenting to a bank, sharing with a potential partner, guiding internal decisions, or supporting a loan application. We make sure the document is clear, thorough, and professional regardless of who reads it."
      },
    ]
  },
  {
    category: "Pricing & Process",
    items: [
      {
        q: "How is bookkeeping pricing determined?",
        a: "Bookkeeping is priced based on three main factors: monthly transaction volume, the number of entities or accounts we're managing, and niche complexity (crypto, agriculture, multi-currency, etc.). We provide a flat monthly rate after a brief discovery call — no surprises, no hourly billing."
      },
      {
        q: "Do you offer a free consultation?",
        a: "Yes. We offer a free 30-minute discovery call to understand your situation, answer your questions, and determine if we're a good fit. You can book directly on our scheduling page or reach out via the contact form."
      },
      {
        q: "What happens after I reach out?",
        a: "After you submit the contact form or book a call, you'll hear from us within one business day. We'll schedule a discovery call, review your current situation, and send a custom proposal within 48 hours of that call. Onboarding typically takes 1 to 2 weeks."
      },
      {
        q: "Do you work with clients outside Oregon?",
        a: "Yes — we serve clients nationwide. All services are delivered remotely. Many of our clients are in other states; location is never a barrier to working together."
      },
    ]
  },
];

function FAQItem({
  id,
  q,
  a,
  enableHashDeepLinking = false,
}: {
  id?: string;
  q: string;
  a: string;
  enableHashDeepLinking?: boolean;
}) {
  const hashMatch =
    typeof window !== "undefined" &&
    enableHashDeepLinking &&
    id &&
    window.location.hash === `#${id}`;
  const [open, setOpen] = useState(Boolean(hashMatch));
  const contentId = id ? `${id}-content` : undefined;
  const buttonId = id ? `${id}-trigger` : undefined;

  useEffect(() => {
    if (!id || !enableHashDeepLinking) return;

    const onHashChange = () => {
      if (window.location.hash === `#${id}`) {
        setOpen(true);
      }
    };

    if (hashMatch) onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [id, hashMatch, enableHashDeepLinking]);

  return (
    <div
      id={id}
      className="border-b border-white/[0.06] last:border-0"
    >
      <button
        id={buttonId}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className={cn("text-[15px] font-medium transition-colors", open ? "text-white" : "text-foreground group-hover:text-white")}>
          {q}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 text-accent shrink-0 mt-0.5 transition-transform duration-300", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div id={contentId} role="region" aria-labelledby={buttonId}>
          <p className="text-muted-foreground text-[14px] leading-relaxed pb-5">
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  usePageTitle("FAQ");

  const jsonLd = useMemo(() => {
    const allItems = faqs.flatMap((section) =>
      section.items.map((item) => ({ question: item.q, answer: item.a }))
    );
    return faqPageSchema(allItems);
  }, []);

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="FAQ"
        description="Frequently asked questions about our bookkeeping services, business plans, pricing, and process. Straight answers for founders and business owners."
        path="/faq"
        jsonLd={jsonLd}
      />
      <section className="py-16 mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Straight answers about our services, process, and how we work. Don't see what you're looking for?{" "}
            <Link href="/contact" className="text-accent hover:underline">Ask us directly.</Link>
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {faqs.map((section) => (
          <div key={section.category}>
            {section.category === "Bookkeeping" && <BookkeepingDisclaimer className="mb-4" />}
            <div className="flex items-center gap-3 mb-2">
              <div className="accent-bar" />
              <h2 className="text-xs font-mono font-semibold tracking-widest text-accent uppercase">{section.category}</h2>
            </div>
            <div className="glass-card rounded-2xl px-6 divide-y divide-white/[0.06]">
              {section.items.map((item) => (
                <FAQItem
                  key={item.q}
                  id={item.id}
                  q={item.q}
                  a={item.a}
                  // Deep-linking is explicit per item (for example #taxes).
                  // Standard /faq navigation should land at the top of the page.
                  enableHashDeepLinking={Boolean(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="glass-card rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Still have questions?</h3>
          <p className="text-muted-foreground text-sm mb-6">Book a free 30-minute discovery call or send us a message — we'll get back to you within one business day.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/schedule" className="px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300">
              Book a Discovery Call
            </Link>
            <Link href="/contact" className="px-6 py-3 rounded-lg border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300">
              Send a Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
