---
name: Lazy loading + AnimatePresence incompatibility
description: React.lazy/Suspense and Framer Motion AnimatePresence mode=wait cannot coexist in the same route tree
---

## Rule
Do NOT use React.lazy() for page components that live inside AnimatePresence mode="wait".

**Why:** AnimatePresence holds the OLD motion.div alive during its exit animation. That old motion.div's children (Switch/Router) still live-update to the new location and try to render the new lazy page. This throws a Suspense Promise from inside a component tree that is mid-unmount:
- Suspense INSIDE AnimatePresence: Promise thrown from mid-exit tree never re-commits → permanent blank screen
- Suspense OUTSIDE AnimatePresence: Suspense hides entire PageTransition → no exit animation → initial={false} also kills enter animation → no transitions at all

**How to apply:** Use eager (static) imports for all pages in the route tree. Keep manualChunks in vite.config for vendor splitting (cache benefit) without affecting page imports.
