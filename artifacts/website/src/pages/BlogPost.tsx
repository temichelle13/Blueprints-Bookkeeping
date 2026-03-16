import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, Clock, Linkedin, Twitter, Mail } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import { breadcrumbSchema } from "@/lib/seo-schemas";

const BASE_URL = "https://blueprintsandbookkeeping.com";

function ShareBar({ title, slug }: { title: string; slug: string }) {
  const pageUrl = `${window.location.origin}${import.meta.env.BASE_URL}blog/${slug}`;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const emailUrl = `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`;

  const buttonClass = "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border";

  return (
    <div className="share-bar flex flex-wrap gap-3 my-10">
      <span className="text-muted-foreground text-sm font-medium self-center mr-1">Share this article:</span>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClass} bg-[#0A66C2]/10 border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]`}
      >
        <Linkedin size={16} />
        LinkedIn
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClass} bg-foreground/5 border-foreground/10 text-foreground hover:bg-foreground hover:text-background hover:border-foreground`}
      >
        <Twitter size={16} />
        X (Twitter)
      </a>
      <a
        href={emailUrl}
        className={`${buttonClass} bg-accent/10 border-accent/30 text-accent hover:bg-accent hover:text-white hover:border-accent`}
      >
        <Mail size={16} />
        Email
      </a>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  usePageTitle(post?.title || "Blog");

  if (!post) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
        <Link href="/blog" className="text-accent hover:underline font-medium">
          &larr; Back to Blog
        </Link>
      </div>
    );
  }

  const paragraphs = post.content.split('\n\n');

  const jsonLd = breadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}/blog` },
    { name: post.title, url: `${BASE_URL}/blog/${post.slug}` }
  ]);

  return (
    <div className="pt-24 pb-20">
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        jsonLd={jsonLd}
      />
      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <span className="text-[11px] font-mono font-medium tracking-widest text-accent block mb-4">{post.category.toUpperCase()}</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-6 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-5 py-3 mb-8">
          <span className="text-[13px] leading-relaxed text-amber-200/80">
            <span className="font-semibold text-amber-300">Disclaimer:</span> This article is for informational purposes only and does not constitute professional tax, legal, or investment advice. Please consult a licensed professional for guidance specific to your situation.
          </span>
        </div>
        <div className="prose-custom space-y-5">
          {paragraphs.map((paragraph, i) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
              return (
                <h2 key={i} className="text-xl font-bold mt-10 mb-4">
                  {trimmed.replace(/\*\*/g, '')}
                </h2>
              );
            }

            if (trimmed.startsWith('- ')) {
              const items = trimmed.split('\n').filter(l => l.trim().startsWith('- '));
              return (
                <ul key={i} className="space-y-2 ml-4">
                  {items.map((item, j) => (
                    <li key={j} className="text-foreground leading-relaxed text-[15px] flex items-start gap-2">
                      <span className="text-accent mt-1.5 text-xs">&#9679;</span>
                      <span>{item.replace(/^- /, '')}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            if (/^\d+\. /.test(trimmed)) {
              const items = trimmed.split('\n').filter(l => /^\d+\. /.test(l.trim()));
              return (
                <ol key={i} className="space-y-2 ml-4">
                  {items.map((item, j) => (
                    <li key={j} className="text-foreground leading-relaxed text-[15px] flex items-start gap-2">
                      <span className="text-accent font-mono text-sm mt-0.5">{j + 1}.</span>
                      <span>{item.replace(/^\d+\. /, '')}</span>
                    </li>
                  ))}
                </ol>
              );
            }

            const rendered = trimmed
              .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');

            return (
              <p key={i} className="text-foreground leading-relaxed text-[15px]" dangerouslySetInnerHTML={{ __html: rendered }} />
            );
          })}
        </div>

        <ShareBar title={post.title} slug={post.slug} />

        <div className="glow-line my-12" />

        <div className="glass-card rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-3">Ready to elevate your financial infrastructure?</h3>
          <p className="text-muted-foreground mb-6 text-[15px]">Schedule a free discovery call and let's discuss your business goals.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 text-sm"
          >
            Schedule Discovery Call
          </Link>
        </div>
      </article>
    </div>
  );
}
