import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useState, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CinematicLoader } from '@/components/CinematicLoader';
import { PageTransition } from '@/components/PageTransition';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ThemeProvider } from '@/lib/theme';
import { useFavicon } from '@/hooks/use-favicon';

// ── Lazy-loaded pages — each becomes its own JS chunk ──────────────────────
// This cuts the initial bundle from ~892KB to ~250KB (only shell + home load upfront).
const Home          = lazy(() => import('@/pages/home'));
const Services      = lazy(() => import('@/pages/services'));
const Portfolio     = lazy(() => import('@/pages/portfolio'));
const CaseStudies   = lazy(() => import('@/pages/case-studies'));
const CaseStudyDetail = lazy(() => import('@/pages/case-study-detail'));
const About         = lazy(() => import('@/pages/about'));
const Pricing       = lazy(() => import('@/pages/pricing'));
const Blog          = lazy(() => import('@/pages/blog'));
const BlogDetail    = lazy(() => import('@/pages/blog-detail'));
const Contact       = lazy(() => import('@/pages/contact'));
const BookACall     = lazy(() => import('@/pages/book-a-call'));
const AdminDashboard = lazy(() => import('@/pages/admin'));
const NotFound      = lazy(() => import('@/pages/not-found'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

/** Minimal inline fallback — invisible div so layout doesn't shift. */
function PageFallback() {
  return <div style={{ flex: 1, minHeight: '100dvh' }} />;
}

function Router() {
  return (
    <PageTransition>
      <Suspense fallback={<PageFallback />}>
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
      </Suspense>
    </PageTransition>
  );
}

/** Inner component so it has access to QueryClientProvider */
function AppInner() {
  useFavicon();
  return null;
}

function App() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppInner />
        <TooltipProvider>
          <AnimatePresence>
            {showLoader && <CinematicLoader onComplete={() => setShowLoader(false)} />}
          </AnimatePresence>
          <ScrollProgress />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
