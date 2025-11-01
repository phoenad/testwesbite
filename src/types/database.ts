export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          reward_points: number;
          wallet_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          reward_points?: number;
          wallet_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          reward_points?: number;
          wallet_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export type LeaderboardEntry = {
  id: string;
  username: string;
  reward_points: number;
};
