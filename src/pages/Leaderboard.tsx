  import React, { useEffect, useState } from 'react';
  import { Home as HomeIcon, Loader2 } from 'lucide-react';
  import { Link } from 'react-router-dom';
  import { supabase } from '../lib/supabase';
  import { Button } from '../components/ui/button';
  import { Toaster } from '../components/ui/sonner';

  interface LeaderboardEntry {
    username: string | null;
    referrer_id: string;
    total_points: number;
    points_awarded: number;
    referee_points: number;
    follow: number;
    tweet: number;
    retweet: number;
    like: number;
    comment: number;
    join_tg: number;
    daily_check: number;
    daily_tweet: number;
  }

  export function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // Fetch all referral records with all point fields
        const { data, error } = await supabase
          .from('referral')
          .select('referrer_id, username, points_awarded, referee_points, follow, tweet, retweet, like, comment, join_tg, daily_check, daily_tweet');

        if (error) {
          console.error('Error fetching leaderboard:', error);
          return;
        }

        // Group by referrer_id and sum all points
        const userPoints: Record<string, LeaderboardEntry> = {};

        data?.forEach((row) => {
          const referrerId = row.referrer_id;
          
          if (!userPoints[referrerId]) {
            userPoints[referrerId] = {
              referrer_id: referrerId,
              username: row.username || null,
              points_awarded: 0,
              referee_points: 0,
              follow: 0,
              tweet: 0,
              retweet: 0,
              like: 0,
              comment: 0,
              join_tg: 0,
              daily_check: 0,
              daily_tweet: 0,
              total_points: 0,
            };
          }

          // Sum all point fields
          userPoints[referrerId].points_awarded += row.points_awarded || 0;
          userPoints[referrerId].referee_points += row.referee_points || 0;
          userPoints[referrerId].follow += row.follow || 0;
          userPoints[referrerId].tweet += row.tweet || 0;
          userPoints[referrerId].retweet += row.retweet || 0;
          userPoints[referrerId].like += row.like || 0;
          userPoints[referrerId].comment += row.comment || 0;
          userPoints[referrerId].join_tg += row.join_tg || 0;
          userPoints[referrerId].daily_check += row.daily_check || 0;
          userPoints[referrerId].daily_tweet += row.daily_tweet || 0;
        });

        // Calculate total points (sum of all point fields) and sort
        const leaderboardData = Object.values(userPoints).map((entry) => ({
          ...entry,
          total_points: 
            entry.points_awarded + 
            entry.referee_points + 
            entry.follow + 
            entry.tweet + 
            entry.retweet + 
            entry.like + 
            entry.comment + 
            entry.join_tg + 
            entry.daily_check + 
            entry.daily_tweet,
        }));

        // Sort by total points descending
        leaderboardData.sort((a, b) => b.total_points - a.total_points);

        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error in fetchLeaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    // Truncate user ID for display (like wallet addresses)
    const truncateId = (id: string) => {
      if (!id) return '';
      return `${id.substring(0, 4)}...${id.substring(id.length - 3)}`;
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

          {/* Navigation - Top Left */}
          <div className="absolute top-6 left-6 z-20">
            <Link to="/">
              <button className="px-4 py-2 rounded-lg border border-white/20 bg-black/30 backdrop-blur-md text-white hover:bg-black/40 transition-all duration-300 flex items-center gap-2">
                <HomeIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </button>
            </Link>
          </div>

          {/* G MONAD Heading - Top Center */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
            <h1 className="text-2xl sm:text-3xl font-black tracking-wider uppercase">
              GMONAD
            </h1>
          </div>

          {/* Hero Section */}
          <div className="relative flex min-h-screen flex-col px-6 z-10">
            <div className="max-w-5xl w-full mx-auto flex flex-col min-h-screen">
              
              {/* Spacer for top elements */}
              <div className="pt-20"></div>

              {/* Middle Section - Leaderboard */}
              <div className="flex-1 flex flex-col items-center justify-start pt-8">
                <div className="flex flex-col items-center gap-6 animate-fade-in-up delay-4 w-full">
                  {/* Leaderboard Container */}
                  <div className="w-full max-w-xl">
                    <div className="rounded-xl flex flex-col">
                      {/* Header */}
                      <div className="p-3 pb-0">
                        <div className="text-center mb-3">
                          <h2 className="text-xl font-bold text-white mb-5">
                            Leaderboard
                          </h2>
                        </div>

                        {/* Leaderboard Entries */}
                        <div className="space-y-2 pb-2">
                          {loading ? (
                            <div className="flex items-center justify-center py-12">
                              <Loader2 className="w-8 h-8 animate-spin text-white/60" />
                            </div>
                          ) : leaderboard.length === 0 ? (
                            <div className="text-center py-12 text-white/60">
                              <p>No leaderboard data yet.</p>
                            </div>
                          ) : (
                            leaderboard.map((entry, index) => {
                              const rank = index + 1;
                              const displayId = entry.username || truncateId(entry.referrer_id);
                              
                              return (
                                <div 
                                  key={entry.referrer_id} 
                                  className="w-full flex items-center justify-between p-2 rounded-md border border-white/5 bg-black/30 hover:bg-black/40 transition-all duration-200"
                                >
                                  {/* Rank and Name */}
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className="text-sm font-medium text-white/80 whitespace-nowrap">#{rank}</span>
                                    <span className="text-sm font-medium text-white/80 truncate">
                                      {displayId}
                                    </span>
                                  </div>
                                  
                                  {/* Points */}
                                  <span className="text-sm font-semibold text-green-400 whitespace-nowrap flex-shrink-0">
                                    +{entry.total_points}
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

