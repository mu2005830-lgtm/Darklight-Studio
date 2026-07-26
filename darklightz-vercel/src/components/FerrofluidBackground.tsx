import { useEffect, useRef } from 'react';
import Ferrofluid from './Ferrofluid';

/**
 * FerrofluidBackground
 *
 * Renders the ferrofluid shader as a fixed full-viewport background that:
 * - sits behind all page content (z-index: -2)
 * - stays fixed while scrolling
 * - never blocks clicks or links (pointer-events: none on the wrapper)
 * - forwards document-level mouse movement to the canvas so mouse
 *   interaction still works even though the canvas is below page content
 *
 * A separate semi-transparent dark overlay (z-index: -1) sits above the
 * ferrofluid but below all page content for readability.
 */
export function FerrofluidBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Forward document mousemove → canvas pointermove so the shader receives
  // mouse coordinates even though the canvas is behind page content.
  useEffect(() => {
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
  }, []);

  return (
    <>
      {/* Ferrofluid canvas layer — fixed, behind everything */}
      <div
        ref={wrapperRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          pointerEvents: 'none',
          width: '100vw',
          height: '100vh',
        }}
      >
        <Ferrofluid
          colors={['#FFFFFF', '#D9D9D9', '#A3A3A3']}
          speed={0.3}
          scale={1.8}
          turbulence={0.8}
          fluidity={0.08}
          rimWidth={0.18}
          sharpness={3}
          shimmer={1.2}
          glow={1.3}
          opacity={0.85}
          mouseInteraction
          mouseStrength={0.8}
          mouseRadius={0.3}
          mouseDampening={0.2}
          flowDirection="down"
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        />
      </div>

      {/* Very subtle dark overlay — just enough to maintain text contrast */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background: 'rgba(0, 0, 0, 0.25)',
        }}
      />
    </>
  );
}
