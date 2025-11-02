import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle2, Share2, Gift } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface ReferralDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReferralDialog({ open, onOpenChange }: ReferralDialogProps) {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);


  // Generate or get referral code for user
  useEffect(() => {
    if (user && open) {
      fetchOrCreateReferralCode();
      fetchPoints();
    }
  }, [user, open]);

  const fetchOrCreateReferralCode = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Check if user already has a referral code (use maybeSingle to handle no rows)
      const { data: existing, error: fetchError } = await supabase
        .from('referral')
        .select('referral_code')
        .eq('referrer_id', user.id)
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching referral code:', fetchError);
        // If it's a permission error, show helpful message
        if (fetchError.code === 'PGRST301' || fetchError.message?.includes('permission')) {
          toast.error('Database permissions error. Please check RLS policies.');
        }
      }

      if (existing?.referral_code) {
        setReferralCode(existing.referral_code);
        setLoading(false);
        return;
      }

      // Generate new referral code from user ID (first 8 chars, uppercase)
      const code = user.id.substring(0, 8).toUpperCase().replace(/-/g, '');
      
      // Insert into database
      const { data: insertData, error: insertError } = await supabase
        .from('referral')
        .insert({
          referrer_id: user.id,
          referral_code: code,
            points_awarded: 0,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating referral code:', insertError);
        // If it's a unique constraint error, the code might already exist, try fetching again
        if (insertError.code === '23505') {
          const { data: retryData } = await supabase
            .from('referral')
            .select('referral_code')
            .eq('referrer_id', user.id)
            .maybeSingle();
          if (retryData?.referral_code) {
            setReferralCode(retryData.referral_code);
          }
        } else {
          toast.error(`Failed to create referral code: ${insertError.message}`);
        }
      } else {
        setReferralCode(code);
      }
    } catch (error: any) {
      console.error('Error in fetchOrCreateReferralCode:', error);
      toast.error('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPoints = async () => {
    if (!user) return;

    try {
      // Sum all points from referrals where this user is the referrer and has a referee
      const { data, error } = await supabase
        .from('referral')
        .select('points_awarded')
        .eq('referrer_id', user.id)
        .not('referee_id', 'is', null);

      if (error) {
        console.error('Error fetching points:', error);
        // Don't show error toast for points, just log it
        return;
      }

      if (data && data.length > 0) {
        const totalPoints = data.reduce((sum, ref) => sum + (ref.points_awarded || 0), 0);
        setPoints(totalPoints);
      } else {
        setPoints(0);
      }
    } catch (error) {
      console.error('Error in fetchPoints:', error);
    }
  };

  const referralLink = referralCode 
    ? `${window.location.origin}?ref=${referralCode}`
    : '';

  const handleCopy = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (!referralLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join G Monad',
          text: 'Join me on G Monad!',
          url: referralLink,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/95 border border-white/20 text-white z-[9999] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="w-5 h-5 text-yellow-400" />
            Referral Links
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Share your link and earn 10 points for each person who joins!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Points Display */}
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Total Points Earned</p>
                <p className="text-2xl font-bold text-yellow-400">{points}</p>
              </div>
              <Gift className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          {/* Referral Link */}
          <div className="space-y-2">
            <label className="text-sm text-white/70">Your Referral Link</label>
            {loading ? (
              <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 bg-white/10 rounded-lg p-3 border border-white/20">
                  <p className="text-sm font-mono break-all">{referralLink || 'Generating...'}</p>
                </div>
                <Button
                  onClick={handleCopy}
                  className="px-4 bg-white/10 hover:bg-white/20 border border-white/20"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Share Button */}
          <Button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 font-medium"
            disabled={!referralLink || loading}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Referral Link
          </Button>

          {/* Info */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              💡 Each friend who signs up using your link earns you 10 points!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

