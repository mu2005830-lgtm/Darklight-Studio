import { useEffect, useRef, useState } from 'react';
import Ferrofluid from './Ferrofluid';

/**
 * FerrofluidBackground
 *
 * Fixed full-viewport background layer. Sits at z-index 0 with its own
 * black backdrop so the white ferrofluid shapes are visible. Page content
 * must be wrapped at z-index 1 or higher (see App.tsx).
 *
 * On mobile (< 768px wide) we use zoomed-out, calmer parameters so the
 * blobs look refined rather than giant particles filling a small screen.
 */
export function FerrofluidBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  // Track breakpoint changes (rotation, resize)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Forward mouse events to the canvas (desktop only — no mouse on mobile)
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = wrapperRef.current?.querySelector('canvas');
      if (!canvas) return;
      canvas.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: false,
        })
      );
    };
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        // Canvas is transparent (alpha: true) — html background (#000) shows through
      }}
    >
      {isMobile ? (
        /* ── Mobile ─────────────────────────────────────────────────────────
           Higher scale = smaller blobs (coordinate space zoomed out).
           Lower turbulence / glow / shimmer = calm, subtle look on small screens.
           No mouse interaction (touch devices don't have a cursor).
        ──────────────────────────────────────────────────────────────────── */
        <Ferrofluid
          colors={['#ffffff', '#ffffff', '#ffffff']}
          speed={0.35}
          scale={3.2}
          turbulence={0.55}
          fluidity={0.12}
          rimWidth={0.18}
          sharpness={2.2}
          shimmer={0.8}
          glow={1.4}
          flowDirection="down"
          opacity={0.85}
          mouseInteraction={false}
          mouseStrength={0}
          mouseRadius={0.35}
          dpr={1}
        />
      ) : (
        /* ── Desktop ─────────────────────────────────────────────────────── */
        <Ferrofluid
          colors={['#ffffff', '#ffffff', '#ffffff']}
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={2.5}
          shimmer={1.5}
          glow={2}
          flowDirection="down"
          opacity={1}
          mouseInteraction
          mouseStrength={1}
          mouseRadius={0.35}
          dpr={1}
        />
      )}
    </div>
  );
}
