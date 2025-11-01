import { useLeaderboard } from '../hooks/useLeaderboard';
import { ArrowLeft, Trophy } from 'lucide-react';

export function LeaderboardPage() {
  const { data, loading, error } = useLeaderboard();

  const handleBack = () => {
    window.location.hash = '';
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: 'white',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '32px'
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            backdropFilter: 'blur(16px)',
            marginBottom: '32px'
          }}
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <Trophy size={48} />
          <h1 style={{ fontSize: '48px', margin: 0 }}>Leaderboard</h1>
        </div>
        <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)' }}>
          Top users ranked by reward points
        </p>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            Loading leaderboard...
          </div>
        )}

        {error && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            fontSize: '18px',
            color: '#ff4444'
          }}>
            Error loading leaderboard. Please try again.
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            No users yet. Be the first!
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.map((user, index) => {
              const rank = index + 1;
              const medals = ['🥇', '🥈', '🥉'];
              const isTopThree = rank <= 3;

              const bgColor = isTopThree
                ? rank === 1 ? 'rgba(255, 215, 0, 0.1)'
                : rank === 2 ? 'rgba(192, 192, 192, 0.1)'
                : 'rgba(205, 127, 50, 0.1)'
                : 'rgba(255, 255, 255, 0.05)';

              const borderColor = isTopThree
                ? rank === 1 ? 'rgba(255, 215, 0, 0.3)'
                : rank === 2 ? 'rgba(192, 192, 192, 0.3)'
                : 'rgba(205, 127, 50, 0.3)'
                : 'rgba(255, 255, 255, 0.1)';

              return (
                <div
                  key={user.id}
                  style={{
                    padding: '20px',
                    backgroundColor: bgColor,
                    borderRadius: '12px',
                    border: `2px solid ${borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    backdropFilter: 'blur(8px)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{
                    fontSize: '32px',
                    width: '50px',
                    textAlign: 'center'
                  }}>
                    {isTopThree ? medals[rank - 1] : rank}
                  </span>
                  <span style={{
                    flex: 1,
                    fontSize: '20px',
                    fontWeight: '500'
                  }}>
                    {user.username}
                  </span>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: isTopThree ? '#fff' : 'rgba(255, 255, 255, 0.9)'
                  }}>
                    {user.reward_points.toLocaleString()} pts
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}