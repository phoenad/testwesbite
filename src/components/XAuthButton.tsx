import React, { useState, useEffect } from 'react';
import { Twitter, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function XAuthButton() {
  const { user, loading, signInWithTwitter, signOut } = useAuth();
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
      console.log('📌 Referral code stored from input:', referralCode.trim().toUpperCase());
    }
    
    try {
      await signInWithTwitter();
      // The redirect will happen automatically
    } catch (error: any) {
      toast.error(error?.message || 'Failed to connect with X');
    }
  };

  const handleDisconnect = async () => {
    try {
      await signOut();
      toast.success('Disconnected from X');
    } catch (error: any) {
      toast.error('Failed to disconnect');
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

  // Show connected state
  if (user) {
    const username = user.user_metadata?.user_name || user.user_metadata?.full_name || 'User';
    const displayName = user.user_metadata?.user_name ? `@${user.user_metadata.user_name}` : username;
    
    return (
      <div className="flex items-center gap-2">

      <Button
        onClick={handleDisconnect}
        className="px-6 py-3 cursor-pointer bg-white/10 text-white rounded-full gap-2 border border-white/20 hover:bg-white/40 transition-all duration-300"
        >
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <span className="text-sm font-medium">{displayName}</span>
      </Button>


      <Button
        onClick={handleDisconnect}
        className="px-6 py-3 cursor-pointer bg-white/10 text-white rounded-full gap-2 border border-white/20 hover:bg-white/40 transition-all duration-300"
        >
        {/* <XIcon className="w-4 h-4 text-red-400" /> */}
        <span className="text-sm font-medium">Disconnect</span>
      </Button>
        </div>
    );
  }

  // Show connect button with referral input
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md">
      {/* Referral Code Input */}
      <div className="w-full">
        <Input
          type="text"
          placeholder="Enter referral code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
          className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-full placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
        />
      </div>

      {/* Connect Button */}
      <Button
        onClick={handleConnect}
        className="px-6 py-3 bg-white text-black rounded-full gap-2 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <Twitter className="w-4 h-4" />
        <span className="text-sm font-medium cursor-pointer">Connect with X</span>
      </Button>
    </div>
  );
}

