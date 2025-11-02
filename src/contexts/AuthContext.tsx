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
    
    if (!referralCode) {
      return;
    }

    try {
      const codeUpper = referralCode.toUpperCase().trim();

      // Find the referrer by referral code (get referrer_id and username)
      const { data: referralData, error: findError } = await supabase
        .from('referral')
        .select('referrer_id, username')
        .eq('referral_code', codeUpper)
        .is('referee_id', null) // Get the initial referral code row (not the awarded points row)
        .maybeSingle();

      if (findError) {
        console.error('Error finding referral code:', findError);
        localStorage.removeItem('referral_code');
        return;
      }

      if (!referralData) {
        localStorage.removeItem('referral_code');
        return;
      }

      const referrerId = referralData.referrer_id;

      // Don't allow self-referral
      if (referrerId === newUser.id) {
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
        localStorage.removeItem('referral_code');
        return;
      }

      // Get referrer's username (from the original referral code row)
      const referrerUsername = referralData.username || null;
      
      // Get referee's X username
      const refereeUsername = newUser.user_metadata?.user_name || newUser.user_metadata?.full_name || null;
      
      // Validate user ID
      if (!newUser.id) {
        return;
      }
      
      // Step 1: UPDATE the referrer's row - give them points_awarded
      const { error: updateError } = await supabase
        .from('referral')
        .update({
          referee_id: newUser.id, // Set the referee's user ID
          points_awarded: 10, // 10 points for referrer (person who shared the link)
        })
        .eq('referral_code', codeUpper)
        .is('referee_id', null); // Only update rows that haven't been used yet

      if (updateError) {
        console.error('❌ Error updating referrer points:', updateError);
        return;
      }

      // Step 2: Check if referee already has a referral row, if not create one
      const { data: refereeRow, error: checkError } = await supabase
        .from('referral')
        .select('id')
        .eq('referrer_id', newUser.id)
        .is('referee_id', null)
        .maybeSingle();

      // Step 3: INSERT or UPDATE referee's row with referee_points
      if (!refereeRow) {
        // Create new row for referee with their own referral code
        const refereeCode = newUser.id.substring(0, 8).toUpperCase().replace(/-/g, '');
        const { error: insertError } = await supabase
          .from('referral')
          .insert({
            referrer_id: newUser.id,
            referral_code: refereeCode,
            referee_points: 10, // 10 points for using a referral code
            username: refereeUsername,
            points_awarded: 0, // They haven't shared any codes yet
          });

        if (insertError) {
          console.error('Error creating referee row:', insertError);
        }
      } else {
        // Update existing referee row - add to their referee_points
        const { data: existingReferee, error: getExistingError } = await supabase
          .from('referral')
          .select('referee_points')
          .eq('referrer_id', newUser.id)
          .is('referee_id', null)
          .single();

        const currentRefereePoints = existingReferee?.referee_points || 0;
        const newRefereePoints = currentRefereePoints + 10;

        const { error: updateRefereeError } = await supabase
          .from('referral')
          .update({
            referee_points: newRefereePoints,
          })
          .eq('referrer_id', newUser.id)
          .is('referee_id', null);

        if (updateRefereeError) {
          console.error('Error updating referee points:', updateRefereeError);
        }
      }

      localStorage.removeItem('referral_code');
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

