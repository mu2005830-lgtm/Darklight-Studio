import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CinematicLoader } from '@/components/CinematicLoader';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ThemeProvider } from '@/lib/theme';
import { useFavicon } from '@/hooks/use-favicon';
import { PortalAuthProvider, usePortalAuth } from '@/lib/portal-auth';

// ── Eager imports — no Suspense, no lazy() ────────────────────────────────
// React.lazy() + AnimatePresence mode="wait" are incompatible: while the old
// motion.div holds its exit animation, its Switch still live-updates to the
// new location and throws a Suspense Promise. That Promise either hides the
// entire PageTransition (Suspense outside) or never re-commits because the
// tree is mid-unmount (Suspense inside) — both kill page transitions.
// Eager imports remove Suspense from the equation entirely.
import Home from '@/pages/home';
import Services from '@/pages/services';
import ServiceDetail from '@/pages/service-detail';
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
import PrivacyPolicy from '@/pages/privacy';
import TermsOfService from '@/pages/terms';
import RefundPolicy from '@/pages/refund-policy';
import CookiePolicy from '@/pages/cookie-policy';
import SubmitReview from '@/pages/submit-review';
import InvoicePrint from '@/pages/portal/invoice-print';

// ── Portal pages ──────────────────────────────────────────────────────────
import PortalLogin from '@/pages/portal/login';
import PortalSignup from '@/pages/portal/signup';
import PortalForgotPassword from '@/pages/portal/forgot-password';
import PortalDashboard from '@/pages/portal/dashboard';
import PortalProject from '@/pages/portal/project';
import PortalMessages from '@/pages/portal/messages';
import PortalRevisions from '@/pages/portal/revisions';
import PortalSupport from '@/pages/portal/support';
import PortalInvoices from '@/pages/portal/invoices';

// ── Scroll-to-top on every route change ───────────────────────────────────
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// ── Portal route guard ────────────────────────────────────────────────────
function RequirePortalAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = usePortalAuth();
  const [, setLocation] = [null, (path: string) => { window.location.href = path; }];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-px h-16 bg-white/20 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    // Redirect to portal login
    window.location.replace(`${import.meta.env.BASE_URL ?? '/'}portal/login`);
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* ── Public site ────────────────────────────────────────────────── */}
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      {/* Service detail — must come after /services */}
      <Route path="/services/:slug" component={ServiceDetail} />
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

      {/* ── Legal pages ───────────────────────────────────────────────── */}
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/submit-review" component={SubmitReview} />

      {/* ── Client Portal — public (auth pages) ──────────────────────── */}
      <Route path="/portal/login" component={PortalLogin} />
      <Route path="/portal/signup" component={PortalSignup} />
      <Route path="/portal/forgot-password" component={PortalForgotPassword} />

      {/* ── Client Portal — protected ─────────────────────────────────── */}
      <Route path="/portal">
        {() => (
          <RequirePortalAuth>
            <PortalDashboard />
          </RequirePortalAuth>
        )}
      </Route>
      <Route path="/portal/projects/:id">
        {() => (
          <RequirePortalAuth>
            <PortalProject />
          </RequirePortalAuth>
        )}
      </Route>
      <Route path="/portal/messages">
        {() => (
          <RequirePortalAuth>
            <PortalMessages />
          </RequirePortalAuth>
        )}
      </Route>
      <Route path="/portal/revisions">
        {() => (
          <RequirePortalAuth>
            <PortalRevisions />
          </RequirePortalAuth>
        )}
      </Route>
      <Route path="/portal/support">
        {() => (
          <RequirePortalAuth>
            <PortalSupport />
          </RequirePortalAuth>
        )}
      </Route>
      <Route path="/portal/invoices">
        {() => (
          <RequirePortalAuth>
            <PortalInvoices />
          </RequirePortalAuth>
        )}
      </Route>
      <Route path="/portal/invoices/:id/print" component={InvoicePrint} />

      <Route component={NotFound} />
    </Switch>
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
        <PortalAuthProvider>
          <AppInner />
          <TooltipProvider>
            <AnimatePresence>
              {showLoader && <CinematicLoader onComplete={() => setShowLoader(false)} />}
            </AnimatePresence>
            <ScrollProgress />
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <ScrollToTop />
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </PortalAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
