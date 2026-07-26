---
name: Ferrofluid z-index fix
description: Why negative z-index hides the ferrofluid WebGL canvas and the correct layering pattern.
---

# Ferrofluid z-index — do not use negative values

## The rule
The `FerrofluidBackground` wrapper must use `zIndex: 0` (or positive), never negative.

**Why:** A `position: fixed` element with a negative z-index goes *behind* the stacking context of its parent — which is the `<html>` element itself. If `html` has `background: #000`, the canvas is painted behind that background and is completely invisible regardless of what the canvas renders.

## Correct layering pattern
```
html { background: transparent }          ← no competing backdrop
FerrofluidBackground: z-index 0,          ← background: #000 lives here
  position: fixed, background: '#000'
  Ferrofluid canvas (transparent, white shapes)
App content wrapper: z-index 1,           ← in App.tsx, wraps all routes
  position: relative
```

**Why:** `html` is transparent so there's no competing background. The wrapper div owns the black backdrop. The canvas renders white shapes on top of it. Page content at z-index 1 sits above the whole stack.

## How to apply
Any time a full-screen background canvas is added behind page content — WebGL, canvas 2D, video — use this pattern. Do NOT use `z-index: -1` or `-2` unless the parent explicitly creates a non-root stacking context (transform, filter, will-change, opacity < 1) that is itself above the html background.
