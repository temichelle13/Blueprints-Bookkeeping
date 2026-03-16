import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setApiBaseUrl } from "@workspace/api-client-react";
import { useState, useEffect, useRef } from "react";
import NotFound from "@/pages/not-found";
import { usePageTracking } from "./hooks/usePageTracking";

import { ThemeProvider } from "./hooks/use-theme";
import { Header } from "./components/layout/Header";
import ChatWidget from "./components/ChatWidget";
import CookieConsent, { hasAcceptedCookies } from "./components/CookieConsent";
import { Footer } from "./components/layout/Footer";
import { useRouteAnalytics } from "./hooks/use-route-analytics";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Industries from "./pages/Industries";
import Pricing from "./pages/Pricing";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import Results from "./pages/Results";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import MarketingGuide from "./pages/MarketingGuide";
import Unsubscribe from "./pages/Unsubscribe";
import FAQ from "./pages/FAQ";
import Schedule from "./pages/Schedule";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Feedback from "./pages/Feedback";
import GetStarted from "./pages/GetStarted";
import TaxPartners from "./pages/TaxPartners";
import Referral from "./pages/Referral";
import AdminContracts from "./pages/AdminContracts";
import AdminDashboard from "./pages/AdminDashboard";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import ClientPortal from "./pages/ClientPortal";
import BusinessPlanning from "./pages/BusinessPlanning";
import Status from "./pages/Status";
import PaymentSuccess from "./pages/PaymentSuccess";
import ServiceBookkeeping from "./pages/services/Bookkeeping";
import ServiceBusinessPlans from "./pages/services/BusinessPlans";
import ServiceDigitalHandshake from "./pages/services/DigitalHandshake";
import OregonBookkeeper from "./pages/OregonBookkeeper";
import Resources from "./pages/Resources";

if (import.meta.env.VITE_API_URL) {
  setApiBaseUrl(import.meta.env.VITE_API_URL as string);
}

const queryClient = new QueryClient();

function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const previousLocation = useRef(location);

  useEffect(() => {
    if (location !== previousLocation.current) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        previousLocation.current = location;
        window.scrollTo(0, 0);
        setIsVisible(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [location, children]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 300ms ease, transform 300ms ease",
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
  useRouteAnalytics();

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/industries" component={Industries} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/results" component={Results} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/blog" component={Blog} />
        <Route path="/resources" component={Resources} />
        <Route path="/contact" component={Contact} />
        <Route path="/faq" component={FAQ} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/get-started" component={GetStarted} />
        <Route path="/tax-partners" component={TaxPartners} />
        <Route path="/referral" component={Referral} />
        <Route path="/marketing-guide" component={MarketingGuide} />
        <Route path="/unsubscribe" component={Unsubscribe} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/client-portal" component={ClientPortal} />
        <Route path="/business-planning" component={BusinessPlanning} />
        <Route path="/status" component={Status} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/services/bookkeeping" component={ServiceBookkeeping} />
        <Route path="/services/business-plans" component={ServiceBusinessPlans} />
        <Route path="/services/digital-handshake" component={ServiceDigitalHandshake} />
        <Route path="/oregon-bookkeeper" component={OregonBookkeeper} />
        <Route path="/admin/contracts" component={AdminContracts} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function ConsentAwareChatWidget() {
  const [allowed, setAllowed] = useState(hasAcceptedCookies());

  useEffect(() => {
    const handler = () => setAllowed(hasAcceptedCookies());
    window.addEventListener("cookie-consent-changed", handler);
    return () => window.removeEventListener("cookie-consent-changed", handler);
  }, []);

  if (!allowed) return null;
  return <ChatWidget />;
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
          <ConsentAwareChatWidget />
          <CookieConsent />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
