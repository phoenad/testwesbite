import { useState, useEffect } from 'react';
import { BentoGrid } from './components/BentoGrid';
import { ReferralButton } from './components/ReferralButton';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ArrowRight, Twitter } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState('home');

  // Handle URL hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#leaderboard') {
        setCurrentPage('leaderboard');
      } else {
        setCurrentPage('home');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Show leaderboard page if current page is leaderboard
  if (currentPage === 'leaderboard') {
    return <LeaderboardPage />;
  }

  // All 47 image filenames from public/images folder
  const images = [
    '/images/Heading (11).png',
    '/images/IMG_5072.JPEG',
    '/images/IMG_5134.JPEG',
    '/images/IMG_5141.JPEG',
    '/images/IMG_5179.JPEG',
    '/images/IMG_5183.JPEG',
    '/images/IMG_5194.JPG',
    '/images/Untitled design (1).png',
    '/images/Untitled design (5).png',
    '/images/ddddddddd.png',
    '/images/image_2025-07-13_17-59-28.png',
    '/images/image_2025-07-15_17-50-26.png',
    '/images/image_2025-07-17_18-32-34.png',
    '/images/image_2025-07-27_02-46-58.png',
    '/images/image_2025-08-06_16-08-40.png',
    '/images/image_2025-08-12_15-35-42.png',
    '/images/image_2025-08-16_16-49-39.png',
    '/images/image_2025-08-16_16-51-59.png',
    '/images/image_2025-08-16_16-52-27.png',
    '/images/image_2025-08-19_02-20-35.png',
    '/images/image_2025-08-19_23-44-03.png',
    '/images/image_2025-08-20_17-50-08.png',
    '/images/image_2025-08-20_19-46-35.png',
    '/images/image_2025-09-03_13-24-01.png',
    '/images/image_2025-09-05_00-47-30.png',
    '/images/image_2025-09-28_23-44-33.png',
    '/images/image_2025-10-01_14-28-47.png',
    '/images/image_2025-10-01_14-52-33.png',
    '/images/image_2025-10-01_15-07-50.png',
    '/images/image_2025-10-01_15-54-19.png',
    '/images/image_2025-10-01_21-17-33.png',
    '/images/image_2025-10-10_18-21-57.png',
    '/images/image_2025-10-11_01-23-55.png',
    '/images/image_2025-10-27_17-02-20.png',
    '/images/image_2025-10-27_17-02-47.png',
    '/images/image_2025-10-27_17-12-56.png',
    '/images/image_2025-10-27_17-37-14.png',
    '/images/u4517688866_A_stylized_character_resembling_a_purple_skinned_Pe.png',
    '/images/u4517688866_fix_it_ar_11_profile_h9mjv77_v_7_abef1803_682f_48a3.png',
    '/images/u4517688866_fix_it_ar_5877_profile_h9mjv77_v_7_79691067_b1e5_4c24.png',
    '/images/u4517688866_httpss_mj_runnESE_ZGc4sY_fix_ar_5877_stylize_25_2796a265.png',
    '/images/u4517688866_httpss_mj_runpItxFNSSG0c_fix_the_fingers_ar_5877_363b3a42.png',
    '/images/u4517688866_remove_the_logo_ar_5877_stylize_250_v_7_6e32faba_39c8.png',
    '/images/when_my_message_is_so_interesting_,_bill_reading_it_for_3_days_18.png',
    '/images/when_my_message_is_so_interesting_,_bill_reading_it_for_3_days_2.png',
    '/images/when_my_message_is_so_interesting_,_bill_reading_it_for_3_days_59.png',
    '/images/when_my_message_is_so_interesting_,_bill_reading_it_for_3_days_60.png'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(`Thank you! ${email} has been added to the waitlist.`);
      setEmail('');
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <ReferralButton />
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Bento Box Background */}
        <BentoGrid images={images} />

      {/* Hero Section */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 z-10">
        <div className="max-w-5xl w-full text-center space-y-8 md:space-y-12">
          
          {/* Status Badge */}
          <div className="flex justify-center animate-fade-in-up delay-1">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/20"
              style={{ backdropFilter: 'blur(16px)' }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-green" />
              <span className="text-white/90 tracking-wide text-sm">
                Building the future of Monad
              </span>
            </div>
          </div>

          {/* Hero Title */}
          <div className="animate-fade-in-up delay-2">
            <h1 className="hero-title text-white">
              G MONAD
            </h1>
          </div>

          {/* Description */}
          <div className="max-w-3xl mx-auto animate-fade-in-up delay-3">
            <p className="text-white/95 leading-relaxed px-4">
              Gmonad is the beating heart of the Monad ecosystem. It represents the spirit, energy, and identity of the community itself. More than a meme, Gmonad is a movement, the word everyone echoes when they speak of monad. Supported by the strongest believers, builders, and creators in the ecosystem, Gmonad embodies the culture that defines Monad.
            </p>
          </div>

          {/* CTA Card */}
          <div className="max-w-xl mx-auto animate-fade-in-up delay-4 px-4">
            <div className="relative">
              {/* Glow Effect */}
              <div className="glow-effect" />

              {/* Card */}
              <div 
                className="relative bg-black/50 border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl"
                style={{ backdropFilter: 'blur(24px)' }}
              >
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-white/70 text-sm block text-left">
                      Join the waitlist
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-xl h-14 px-5 transition-all duration-300 hover:bg-white/15 focus:bg-white/15 focus:border-white/40 placeholder:text-white/40"
                      style={{ backdropFilter: 'blur(8px)' }}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="btn-gradient-hover w-full bg-white text-black h-14 rounded-xl gap-2 group shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span>Get Early Access</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>

                <p className="text-white/50 text-xs mt-4 text-center">
                  Join 10,000+ community members already onboard
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 animate-fade-in-up delay-5">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link w-14 h-14 rounded-2xl bg-black/40 border border-white/20 text-white/70 hover:text-white hover:bg-black/60 hover:border-white/40 flex items-center justify-center transition-all duration-300"
              style={{ backdropFilter: 'blur(16px)' }}
            >
              <Twitter className="w-5 h-5" />
            </a>

            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link w-14 h-14 rounded-2xl bg-black/40 border border-white/20 text-white/70 hover:text-white hover:bg-black/60 hover:border-white/40 flex items-center justify-center transition-all duration-300"
              style={{ backdropFilter: 'blur(16px)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>

            <a
              href="https://telegram.org"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link w-14 h-14 rounded-2xl bg-black/40 border border-white/20 text-white/70 hover:text-white hover:bg-black/60 hover:border-white/40 flex items-center justify-center transition-all duration-300"
              style={{ backdropFilter: 'blur(16px)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-8 animate-fade-in delay-5">
            <div className="scroll-indicator mx-auto animate-float">
              <div className="scroll-dot animate-scroll-bounce" />
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
