import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Track referral code from URL on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      // Store referral code in localStorage
      localStorage.setItem('referral_code', refCode);
      console.log('📌 Referral code stored:', refCode);
    }
  }, []);

  useEffect(() => {
    // Check active session and handle OAuth callback
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('Error getting session:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
      })
      .catch((error) => {
        console.error('Failed to get session:', error);
      })
      .finally(() => {
        setLoading(false);
      });

    // Listen for auth changes (including OAuth callbacks)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      // Update session/user immediately, don't wait for referral processing
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false); // Set loading to false immediately
      
      // Handle errors from URL hash (OAuth errors)
      if (event === 'SIGNED_IN' && session?.user) {
        // Check for errors in URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          // Clear the error from URL
          window.history.replaceState(null, '', window.location.pathname);
          
          // Show user-friendly error
          if (errorDescription?.includes('email')) {
            // This is the email error - we'll handle it gracefully
            console.warn('Twitter did not return email, but user may still be authenticated');
          }
        }
        
        // Process referral if user signed up via referral link (async, don't block)
        processReferral(session.user).catch((err) => {
          console.error('Error processing referral:', err);
        });
      } else if (event === 'SIGNED_OUT') {
        // Clear referral code on sign out
        localStorage.removeItem('referral_code');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Process referral when new user signs up
  const processReferral = async (newUser: User) => {
    const referralCode = localStorage.getItem('referral_code');
    
    console.log('🔍 Processing referral for user:', newUser.id);
    console.log('📌 Referral code from localStorage:', referralCode);
    
    if (!referralCode) {
      console.log('❌ No referral code found in localStorage');
      return;
    }

    try {
      const codeUpper = referralCode.toUpperCase().trim();
      console.log('🔍 Searching for referral code:', codeUpper);
      
      // First, try to find ANY row with this referral code (to debug)
      const { data: allCodes, error: allCodesError } = await supabase
        .from('referral')
        .select('id, referrer_id, referee_id, referral_code, username')
        .eq('referral_code', codeUpper);
      
      console.log('🔍 All rows with this code:', allCodes);
      console.log('🔍 Error (if any):', allCodesError);

      // Find the referrer by referral code (get referrer_id and username)
      const { data: referralData, error: findError } = await supabase
        .from('referral')
        .select('referrer_id, username')
        .eq('referral_code', codeUpper)
        .is('referee_id', null) // Get the initial referral code row (not the awarded points row)
        .maybeSingle();

      console.log('🔍 Query result:', referralData);
      console.log('🔍 Query error:', findError);

      if (findError) {
        console.error('❌ Error finding referral code:', findError);
        console.error('❌ Error code:', findError.code);
        console.error('❌ Error message:', findError.message);
        localStorage.removeItem('referral_code');
        return;
      }

      if (!referralData) {
        console.log('❌ Referral code not found or invalid:', codeUpper);
        console.log('❌ This might be due to:');
        console.log('   1. No row with this code and referee_id = null');
        console.log('   2. RLS policy blocking the query');
        console.log('   3. Code was already used');
        localStorage.removeItem('referral_code');
        return;
      }

      console.log('✅ Found referral data:', referralData);

      const referrerId = referralData.referrer_id;

      // Don't allow self-referral
      if (referrerId === newUser.id) {
        console.log('Self-referral not allowed');
        localStorage.removeItem('referral_code');
        return;
      }

      // Check if this referral already exists (prevent duplicate)
      const { data: existing } = await supabase
        .from('referral')
        .select('id')
        .eq('referrer_id', referrerId)
        .eq('referee_id', newUser.id)
        .single();

      if (existing) {
        console.log('Referral already processed');
        localStorage.removeItem('referral_code');
        return;
      }

      // Get referrer's username (from the original referral code row)
      const referrerUsername = referralData.username || null;
      
      // Get referee's X username
      const refereeUsername = newUser.user_metadata?.user_name || newUser.user_metadata?.full_name || null;
      
      // Validate user ID
      if (!newUser.id) {
        console.error('❌ Invalid user ID:', newUser.id);
        return;
      }
      
      console.log('📝 Updating referral with referee_id:', newUser.id);
      
      // UPDATE the existing referral code row instead of inserting a new one
      // This awards points to both referrer and referee
      const { data: updatedData, error: updateError } = await supabase
        .from('referral')
        .update({
          referee_id: newUser.id, // Set the referee's user ID
          points_awarded: 10, // 10 points for referrer (person who shared the link)
          referee_points: 10, // 10 points for referee (person who just connected)
          // Keep the existing username (referrer's username)
        })
        .eq('referral_code', codeUpper)
        .is('referee_id', null) // Only update rows that haven't been used yet
        .select()
        .single();

      if (updateError) {
        console.error('❌ Error updating referral:', updateError);
        console.error('❌ Error details:', JSON.stringify(updateError, null, 2));
      } else {
        console.log('✅ Referral processed! 10 points awarded to both referrer and referee');
        console.log('✅ Updated data:', updatedData);
        localStorage.removeItem('referral_code');
      }
    } catch (error) {
      console.error('Error processing referral:', error);
    }
  };

  const signInWithTwitter = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error('Error signing in with Twitter:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithTwitter, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

