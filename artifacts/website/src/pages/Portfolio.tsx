import { ExternalLink } from "lucide-react";

export default function Portfolio() {
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">The Digital Handshake</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
          Ditch the uninspiring PDF. See how we transform robust financial planning into premium digital assets that command investor respect.
        </p>
        <span className="inline-block px-4 py-2 bg-muted text-sm font-medium text-foreground rounded-full border border-border">
          Note: Examples below are demonstrations to protect client confidentiality.
        </span>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project) => (
            <div key={project.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-6 premium-shadow bg-muted border border-border">
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ExternalLink size={20} /> View Architecture
                  </div>
                </div>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div>
                <span className="text-accent font-semibold text-sm tracking-wide uppercase">{project.category}</span>
                <h3 className="text-2xl font-bold text-foreground mt-1 mb-3">{project.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center bg-primary/5 p-12 rounded-3xl border border-primary/10">
        <h2 className="text-3xl font-display font-bold text-primary mb-4">Ready for your own?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          A website isn't just marketing—it's proof of competence. Let's build your operational foundation.
        </p>
        <a 
          href="/contact" 
          className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg"
        >
          Start Your Project
        </a>
      </section>
    </div>
  );
}
