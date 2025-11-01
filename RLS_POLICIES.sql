-- RLS Policies for referral table
-- Run these ONE AT A TIME in Supabase SQL Editor

-- First, drop existing policies if they exist (run these first if you get errors)
-- DROP POLICY IF EXISTS "Users can view their own referrals" ON public.referral;
-- DROP POLICY IF EXISTS "Users can create referrals" ON public.referral;
-- DROP POLICY IF EXISTS "Users can update their referrals" ON public.referral;

-- Policy 1: Allow authenticated users to SELECT their own referrals
CREATE POLICY "Users can view their own referrals"
ON public.referral
FOR SELECT
USING (
  auth.uid() = referrer_id OR 
  auth.uid() = referee_id
);

-- Policy 2: Allow authenticated users to INSERT referrals where they are the referrer
CREATE POLICY "Users can create referrals"
ON public.referral
FOR INSERT
WITH CHECK (
  auth.uid() = referrer_id
);

-- Policy 3: Allow authenticated users to UPDATE referrals where they are the referrer
CREATE POLICY "Users can update their referrals"
ON public.referral
FOR UPDATE
USING (auth.uid() = referrer_id);

