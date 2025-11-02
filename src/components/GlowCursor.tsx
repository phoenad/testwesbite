import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function GlowCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (!cursor || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });

      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, glow], {
        scale: 1.5,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, glow], {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="glow-cursor" />
      <div ref={cursorRef} className="custom-cursor" />
      <style>{`
        .custom-cursor {
          position: fixed;
          width: 10px;
          height: 10px;
          border: 2px solid rgba(168, 85, 247, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          mix-blend-mode: difference;
        }

        .glow-cursor {
          position: fixed;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          filter: blur(10px);
        }

        @media (max-width: 768px) {
          .custom-cursor,
          .glow-cursor {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
