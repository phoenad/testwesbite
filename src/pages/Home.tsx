import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, ArrowBigRight, ArrowBigDown, Loader2 } from 'lucide-react';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';
import { XAuthButton } from '../components/XAuthButton';
import { UserProfile } from '../components/UserProfile';
import { TaskList } from '../components/TaskList';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabase';


export function Home() {
  const { user, session, loading } = useAuth();
  const hasShownWelcome = useRef(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);

  // Show success message when user logs in (once) and handle errors
  useEffect(() => {
    // Check for OAuth errors in URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');
    
    if (error && !hasShownWelcome.current) {
      // Clear error from URL
      window.history.replaceState(null, '', window.location.pathname);
      
      if (errorDescription?.includes('email')) {
        toast.error('Twitter authentication requires email access. Please check your Twitter app permissions.');
      } else {
        toast.error(`Authentication error: ${errorDescription || error}`);
      }
      hasShownWelcome.current = true;
      return;
    }
    
    if (user && session && !hasShownWelcome.current) {
      // Welcome toast removed
      hasShownWelcome.current = true;
    }
  }, [user, session]);

  useEffect(() => {
    if (user && session) {
      fetchUserRank();
    }
  }, [user, session]);

  const fetchUserRank = async () => {
    if (!user) return;

    try {
      // Fetch all referral records with all point fields
      const { data, error } = await supabase
        .from('referral')
        .select('referrer_id, username, points_awarded, referee_points, follow, tweet, retweet, like, comment, join_tg, daily_check, daily_tweet');

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      // Group by referrer_id and sum all points
      const userPoints: Record<string, {
        referrer_id: string;
        total_points: number;
      }> = {};

      data?.forEach((row) => {
        const referrerId = row.referrer_id;
        
        if (!userPoints[referrerId]) {
          userPoints[referrerId] = {
            referrer_id: referrerId,
            total_points: 0,
          };
        }

        // Sum all point fields
        const total = 
          (row.points_awarded || 0) + 
          (row.referee_points || 0) + 
          (row.follow || 0) + 
          (row.tweet || 0) + 
          (row.retweet || 0) + 
          (row.like || 0) + 
          (row.comment || 0) + 
          (row.join_tg || 0) + 
          (row.daily_check || 0) + 
          (row.daily_tweet || 0);
        
        userPoints[referrerId].total_points += total;
      });

      // Calculate total points and sort
      const leaderboardData = Object.values(userPoints).map((entry) => ({
        ...entry,
        total_points: entry.total_points,
      }));

      // Sort by total points descending
      leaderboardData.sort((a, b) => b.total_points - a.total_points);

      // Find user's rank
      const userIndex = leaderboardData.findIndex(entry => entry.referrer_id === user.id);
      if (userIndex !== -1) {
        setUserRank(userIndex + 1);
      }
      
      setTotalParticipants(leaderboardData.length);
    } catch (error) {
      console.error('Error in fetchUserRank:', error);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
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

        {/* G MONAD Heading - Top Center */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider uppercase">
            GMONAD
          </h1>
        </div>

        {/* User Profile - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <UserProfile />
        </div>

        {/* Hero Section */}
        <div className="relative flex min-h-screen flex-col px-6 z-10">
          <div className="max-w-5xl w-full mx-auto flex flex-col min-h-screen">
            
            {/* Spacer for top elements */}
            <div className="pt-20"></div>

            {/* Middle Section - Connect Button or Leaderboard + Social Icons */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {loading ? (
                /* Loading Spinner */
                <div className="animate-fade-in-up delay-4">
                  <div className="w-full max-w-5xl">
                    <div className="rounded-xl bg-gradient-to-b from-purple-900/30 via-pink-900/20 to-purple-800/20 backdrop-blur-md border border-purple-500/20 shadow-xl flex flex-col items-center justify-center p-12">
                      <Loader2 className="w-8 h-8 animate-spin text-white/60" />
                    </div>
                  </div>
                </div>
              ) : user ? (
                /* Task List, View Leaderboard Button and Social Links - Centered */
                <div className="flex flex-col items-center gap-6 animate-fade-in-up delay-4">
                  {/* User Rank Display */}
                  {userRank !== null && (
                    <div className="text-center mb-2">
                      <p className="text-lg sm:text-xl text-white">
                        You're{' '}
                        <span className="text-pink-400 font-bold">#{userRank}</span>
                        {totalParticipants > 0 && (
                          <span className="text-white/70 text-sm sm:text-base">
                            {' '}out of {totalParticipants.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {/* Task List with Leaderboard Button */}
                  <div className="w-full max-w-5xl">
                    {/* Card Container */}
                    <div className="rounded-xl bg-gradient-to-b from-purple-900/30 via-pink-900/20 to-purple-800/20 backdrop-blur-md border border-purple-500/20 shadow-xl flex flex-col">
                      {/* Task List */}
                      <div className="p-3 pb-0">
                        <TaskList />
                      </div>
                      
                      {/* View Leaderboard Button - Full Width at Bottom */}
                      <Link to="/leaderboard" className="w-full">
                        <button className="w-full p-3 text-sm font-medium text-white bg-black/30 border-t border-white/5 rounded-b-xl hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
                          <span>View Leaderboard</span>
                          <ArrowBigRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* Connect Button in Card */
                <div className="animate-fade-in-up delay-4">
                  <div className="rounded-lg border border-white/20 bg-black/30 backdrop-blur-md max-w-md shadow-xl overflow-hidden">
                    {/* Heading */}
                    <div className="p-6 text-center border-b border-white/10">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Connect with X
                      </h2>
                      <p className="text-sm text-white/70">
                        Join G Monad and start earning points
                      </p>
                    </div>
                    {/* Connect Button */}
                    <div className="p-6">
                      <XAuthButton />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

