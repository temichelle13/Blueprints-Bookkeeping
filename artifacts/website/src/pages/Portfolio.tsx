import { ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";

export default function Portfolio() {
  usePageTitle("Portfolio");

  const projects = [
    {
      id: 1,
      title: "AgriTech Expansion Strategy",
      category: "Agriculture / Tech",
      image: `${import.meta.env.BASE_URL}images/portfolio-1.png`,
      desc: "Interactive static website built to secure a $2M commercial equipment loan, featuring automated cash flow models and crop yield projections."
    },
    {
      id: 2,
      title: "SaaS Series A Pitch Deck",
      category: "Tech Startup",
      image: `${import.meta.env.BASE_URL}images/portfolio-2.png`,
      desc: "A digital handshake replacing a 40-page PDF. Highlighted strict burn rate metrics and user acquisition models in a highly visual, investor-ready format."
    },
    {
      id: 3,
      title: "Multi-Entity Timber Operations",
      category: "Timber & Real Estate",
      image: `${import.meta.env.BASE_URL}images/portfolio-3.png`,
      desc: "Consolidated holding company financials presented securely via a private web portal, utilized for securing a localized credit facility."
    }
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="py-16 mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">The Digital Handshake</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Ditch the uninspiring PDF. See how we transform robust financial planning into premium digital assets that command investor respect.
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground rounded-full border border-white/[0.06] bg-card/40">
            Examples below are demonstrations to protect client confidentiality.
          </span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-6 glass-card">
                <div className="absolute inset-0 bg-accent/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ExternalLink size={18} /> View Architecture
                  </div>
                </div>
                <img
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div>
                <span className="text-[11px] font-mono font-medium tracking-widest text-accent">{project.category.toUpperCase()}</span>
                <h3 className="text-xl font-bold text-white mt-1.5 mb-2">{project.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{project.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative rounded-2xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10" />
          <div className="absolute inset-[1px] rounded-2xl bg-card" />
          <div className="absolute inset-0 border border-accent/15 rounded-2xl" />
          <div className="relative">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Ready for your own?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              A website isn't just marketing&mdash;it's proof of competence. Let's build your operational foundation.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white rounded-xl font-bold hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
            >
              Start Your Project <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
