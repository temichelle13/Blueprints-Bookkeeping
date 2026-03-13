import { Link } from "wouter";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { usePageTitle } from "@/hooks/use-page-title";

export default function Blog() {
  usePageTitle("Blog & Resources");

  return (
    <div className="pt-24 pb-20">
      <section className="py-16 mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Blog & Resources</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights on bookkeeping, business planning, and financial strategy for complex, high-growth operations.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="glass-card-hover rounded-2xl p-8 h-full flex flex-col group cursor-pointer">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[11px] font-mono font-medium tracking-widest text-accent">{post.category.toUpperCase()}</span>
                </div>

                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">{post.title}</h2>
                <p className="text-muted-foreground text-[15px] leading-relaxed mb-6 flex-grow">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="text-accent text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight size={14} />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
