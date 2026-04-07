import { Link } from "wouter";
import { ArrowLeft, Search } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

export default function NotFound() {
  usePageTitle("Page Not Found");

  return (
    <div className="pt-24 pb-20 min-h-[80vh] flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 mb-8">
          <Search className="w-9 h-9 text-accent" />
        </div>

        <h1 className="text-6xl md:text-7xl font-display font-extrabold text-white mb-4">
          404
        </h1>
        <p className="text-xl text-muted-foreground mb-2">Page not found</p>
        <p className="text-muted-foreground text-[15px] leading-relaxed max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:shadow-xl hover:shadow-accent/20 transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-accent/30 text-accent font-semibold text-sm hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link
            href="/services"
            className="hover:text-accent transition-colors"
          >
            Services
          </Link>
          <Link href="/pricing" className="hover:text-accent transition-colors">
            Pricing
          </Link>
          <Link href="/faq" className="hover:text-accent transition-colors">
            FAQ
          </Link>
          <Link href="/blog" className="hover:text-accent transition-colors">
            Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
