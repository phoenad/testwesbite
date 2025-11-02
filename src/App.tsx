import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FaXTwitter, FaDiscord, FaTelegram, FaEnvelope } from 'react-icons/fa6';

export default function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animated text entrance with memecoin energy
    const ctx = gsap.context(() => {
      // Main content fade in
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Logo animation
      gsap.from(logoRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        delay: 0.1,
        ease: 'back.out(1.7)',
      });

      // Heading animation with bounce
      gsap.from(headingRef.current, {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.7,
        delay: 0.2,
        ease: 'power3.out',
      });

      // Text blocks stagger animation
      if (textRef.current) {
        const paragraphs = textRef.current.querySelectorAll('p');
        gsap.from(paragraphs, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.4,
          ease: 'power2.out',
        });
      }

      // Social links animation
      gsap.from(socialRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.8,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        .tooltip-wrapper {
          position: relative;
        }
        
        .tooltip {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: 100;
        }
        
        .tooltip-wrapper:hover .tooltip {
          opacity: 1;
        }
        
        .tooltip-content {
          background: white;
          color: black;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          white-space: nowrap;
          position: relative;
        }
        
        .tooltip-arrow {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          background: white;
        }
      `}</style>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/gmonad.PNG)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(3px)',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Logo - Top Left */}
      <div ref={logoRef} className="absolute top-4 left-4 sm:top-8 sm:left-8 z-30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40 animate-pulse">
            <span className="text-white text-2xl sm:text-3xl md:text-4xl font-black">G</span>
          </div>
        </div>
      </div>

      {/* Main Content - Full screen with padding */}
      <div ref={contentRef} className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center space-y-16 sm:space-y-24 md:space-y-32 lg:space-y-40 max-w-6xl mx-auto">

          {/* Main Heading - AKONY Font */}
          <h1
            ref={headingRef}
            className="font-black tracking-wider bg-gradient-to-r from-yellow-300 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse leading-none uppercase"
            style={{
              fontFamily: "'AKONY', sans-serif",
              fontSize: 'clamp(2.33rem, 4.67vw, 5.33rem)',
              textShadow: "0 0 120px rgba(168, 85, 247, 0.8)",
              WebkitTextStroke: "2px rgba(255, 255, 255, 0.1)"
            }}
          >
            GMONAD
          </h1>

          {/* Description Text - Professional Typography */}
          <div ref={textRef} className="space-y-6 sm:space-y-8 md:space-y-10 max-w-5xl mx-auto px-2">

            {/* First paragraph */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-white/95 leading-relaxed">
              Born from the Monad community's ethos of <span className="text-yellow-300 font-bold">"community first,"</span> Gmonad is the original meme that became a movement. What started as a spark of shared belief has grown into a <span className="text-purple-400 font-bold">cultural phenomenon</span> with <span className="text-pink-400 font-black">1B+ impressions</span> across the monad ecosystem and mentions from Phantom, MetaMask, OpenSea, OKX, Magic Eden, and CT legends like Hsaka, Ansem, InverseBrah, Deeze, and more.
            </p>

            {/* Second paragraph - Highlighted */}
            <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-white leading-relaxed">
                Fueled by pure <span className="text-purple-400 font-bold">community energy</span> and a <span className="text-pink-400 font-bold">cult-like following</span>, Gmonad isn't just a meme.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black bg-gradient-to-r from-yellow-300 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide leading-tight">
                It's the official community token of Monad and the soul of its culture.
              </p>
            </div>

          </div>

          {/* Social Links - Professional Design */}
          <div ref={socialRef} className="flex items-center justify-center gap-4 sm:gap-6 pt-8 sm:pt-12 mt-4 sm:mt-8">

            {/* Twitter/X */}
            <a
              href="https://x.com/gmonadofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              aria-label="Twitter"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-white/60 group-hover:bg-white/5 group-hover:scale-110 text-white/70 group-hover:text-white">
                <FaXTwitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </a>

            {/* Discord - Coming Soon */}
            <div className="tooltip-wrapper">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/20 flex items-center justify-center transition-all duration-300 hover:border-white/30 text-white/40 cursor-not-allowed">
                <FaDiscord className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="tooltip">
                <div className="tooltip-content">
                  Coming Soon
                  <div className="tooltip-arrow" />
                </div>
              </div>
            </div>

            {/* Telegram - Coming Soon */}
            <div className="tooltip-wrapper">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/20 flex items-center justify-center transition-all duration-300 hover:border-white/30 text-white/40 cursor-not-allowed">
                <FaTelegram className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="tooltip">
                <div className="tooltip-content">
                  Coming Soon
                  <div className="tooltip-arrow" />
                </div>
              </div>
            </div>

            {/* Email */}
            <a
              href="mailto:contact@gmonad.casino"
              className="tooltip-wrapper"
              aria-label="Email"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/20 flex items-center justify-center transition-all duration-300 hover:border-purple-400/60 hover:bg-purple-500/10 hover:scale-110 text-white/70 hover:text-purple-300">
                <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="tooltip">
                <div className="tooltip-content">
                  contact@gmonad.casino
                  <div className="tooltip-arrow" />
                </div>
              </div>
            </a>

          </div>

        </div>
      </div>

      </div>
    </>
  );
}
