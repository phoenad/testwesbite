import React, { useState, useEffect } from 'react';
import { Twitter, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function XAuthButton() {
  const { user, loading, signInWithTwitter } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');

  // Auto-fill referral code from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, []);

  const handleConnect = async () => {
    // Store referral code from input to localStorage before connecting
    if (referralCode.trim()) {
      localStorage.setItem('referral_code', referralCode.trim().toUpperCase());
    }
    
    try {
      await signInWithTwitter();
      // The redirect will happen automatically
    } catch (error: any) {
      toast.error(error?.message || 'Failed to connect with X');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Button
        disabled
        className="px-6 py-3 bg-white/10 text-white rounded-full gap-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </Button>
    );
  }

  // Don't show anything when user is logged in (user info is in top right)
  if (user) {
    return null;
  }

  // Show connect button with referral input
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Referral Code Input */}
      <div className="w-full">
        <Input
          type="text"
          placeholder="Enter referral code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
          className="w-full px-4 py-3 bg-white/10 text-white rounded-lg placeholder:text-white/50 focus:outline-none transition-all duration-300"
        />
      </div>

      {/* Connect Button */}
      <Button
        onClick={handleConnect}
        className="w-full px-6 py-3 bg-white text-black rounded-lg gap-2 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
      >
        <Twitter className="w-4 h-4" />
        <span className="text-sm font-medium cursor-pointer">Connect with X</span>
      </Button>
    </div>
  );
}

