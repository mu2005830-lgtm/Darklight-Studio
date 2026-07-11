import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useState } from 'react';
import { CinematicLoader } from '@/components/CinematicLoader';
import { PageTransition } from '@/components/PageTransition';
import { ScrollProgress } from '@/components/ScrollProgress';

// Pages
import Home from '@/pages/home';
import Services from '@/pages/services';
import Portfolio from '@/pages/portfolio';
import CaseStudies from '@/pages/case-studies';
import CaseStudyDetail from '@/pages/case-study-detail';
import About from '@/pages/about';
import Pricing from '@/pages/pricing';
import Blog from '@/pages/blog';
import BlogDetail from '@/pages/blog-detail';
import Contact from '@/pages/contact';
import BookACall from '@/pages/book-a-call';
import AdminDashboard from '@/pages/admin';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <PageTransition>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/case-studies/:slug" component={CaseStudyDetail} />
        <Route path="/about" component={About} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogDetail} />
        <Route path="/contact" component={Contact} />
        <Route path="/book-a-call" component={BookACall} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function App() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {showLoader && <CinematicLoader onComplete={() => setShowLoader(false)} />}
        <ScrollProgress />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
