---
name: PageTransition + CinematicLoader pattern
description: How the page transition system works in Darklightz Studio and known bugs/fixes
---

## Rule
- `CinematicLoader` **must** be wrapped in `<AnimatePresence>` or its `exit` prop animation never fires.
- `PageTransition` uses `AnimatePresence mode="wait" initial={false}` with `key={location}` — `initial={false}` prevents duplicate entry animation since CinematicLoader already handles the initial reveal.
- Keep the fade simple: `opacity + y:6px`, 0.35s. Complex overlays inside AnimatePresence children caused visual glitches and the black-screen freeze bug.

**Why:** The previous implementation had a silver-sweep overlay inside the exiting motion.div with competing opacity animations (exit={{ opacity: 1 }} inside a container with exit={{ opacity: 0 }}), plus CinematicLoader not in AnimatePresence, causing the screen to go black and the new page to appear frozen.

**How to apply:** Any change to page transitions must keep CinematicLoader wrapped in AnimatePresence and preserve the `initial={false}` flag on AnimatePresence.
