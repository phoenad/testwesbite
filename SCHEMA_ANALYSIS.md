# Schema Analysis for Task Tracking

## Tasks from UI (Second Image):
1. ✅ **Refer friends** (0/5) - +100 per → Handled by `referral` table
2. ✅ **Follow @bro_dot_fun** - +150 → `follow` column exists
3. ❌ **Like this** - +50 → **MISSING: `like` column**
4. ⚠️ **Retweet this** - +50 → `reweet` exists but has **TYPO** (should be `retweet`)
5. ✅ **Comment on this** - +50 → `comment` column exists
6. ✅ **Join Telegram** - +100 → `join_tg` column exists
7. ✅ **Tweet this** - +100 → `tweet` column exists
8. ✅ **Daily Check In** - +10 → `daily_check` column exists
9. ❌ **Daily Tweet** - +10 → **MISSING: `daily_tweet` column**

## Current Schema (Third Image):
- `follow` (int4) ✅
- `tweet` (int4) ✅
- `reweet` (int4) ⚠️ **TYPO - should be `retweet`**
- `daily_check` (int4) ✅
- `comment` (int4) ✅
- `join_tg` (int4) ✅

## Issues Found:
1. **Missing `like` column** - needed for "Like this" task (+50 points)
2. **Missing `daily_tweet` column** - needed for "Daily Tweet" task (+10 points)
3. **Typo in `reweet`** - should be renamed to `retweet` for clarity

## Recommended Schema:
```sql
-- Add missing columns
ALTER TABLE your_table_name ADD COLUMN like int4 DEFAULT 0;
ALTER TABLE your_table_name ADD COLUMN daily_tweet int4 DEFAULT 0;

-- Fix typo (optional, but recommended)
ALTER TABLE your_table_name RENAME COLUMN reweet TO retweet;
```

## Complete Schema Should Be:
- `follow` (int4) - Follow task count
- `tweet` (int4) - Tweet task count
- `retweet` (int4) - Retweet task count (fix typo)
- `like` (int4) - Like task count (ADD THIS)
- `comment` (int4) - Comment task count
- `join_tg` (int4) - Join Telegram task count
- `daily_check` (int4) - Daily check-in count
- `daily_tweet` (int4) - Daily tweet count (ADD THIS)

## Additional Considerations:
- You might want to add a `user_id` or `referrer_id` foreign key to link to the referral table
- Consider adding `updated_at` timestamp to track when tasks were last completed
- Consider adding constraints to prevent negative values

