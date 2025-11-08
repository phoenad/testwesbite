# Referral Table Design - Storing Task Counts

## Current Pattern (Good!)
Your code already uses this pattern:
- **Rows with `referee_id IS NULL`** = User's own data (their referral code, points, etc.)
- **Rows with `referee_id NOT NULL`** = Referral relationships (when someone uses their code)

## Recommended Approach: Store Task Counts on User's Own Row

Store all task counts on the row where:
- `referrer_id` = user's ID
- `referee_id IS NULL`

This is the same row that stores:
- `referral_code`
- `points_awarded`
- `referee_points`
- `username`

## Complete Schema for `referral` Table:

```sql
-- Core referral fields
id (int8, primary key)
created_at (timestamp, default now())
referrer_id (uuid) -- The user who owns this row
referee_id (uuid, nullable) -- NULL for user's own row, set when someone uses their code
referral_code (text)
points_awarded (int4, default 0) -- Points from successful referrals
referee_points (int4, default 0) -- Points for using a referral code
username (text)

-- Task tracking fields (all int4, default 0)
follow (int4, default 0)
tweet (int4, default 0)
retweet (int4, default 0)
like (int4, default 0)
comment (int4, default 0)
join_tg (int4, default 0)
daily_check (int4, default 0)
daily_tweet (int4, default 0)
```

## How to Query/Update Task Counts:

### Get User's Task Counts:
```typescript
const { data } = await supabase
  .from('referral')
  .select('follow, tweet, retweet, like, comment, join_tg, daily_check, daily_tweet')
  .eq('referrer_id', user.id)
  .is('referee_id', null)
  .single();
```

### Increment Task Count:
```typescript
// Example: User completed a follow task
const { data: current } = await supabase
  .from('referral')
  .select('follow')
  .eq('referrer_id', user.id)
  .is('referee_id', null)
  .single();

await supabase
  .from('referral')
  .update({ follow: (current?.follow || 0) + 1 })
  .eq('referrer_id', user.id)
  .is('referee_id', null);
```

### Or use PostgreSQL increment (better):
```typescript
await supabase.rpc('increment_task', {
  user_id: user.id,
  task_name: 'follow'
});
```

## Important Notes:

1. **Task counts should only be on rows where `referee_id IS NULL`**
   - These are the user's "own" rows
   - Don't store task counts on referral relationship rows

2. **Default values should be 0, not NULL**
   - Makes calculations easier
   - Prevents null handling issues

3. **Consider adding constraints:**
   ```sql
   ALTER TABLE referral 
   ADD CONSTRAINT check_task_counts_non_negative 
   CHECK (
     follow >= 0 AND 
     tweet >= 0 AND 
     retweet >= 0 AND 
     like >= 0 AND 
     comment >= 0 AND 
     join_tg >= 0 AND 
     daily_check >= 0 AND 
     daily_tweet >= 0
   );
   ```

4. **For leaderboard calculations:**
   You'll need to sum task points separately from referral points:
   ```typescript
   // Get user's total points
   const taskPoints = (follow * 150) + (tweet * 100) + (retweet * 50) + 
                      (like * 50) + (comment * 50) + (join_tg * 100) + 
                      (daily_check * 10) + (daily_tweet * 10);
   
   const referralPoints = points_awarded + referee_points;
   const totalPoints = taskPoints + referralPoints;
   ```

## Alternative: Separate Table (If you want cleaner separation)

If you prefer separation of concerns:
- Keep `referral` table for referral relationships only
- Create a `user_tasks` table with `user_id` and all task counts

But storing in the same table is fine and simpler for your use case!

