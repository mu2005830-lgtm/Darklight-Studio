import { useEffect, useRef } from 'react';
import Ferrofluid from './Ferrofluid';

/**
 * FerrofluidBackground
 *
 * Renders the ferrofluid shader as a fixed full-viewport background that:
 * - sits behind all page content (z-index: -1)
 * - stays fixed while scrolling
 * - never blocks clicks or links (pointer-events: none on the wrapper)
 * - forwards document-level mouse movement to the canvas so mouse
 *   interaction still works even though the canvas is below page content
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
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    >
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
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      />
    </div>
  );
}
