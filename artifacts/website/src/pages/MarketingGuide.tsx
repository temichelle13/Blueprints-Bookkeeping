import { useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Shield, Search, Star, MessageSquare, Linkedin, Mail, PenTool, Lightbulb, CalendarDays, Target, BookOpen, Printer } from "lucide-react";

export default function MarketingGuide() {
  usePageTitle("Marketing & Visibility Guide");

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  return (
    <div className="marketing-guide">
      <div className="bg-amber-500/10 border-b border-amber-500/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-amber-300 text-sm font-medium">
            Internal Reference Only — This page is not linked in public navigation and is intended as a private marketing playbook for Tea.
          </p>
          <button
            onClick={() => window.print()}
            className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-colors shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Guide
          </button>
        </div>
      </div>

      <section className="py-20 relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="accent-bar mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4">
              Marketing & Visibility <span className="text-gradient">Playbook</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A practical, step-by-step guide for building Blueprints & Bookkeeping's online presence through Google, LinkedIn, and newsletter content.
            </p>
          </div>

          <nav className="glass-card rounded-2xl p-6 mb-16">
            <h2 className="text-sm font-mono font-medium tracking-widest text-muted-foreground mb-4">QUICK NAVIGATION</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="#google" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent/30 hover:bg-accent/5 transition-all">
                <Search className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-foreground">Google Business Profile</span>
              </a>
              <a href="#linkedin" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent/30 hover:bg-accent/5 transition-all">
                <Linkedin className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-foreground">LinkedIn Strategy</span>
              </a>
              <a href="#newsletter" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent/30 hover:bg-accent/5 transition-all">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-foreground">Newsletter Framework</span>
              </a>
            </div>
          </nav>

          <section id="google" className="mb-20 scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Google Business Profile</h2>
                <p className="text-muted-foreground text-sm mt-1">Get found when founders search for bookkeeping help</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Step-by-Step Setup</h3>
                <ol className="space-y-4">
                  {[
                    {
                      title: "Go to google.com/business and sign in",
                      detail: "Use the Google account you want to manage the listing with long-term. If you have a dedicated business Gmail, use that."
                    },
                    {
                      title: 'Enter your business name exactly: "Blueprints & Bookkeeping LLC"',
                      detail: "Consistency matters for search. Use the exact legal name you want displayed publicly."
                    },
                    {
                      title: "Choose your business category",
                      detail: 'Primary category: "Bookkeeping Service." Add secondary categories: "Financial Consultant," "Business Management Consultant," and "Financial Planner." These help you appear in multiple relevant searches.'
                    },
                    {
                      title: "Set your service area",
                      detail: 'Since you serve clients nationwide but are based in Roseburg, OR, select "I deliver goods and services to my customers" and set your service area to "United States." Add Roseburg, OR as your physical location for local search benefits.'
                    },
                    {
                      title: "Add your contact information",
                      detail: "Enter your business phone number and website URL. Make sure the website URL matches exactly (including https://)."
                    },
                    {
                      title: "Verify your business",
                      detail: "Google will typically send a postcard to your Roseburg address with a verification code. This takes 5-14 days. Do not skip this — unverified listings have almost no visibility."
                    },
                    {
                      title: "Complete your profile after verification",
                      detail: "Add business hours, photos of your workspace, your logo, and a detailed business description (see below)."
                    }
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-white text-[15px]">{step.title}</p>
                        <p className="text-muted-foreground text-[14px] mt-1 leading-relaxed">{step.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Optimizing Your Listing</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-2">Business Description (750 chars max)</h4>
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                      <p className="text-muted-foreground text-[14px] leading-relaxed italic">
                        "Blueprints & Bookkeeping is a boutique financial consultancy based in Roseburg, Oregon, serving founders and business owners nationwide. We specialize in advanced bookkeeping for complex operations — including multi-entity structuring, cryptocurrency accounting, and historical cleanups — alongside lender-ready business plans built to survive bank underwriting. With a strictly capped roster of 20 clients, we provide the dedicated attention and year-round availability that growing businesses demand. No offshore labor. No tax-season blackouts. Fortune 500 financial expertise applied to your business."
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-2">Photos to Add</h4>
                    <ul className="space-y-2">
                      {[
                        "Your logo (high-resolution, square format)",
                        "A professional headshot of you (Tea) — builds trust immediately",
                        "Your workspace setup — shows legitimacy and professionalism",
                        "Cover photo: something that conveys financial expertise (clean, modern)",
                        "2-3 images showing your work: a redacted financial report, your website portfolio, or a screenshot of a well-organized QBO dashboard"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[14px] text-muted-foreground">
                          <span className="text-accent mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-2">Services to List</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "Monthly Bookkeeping",
                        "Historical Cleanup & Catch-Up",
                        "Multi-Entity Bookkeeping",
                        "Cryptocurrency Bookkeeping",
                        "Business Plan Writing",
                        "SBA Loan Readiness",
                        "Financial Forecasting",
                        "Digital Business Plans"
                      ].map((service, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span className="text-[14px] text-foreground">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Getting Reviews
                </h3>
                <p className="text-muted-foreground text-[15px] mb-4 leading-relaxed">
                  Reviews are the single most powerful ranking factor for Google Business Profiles. Even 5-10 genuine reviews will dramatically boost your visibility. Here's how to build them naturally:
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: "Ask at milestone moments",
                      detail: "After completing a major cleanup, delivering a business plan, or helping a client get loan approval — these are emotional high points where clients are most willing to leave a review."
                    },
                    {
                      title: "Make it effortless",
                      detail: "Create a direct review link (Google Business dashboard → 'Get more reviews' → copy link) and send it in a brief, personal email. One click should take them straight to the review form."
                    },
                    {
                      title: "Use a simple script",
                      detail: '"Hey [Name], it was great getting your books cleaned up. If you have 30 seconds, a Google review would mean a lot to a small practice like mine — here\'s the link: [link]. No pressure at all."'
                    },
                    {
                      title: "Respond to every review",
                      detail: "Thank people publicly. It shows future searchers that you're engaged and attentive. Keep responses brief and professional."
                    },
                    {
                      title: "Never buy or fake reviews",
                      detail: "Google detects and penalizes this. Organic reviews from real clients are worth far more than volume from fake accounts."
                    }
                  ].map((tip, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <MessageSquare className="w-4 h-4 text-accent mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-white text-[14px]">{tip.title}</p>
                        <p className="text-muted-foreground text-[14px] mt-0.5 leading-relaxed">{tip.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="glow-line max-w-3xl mx-auto mb-20" />

          <section id="linkedin" className="mb-20 scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Linkedin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">LinkedIn Strategy</h2>
                <p className="text-muted-foreground text-sm mt-1">Position yourself as the go-to financial partner for founders</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Profile Optimization</h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-2">Headline Formula</h4>
                    <p className="text-muted-foreground text-[14px] mb-2">Your headline should immediately communicate who you help and how. Skip generic titles like "Owner at Blueprints & Bookkeeping."</p>
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                      <p className="text-foreground text-[14px] font-medium italic">
                        "I help founders get lender-ready with advanced bookkeeping & bulletproof business plans | Blueprints & Bookkeeping"
                      </p>
                    </div>
                    <p className="text-muted-foreground text-[13px] mt-2">Alternative options:</p>
                    <ul className="mt-1 space-y-1">
                      {[
                        '"Boutique bookkeeper for complex operations | Multi-entity, crypto, SBA readiness"',
                        '"Fortune 500 finance experience → helping founders scale | Year-round bookkeeping + business plans"'
                      ].map((alt, i) => (
                        <li key={i} className="text-muted-foreground text-[13px] flex items-start gap-2">
                          <span className="text-accent">→</span>
                          <span className="italic">{alt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-2">About Section</h4>
                    <p className="text-muted-foreground text-[14px] mb-2 leading-relaxed">
                      Write in first person. Tell your story: why you left Fortune 500 finance to build a boutique practice, what problem you saw in the market, and who you serve now. End with a call to action.
                    </p>
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 space-y-3">
                      <p className="text-muted-foreground text-[14px] leading-relaxed">
                        <span className="text-accent font-semibold">Opening hook:</span> Start with a pain point your ideal client feels. Example: "Most founders I meet have the same story: their bookkeeper can't handle the complexity, their CPA only shows up in Q1, and their business plan is a dusty PDF nobody trusts."
                      </p>
                      <p className="text-muted-foreground text-[14px] leading-relaxed">
                        <span className="text-accent font-semibold">Middle:</span> Your credibility — Fortune 500 background, CEH v12 certification, QuickBooks ProAdvisor Advanced. What makes your approach different (20-client cap, year-round, no offshore).
                      </p>
                      <p className="text-muted-foreground text-[14px] leading-relaxed">
                        <span className="text-accent font-semibold">Close:</span> "If your books are holding you back from your next round of funding or your next big hire, let's talk. Link to your website."
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-2">Profile Essentials Checklist</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "Professional headshot (not a selfie)",
                        "Custom banner image with your tagline",
                        "Featured section: link to your website + a blog post",
                        "Skills: Bookkeeping, Financial Analysis, Business Planning, QuickBooks",
                        "Custom URL: linkedin.com/in/tea-blueprints (or similar)",
                        "Location: Roseburg, OR (builds local trust even for remote work)"
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                          <span className="text-green-400 mt-0.5 text-sm">✓</span>
                          <span className="text-[14px] text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-accent" />
                  Content Posting Strategy
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-3">Posting Cadence</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { freq: "Minimum", posts: "2x/week", note: "Enough to stay visible in feeds" },
                        { freq: "Sweet Spot", posts: "3-4x/week", note: "Builds momentum without burnout" },
                        { freq: "Power Mode", posts: "Daily", note: "Fastest growth, requires batch-writing" }
                      ].map((level, i) => (
                        <div key={i} className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/5">
                          <p className="text-[12px] text-muted-foreground uppercase tracking-wider mb-1">{level.freq}</p>
                          <p className="text-2xl font-bold text-white mb-1">{level.posts}</p>
                          <p className="text-[13px] text-muted-foreground">{level.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-3">Post Types That Work for Founders</h4>
                    <div className="space-y-4">
                      {[
                        {
                          type: "The Myth-Buster",
                          example: '"Most business plans fail at the bank — not because the idea is bad, but because the financials don\'t hold up. Here are the 3 things underwriters actually look for..."',
                          why: "Positions you as the expert who knows what banks really want."
                        },
                        {
                          type: "The Behind-the-Scenes",
                          example: '"Just finished a 3-year historical cleanup for a client with 4 entities and $2M in unreconciled transactions. Here\'s what I learned..."',
                          why: "Shows the complexity you handle (without naming clients)."
                        },
                        {
                          type: "The Quick Tip",
                          example: '"If you\'re running crypto and traditional revenue through the same QBO file: stop. Here\'s why you need separate tracking..."',
                          why: "Delivers immediate value. Gets saved and shared."
                        },
                        {
                          type: "The Contrarian Take",
                          example: '"Hot take: Most founders don\'t need a CFO. They need a bookkeeper who actually understands their business. Here\'s the difference..."',
                          why: "Sparks engagement and positions your niche."
                        },
                        {
                          type: "The Client Win (anonymized)",
                          example: '"A founder came to me with a mess: 18 months of backlogged books and an SBA deadline in 6 weeks. We got it done. Here\'s how..."',
                          why: "Social proof without breaking confidentiality."
                        },
                        {
                          type: "The Personal Story",
                          example: '"I left Fortune 500 finance because I was tired of watching founders get ignored by the very firms they were paying. So I built something different..."',
                          why: "Humanizes your brand. People connect with origin stories."
                        }
                      ].map((post, i) => (
                        <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-accent" />
                            <span className="font-semibold text-white text-[14px]">{post.type}</span>
                          </div>
                          <p className="text-muted-foreground text-[14px] italic mb-2 leading-relaxed">"{post.example}"</p>
                          <p className="text-accent/80 text-[13px]">Why it works: {post.why}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-3">Driving Traffic to Your Website</h4>
                    <ul className="space-y-3">
                      {[
                        "End posts with 'Link in comments' and drop your blog/services URL in the first comment (LinkedIn deprioritizes posts with links in the body).",
                        "Feature your latest blog post in your LinkedIn Featured section — update it whenever you publish.",
                        "When you publish a new blog post, write a LinkedIn post summarizing the key takeaway and direct people to the full article.",
                        "Add your website URL to your LinkedIn headline and About section.",
                        "Comment thoughtfully on posts by founders and entrepreneurs in your target market — your profile (with your website link) gets seen by their network."
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14px] text-muted-foreground leading-relaxed">
                          <span className="text-accent font-bold mt-0.5">{i + 1}.</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="glow-line max-w-3xl mx-auto mb-20" />

          <section id="newsletter" className="mb-20 scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Newsletter Content Framework</h2>
                <p className="text-muted-foreground text-sm mt-1">A repeatable formula so writing never feels like a chore</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-2">The "Insight + Story + CTA" Formula</h3>
                <p className="text-muted-foreground text-[15px] mb-6 leading-relaxed">
                  Every newsletter follows the same three-part structure. This keeps writing fast, consistent, and valuable for your readers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    {
                      step: "1",
                      title: "Insight",
                      desc: "Open with one actionable takeaway, tip, or lesson. This is the 'what.' Lead with value so readers stay hooked from the first line.",
                      time: "~40% of content"
                    },
                    {
                      step: "2",
                      title: "Story",
                      desc: "Illustrate the insight with a real (anonymized) client scenario, a personal experience, or an industry example. This is the 'proof.'",
                      time: "~40% of content"
                    },
                    {
                      step: "3",
                      title: "CTA",
                      desc: "Close with one clear next step: reply to the email, book a call, read a blog post, or try the tip. One CTA only — never more.",
                      time: "~20% of content"
                    }
                  ].map((part, i) => (
                    <div key={i} className="glass-card-hover rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">{part.step}</span>
                        <h4 className="font-bold text-white">{part.title}</h4>
                      </div>
                      <p className="text-muted-foreground text-[14px] leading-relaxed mb-2">{part.desc}</p>
                      <span className="text-accent/60 text-[12px] font-mono">{part.time}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                  <h4 className="font-semibold text-white text-[14px] mb-3 flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-accent" />
                    Example Newsletter Outline
                  </h4>
                  <div className="space-y-3 text-[14px]">
                    <div>
                      <span className="text-accent font-semibold">Subject:</span>
                      <span className="text-muted-foreground ml-2">"The #1 thing banks look at before your revenue"</span>
                    </div>
                    <div>
                      <span className="text-accent font-semibold">Insight:</span>
                      <span className="text-muted-foreground ml-2">"Banks care less about how much you make and more about whether your books prove it consistently. Here's what 'consistency' actually means in underwriting..."</span>
                    </div>
                    <div>
                      <span className="text-accent font-semibold">Story:</span>
                      <span className="text-muted-foreground ml-2">"Last month, a client with $800K in annual revenue got denied because 6 months of their P&L didn't match their bank deposits. We cleaned it up in 3 weeks and resubmitted..."</span>
                    </div>
                    <div>
                      <span className="text-accent font-semibold">CTA:</span>
                      <span className="text-muted-foreground ml-2">"If you're planning to apply for an SBA loan this year, reply to this email and I'll send you a free pre-submission checklist."</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  12+ Newsletter Topic Ideas
                </h3>
                <p className="text-muted-foreground text-[15px] mb-6 leading-relaxed">
                  Each topic is drawn from your actual expertise areas. Pick one, apply the Insight + Story + CTA formula, and you have a newsletter ready to send.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      topic: "Crypto Bookkeeping Basics",
                      angle: "Why mixing crypto and fiat in one chart of accounts creates audit nightmares"
                    },
                    {
                      topic: "SBA Loan Readiness Checklist",
                      angle: "The 5 documents every founder needs before walking into a bank"
                    },
                    {
                      topic: "Multi-Entity Structuring",
                      angle: "When (and why) to split your business into multiple entities — and the bookkeeping implications"
                    },
                    {
                      topic: "Historical Cleanup Horror Stories",
                      angle: "Lessons from untangling 2+ years of neglected books (anonymized)"
                    },
                    {
                      topic: "Why Your CPA Isn't Enough",
                      angle: "The gap between tax prep and year-round financial strategy"
                    },
                    {
                      topic: "The Digital Business Plan",
                      angle: "Why a static website outperforms a PDF when pitching to investors and banks"
                    },
                    {
                      topic: "Bookkeeping Red Flags for Founders",
                      angle: "7 signs your current bookkeeper is in over their head"
                    },
                    {
                      topic: "QuickBooks Tips & Tricks",
                      angle: "3 QBO automations that save 5+ hours per month (rules, bank feeds, recurring transactions)"
                    },
                    {
                      topic: "Financial Forecasting 101",
                      angle: "How to build a 3-year projection that's realistic enough for a bank to trust"
                    },
                    {
                      topic: "Founder Finance Mistakes",
                      angle: "The most common financial decisions founders regret — and how to avoid them"
                    },
                    {
                      topic: "Offshore vs. Domestic Bookkeeping",
                      angle: "The real cost of cheap offshore bookkeeping (data security, error rates, communication gaps)"
                    },
                    {
                      topic: "Scaling Without Breaking Your Books",
                      angle: "How to keep your financial infrastructure solid as you grow from $500K to $5M in revenue"
                    },
                    {
                      topic: "Year-End Financial Prep",
                      angle: "A Q4 checklist to make tax season painless and set up next year for success"
                    },
                    {
                      topic: "The Boutique Advantage",
                      angle: "Why a 20-client bookkeeper outperforms a 200-client firm for high-growth businesses"
                    }
                  ].map((idea, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-accent font-bold text-[14px] mt-0.5 shrink-0">{i + 1}.</span>
                      <div>
                        <p className="font-semibold text-white text-[14px]">{idea.topic}</p>
                        <p className="text-muted-foreground text-[13px] mt-0.5">{idea.angle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Practical Tips for Newsletter Writing
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-3">Frequency & Length</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                        <p className="text-[12px] text-muted-foreground uppercase tracking-wider mb-1">Recommended Frequency</p>
                        <p className="text-xl font-bold text-white mb-1">Every 2 weeks</p>
                        <p className="text-[13px] text-muted-foreground">Consistent enough to build a habit, not so frequent it feels overwhelming to write. Move to weekly only when it feels easy.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                        <p className="text-[12px] text-muted-foreground uppercase tracking-wider mb-1">Ideal Length</p>
                        <p className="text-xl font-bold text-white mb-1">400-600 words</p>
                        <p className="text-[13px] text-muted-foreground">Short enough to read in 2-3 minutes, long enough to deliver real value. Founders are busy — respect their time.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-3">Writing in Your Authentic Voice</h4>
                    <div className="space-y-3">
                      {[
                        {
                          do: "Write like you're explaining something to a smart friend over coffee",
                          dont: "Don't try to sound like a corporate press release or a finance textbook"
                        },
                        {
                          do: "Use 'I' and 'you' — first person is more engaging than third person",
                          dont: "Avoid 'Blueprints & Bookkeeping is pleased to announce...' — nobody talks like that"
                        },
                        {
                          do: "Share opinions and takes — your perspective IS the value",
                          dont: "Don't just restate facts anyone could Google — add your lens on it"
                        },
                        {
                          do: "It's OK to be casual, direct, even a little funny",
                          dont: "Don't worry about being 'professional enough' — authenticity beats polish every time"
                        }
                      ].map((pair, i) => (
                        <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/10">
                            <span className="text-green-400 text-[13px] mt-0.5 font-bold shrink-0">DO</span>
                            <span className="text-[14px] text-foreground">{pair.do}</span>
                          </div>
                          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/10">
                            <span className="text-red-400 text-[13px] mt-0.5 font-bold shrink-0">DON'T</span>
                            <span className="text-[14px] text-foreground">{pair.dont}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-3">Batch Writing Process</h4>
                    <p className="text-muted-foreground text-[14px] mb-3 leading-relaxed">
                      Writing doesn't have to happen in real-time. Here's a system to write a month's worth in one sitting:
                    </p>
                    <ol className="space-y-2">
                      {[
                        "Block 90 minutes on a quiet morning (first thing works best).",
                        "Pick 2 topics from the list above.",
                        "For each topic: write the Insight in 2-3 sentences, then the Story from memory (don't overthink it), then the CTA.",
                        "Let them sit for a day. Re-read with fresh eyes — trim anything that feels like filler.",
                        "Schedule them in your email platform (Mailchimp, ConvertKit, etc.) and move on."
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14px] text-muted-foreground leading-relaxed">
                          <span className="text-accent font-bold shrink-0">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-accent text-sm tracking-wide uppercase mb-3">Subject Line Formulas</h4>
                    <p className="text-muted-foreground text-[14px] mb-3 leading-relaxed">
                      Your subject line determines whether the email gets opened. Keep them short (under 50 characters), specific, and curiosity-driven.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        '"The one thing banks look at first"',
                        '"Why I fired my offshore bookkeeper"',
                        '"3 QBO tricks that save me 5 hrs/month"',
                        '"Your business plan is probably wrong"',
                        '"The $50K mistake most founders make"',
                        '"How to survive an SBA audit"',
                        '"Is your bookkeeper in over their head?"',
                        '"Stop mixing crypto and fiat (here\'s why)"'
                      ].map((subject, i) => (
                        <div key={i} className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                          <span className="text-[14px] text-foreground italic">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              This guide is a living document. As you learn what works for your audience, come back and update your strategies.
              The most important thing is to start — imperfect action beats perfect planning every time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}