import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { LeaderboardEntry } from '../types/database';

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('id, username, reward_points')
        .order('reward_points', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      setData(users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading, error, refetch: fetchLeaderboard };
}
