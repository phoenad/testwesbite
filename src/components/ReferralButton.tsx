import React, { useState, useEffect } from 'react';
import { Gift, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export function ReferralButton() {
  const { user } = useAuth();
  const [showLink, setShowLink] = useState(false);
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch referral code when showing
  useEffect(() => {
    if (user && showLink && !referralCode) {
      fetchOrCreateReferralCode();
    }
  }, [showLink, referralCode, user]);

  // Only show if user is logged in (after all hooks)
  if (!user) {
    return null;
  }

  const fetchOrCreateReferralCode = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Check if user already has a referral code
      const { data: existing, error: fetchError } = await supabase
        .from('referral')
        .select('referral_code')
        .eq('referrer_id', user.id)
        .limit(1)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        return;
      }

      if (existing?.referral_code) {
        setReferralCode(existing.referral_code);
        setLoading(false);
        return;
      }

      // Generate new referral code from user ID (first 8 chars, uppercase)
      const code = user.id.substring(0, 8).toUpperCase().replace(/-/g, '');
      
      // Get X username
      const username = user.user_metadata?.user_name || user.user_metadata?.full_name || null;
      
      // Insert into database
      const { error: insertError } = await supabase
        .from('referral')
        .insert({
          referrer_id: user.id,
          referral_code: code,
          points_awarded: 0,
          username: username,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating referral code:', insertError);
        // If it's a unique constraint error, try fetching again
        if (insertError.code === '23505') {
          const { data: retryData } = await supabase
            .from('referral')
            .select('referral_code')
            .eq('referrer_id', user.id)
            .maybeSingle();
          if (retryData?.referral_code) {
            setReferralCode(retryData.referral_code);
          }
        }
      } else {
        setReferralCode(code);
      }
    } catch (error) {
      console.error('Error in fetchOrCreateReferralCode:', error);
    } finally {
      setLoading(false);
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
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleToggle = () => {
    setShowLink(!showLink);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleToggle}
        className="px-4 py-2 bg-white/10 text-white rounded-full gap-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
      >
        <Gift className="w-4 h-4" />
        <span className="text-sm font-medium">Referral Links</span>
      </Button>

      {showLink && (
        <div className="flex items-center gap-2 mt-2 animate-fade-in">
          <Button
            onClick={handleCopy}
            size="sm"
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/20 max-w-md">
            {loading ? (
              <span className="text-sm text-white/70">Generating...</span>
            ) : (
              <p className="text-sm font-mono text-white break-all">
                {referralLink || 'Failed to generate link'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

