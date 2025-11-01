import { Trophy } from 'lucide-react';

export function ReferralButton() {
  const handleClick = () => {
    // Navigate to leaderboard page
    window.location.hash = '#leaderboard';
  };

  // Simplified button with explicit styling to ensure visibility
  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        backdropFilter: 'blur(16px)',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500'
      }}
      aria-label="Open referral leaderboard"
    >
      <Trophy size={20} />
      <span>Referral</span>
    </button>
  );
}
