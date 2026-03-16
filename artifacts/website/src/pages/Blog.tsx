import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { usePageTitle } from "@/hooks/use-page-title";
import { Skeleton } from "@/components/ui/skeleton";

function BlogCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-8 h-full flex flex-col">
      <Skeleton className="h-4 w-24 mb-5" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-2/3 mb-6" />
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export default function Blog() {
  usePageTitle("Blog & Resources");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-24 pb-20">
      <section className="py-16 mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Blog & Resources</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights on bookkeeping, business planning, and financial strategy for complex, high-growth operations.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-busy={isLoading} aria-live="polite">
        {isLoading && <span className="sr-only">Loading blog posts...</span>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))
            : blogPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="glass-card-hover rounded-2xl p-8 h-full flex flex-col group cursor-pointer">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[11px] font-mono font-medium tracking-widest text-accent">{post.category.toUpperCase()}</span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">{post.title}</h2>
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
