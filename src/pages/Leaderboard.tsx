  import React, { useEffect, useState } from 'react';
  import { Home as HomeIcon, Loader2 } from 'lucide-react';
  import { Link } from 'react-router-dom';
  import { supabase } from '../lib/supabase';
  import { Button } from '../components/ui/button';

  interface LeaderboardEntry {
    username: string | null;
    referrer_id: string;
    total_points: number;
    points_awarded: number;
    referee_points: number;
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
        
        // Fetch all referral records
        const { data, error } = await supabase
          .from('referral')
          .select('referrer_id, username, points_awarded, referee_points');

        if (error) {
          console.error('Error fetching leaderboard:', error);
          return;
        }

        // Group by referrer_id and sum points
        const userPoints: Record<string, LeaderboardEntry> = {};

        data?.forEach((row) => {
          const referrerId = row.referrer_id;
          
          if (!userPoints[referrerId]) {
            userPoints[referrerId] = {
              referrer_id: referrerId,
              username: row.username || null,
              points_awarded: 0,
              referee_points: 0,
              total_points: 0,
            };
          }

          // Sum points
          userPoints[referrerId].points_awarded += row.points_awarded || 0;
          userPoints[referrerId].referee_points += row.referee_points || 0;
        });

        // Calculate total points and sort
        const leaderboardData = Object.values(userPoints).map((entry) => ({
          ...entry,
          total_points: entry.points_awarded + entry.referee_points,
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
      <div className="min-h-screen bg-black text-white p-6">
        {/* Navigation - Top Left */}
        <div className="mb-8">
          <Link to="/">
            <Button className="px-4 py-2 bg-gray-800 text-white rounded-full gap-2 border border-gray-700 hover:bg-gray-700 transition-all duration-300">
              <HomeIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Button>
          </Link>
        </div>

        {/* Title - Top Center */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-2">
            Leaderboard
          </h1>
        </div>

        {/* Leaderboard Entries - Centered with Cards */}
        <div className="max-w-2xl mx-auto space-y-4 flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-white/60" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-20 text-white/60">
              <p>No leaderboard data yet.</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1;
              const displayId = entry.username || truncateId(entry.referrer_id);
              
              return (
                <div 
                  key={entry.referrer_id} 
                  className="flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-lg w-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  {/* Rank and Name - Close together */}
                  <div className="flex items-center gap-4  pr-4">
                    <span className="text-white text-base font-medium">#{rank}</span>
                    <span className="text-white text-base">
                      {displayId}
                    </span>
                  </div>
                  
                  {/* Points - All white text */}
                  <span className="text-white text-base font-medium ml-20">
                    +{entry.total_points}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

