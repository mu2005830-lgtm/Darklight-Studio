import { useEffect, useRef } from 'react';
import Ferrofluid from './Ferrofluid';

/**
 * FerrofluidBackground
 *
 * Fixed full-viewport background layer. Sits at z-index 0 with its own
 * black backdrop so the white ferrofluid shapes are visible. Page content
 * must be wrapped at z-index 1 or higher (see App.tsx).
 *
 * IMPORTANT: z-index must be 0 or positive — negative z-index places the
 * element *behind* the html element's own background, making it invisible.
 */
export function FerrofluidBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);

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
        zIndex: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        // Canvas is transparent (alpha: true) — html background (#000) shows through
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
