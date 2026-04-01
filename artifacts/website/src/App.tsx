import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setApiBaseUrl } from "@workspace/api-client-react";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import NotFound from "@/pages/not-found";
import { usePageTracking } from "./hooks/usePageTracking";

import { ThemeProvider } from "./hooks/use-theme";
import { Header } from "./components/layout/Header";
import CookieConsent from "./components/CookieConsent";
import { Footer } from "./components/layout/Footer";

// Lazy load ChatWidget to reduce initial bundle size
const ChatWidget = lazy(() => import("./components/ChatWidget"));

// Lazy load all route components for better code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Industries = lazy(() => import("./pages/Industries"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Contact = lazy(() => import("./pages/Contact"));
const Results = lazy(() => import("./pages/Results"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const MarketingGuide = lazy(() => import("./pages/MarketingGuide"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const ComplianceSecurity = lazy(() => import("./pages/ComplianceSecurity"));
const Feedback = lazy(() => import("./pages/Feedback"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const TaxPartners = lazy(() => import("./pages/TaxPartners"));
const Referral = lazy(() => import("./pages/Referral"));
const AdminContracts = lazy(() => import("./pages/AdminContracts"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Welcome = lazy(() => import("./pages/Welcome"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const BusinessPlanning = lazy(() => import("./pages/BusinessPlanning"));
const Status = lazy(() => import("./pages/Status"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const ServiceBookkeeping = lazy(() => import("./pages/services/Bookkeeping"));
const ServiceBusinessPlans = lazy(
  () => import("./pages/services/BusinessPlans"),
);
const OregonBookkeeper = lazy(() => import("./pages/OregonBookkeeper"));

if (import.meta.env.VITE_API_URL) {
  setApiBaseUrl(import.meta.env.VITE_API_URL as string);
}

const queryClient = new QueryClient();
const NOINDEX_FALLBACK_PATH_PREFIXES = [
  "/admin",
  "/onboarding",
  "/welcome",
  "/payment-success",
  "/status",
  "/feedback",
  "/unsubscribe",
  "/marketing-guide",
];

function normalizePathname(pathname: string): string {
  if (!pathname) return "/";
  return pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;
}

function isSensitivePath(pathname: string): boolean {
  const normalizedPath = normalizePathname(pathname);
  return NOINDEX_FALLBACK_PATH_PREFIXES.some((prefix) => {
    const normalizedPrefix = normalizePathname(prefix);
    return (
      normalizedPath === normalizedPrefix ||
      normalizedPath.startsWith(`${normalizedPrefix}/`)
    );
  });
}

function SensitiveRouteNoindexFallback() {
  const [location] = useLocation();

  useEffect(() => {
    const fallbackMetaId = "sensitive-route-noindex-fallback";
    const shouldNoindex = isSensitivePath(location);

    // Always operate on a single meta[name="robots"] element.
    let robotsMeta = document.querySelector('meta[name="robots"]') as
      | HTMLMetaElement
      | null;

    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }

    if (shouldNoindex) {
      robotsMeta.setAttribute("content", "noindex, nofollow");
      robotsMeta.setAttribute("data-source", fallbackMetaId);
      return;
    }

    // Only revert changes if this fallback previously set the robots meta.
    if (robotsMeta.getAttribute("data-source") === fallbackMetaId) {
      robotsMeta.removeAttribute("data-source");
      // Restore a neutral default; other components may overwrite this as needed.
      robotsMeta.setAttribute("content", "index, follow");
    }
  }, [location]);

  return null;
}

// Loading fallback component for lazy-loaded routes
function RouteLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div
        className="text-center"
        role="status"
        aria-live="polite"
        aria-label="Loading content"
      >
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const previousLocation = useRef(location);

  useEffect(() => {
    if (location !== previousLocation.current) {
      setIsVisible(false);
      // Use requestAnimationFrame for smoother transitions and reduced INP impact
      let timeoutId: number | undefined;
      let innerRafId: number | undefined;
      const rafId = requestAnimationFrame(() => {
        timeoutId = window.setTimeout(() => {
          setDisplayChildren(children);
          previousLocation.current = location;
          window.scrollTo(0, 0);
          // Shorter delay for better INP
          innerRafId = requestAnimationFrame(() => {
            setIsVisible(true);
          });
        }, 150); // Reduced from 200ms to 150ms
      });
      return () => {
        cancelAnimationFrame(rafId);
        if (innerRafId !== undefined) {
          cancelAnimationFrame(innerRafId);
        }
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }
      };
    }

    return undefined;
  }, [location, children]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 250ms ease, transform 250ms ease", // Slightly faster transition
        willChange: "opacity, transform", // Hint for browser optimization
      }}
    >
      {displayChildren}
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  usePageTracking();

  return (
    <Layout>
      <SensitiveRouteNoindexFallback />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/industries" component={Industries} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/about/credentials" component={Portfolio} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/results" component={Results} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/blog" component={Blog} />
          <Route path="/contact" component={Contact} />
          <Route path="/faq" component={FAQ} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/cookies" component={CookiePolicy} />
          <Route path="/compliance-security" component={ComplianceSecurity} />
          <Route path="/feedback" component={Feedback} />
          <Route path="/get-started" component={GetStarted} />
          <Route path="/tax-partners" component={TaxPartners} />
          <Route path="/referral" component={Referral} />
          <Route path="/marketing-guide" component={MarketingGuide} />
          <Route path="/unsubscribe" component={Unsubscribe} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/business-planning" component={BusinessPlanning} />
          <Route path="/status" component={Status} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route path="/services/bookkeeping" component={ServiceBookkeeping} />
          <Route
            path="/services/business-plans"
            component={ServiceBusinessPlans}
          />
          <Route path="/oregon-bookkeeper" component={OregonBookkeeper} />
          <Route path="/admin/contracts" component={AdminContracts} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>
          <CookieConsent />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
