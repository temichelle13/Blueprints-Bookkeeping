import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setApiBaseUrl } from "@workspace/api-client-react";
import NotFound from "@/pages/not-found";

import { Header } from "./components/layout/Header";
import ChatWidget from "./components/ChatWidget";
import { Footer } from "./components/layout/Footer";

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
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import ClientPortal from "./pages/ClientPortal";
import BusinessPlanning from "./pages/BusinessPlanning";

if (import.meta.env.VITE_API_URL) {
  setApiBaseUrl(import.meta.env.VITE_API_URL as string);
}

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Router() {
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
        <Route path="/admin/contracts" component={AdminContracts} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
