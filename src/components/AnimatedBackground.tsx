import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particleCount = 50;
    const particles: HTMLDivElement[] = [];

    // Create floating particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 2-6px
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random starting position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random opacity
      particle.style.opacity = `${Math.random() * 0.5 + 0.3}`;
      
      container.appendChild(particle);
      particles.push(particle);

      // Animate each particle
      gsap.to(particle, {
        y: `${-100 - Math.random() * 200}`,
        x: `${Math.random() * 100 - 50}`,
        opacity: 0,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        delay: Math.random() * 2,
        ease: 'power1.inOut',
      });
    }

    // Create shooting stars
    const createShootingStar = () => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 50}%`;
      container.appendChild(star);

      gsap.to(star, {
        x: -300,
        y: 300,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.in',
        onComplete: () => {
          star.remove();
        },
      });
    };

    // Create shooting stars periodically
    const starInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        createShootingStar();
      }
    }, 2000);

    // Cleanup
    return () => {
      clearInterval(starInterval);
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="animated-background" />
      <style>{`
        .animated-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0) 70%);
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
        }

        .shooting-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
          pointer-events: none;
        }

        .shooting-star::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%);
          transform: translateX(-100px);
        }
      `}</style>
    </>
  );
}
