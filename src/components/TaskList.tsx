import React, { useState, useEffect } from 'react';
import { Twitter, Heart, Repeat2, MessageSquare, Send, Calendar, ArrowRight, CheckCircle2, Users, Copy, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { ReferralDialog } from './ReferralDialog';
 
interface TaskCounts {
  follow: number;
  tweet: number;
  retweet: number;
  like: number;
  comment: number;
  join_tg: number;
  daily_check: number;
  daily_tweet: number;
}

interface TaskBooleans {
  is_followed: boolean;
  is_tweeted: boolean;
  is_retweet: boolean;
  is_liked: boolean;
  is_comment: boolean;
  is_tg: boolean;
  is_dailycheck: boolean;
  is_dtweet: boolean;
}

interface Task {
  id: string;
  name: string;
  icon: React.ReactNode;
  points: number;
  field: keyof TaskCounts;
  url?: string;
  action?: () => void;
}

export function TaskList() {
  const { user } = useAuth();
  const [taskCounts, setTaskCounts] = useState<TaskCounts>({
    follow: 0,
    tweet: 0,
    retweet: 0,
    like: 0,
    comment: 0,
    join_tg: 0,
    daily_check: 0,
    daily_tweet: 0,
  });
  const [loading, setLoading] = useState(true);
  const [verifyingTaskId, setVerifyingTaskId] = useState<string | null>(null);
  const [dailyCheckLastCompleted, setDailyCheckLastCompleted] = useState<Date | null>(null);
  const [referralCount, setReferralCount] = useState<number>(0);
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [showReferralLink, setShowReferralLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralDialogOpen, setReferralDialogOpen] = useState(false);
  const [taskBooleans, setTaskBooleans] = useState<TaskBooleans>({
    is_followed: false,
    is_tweeted: false,
    is_retweet: false,
    is_liked: false,
    is_comment: false,
    is_tg: false,
    is_dailycheck: false,
    is_dtweet: false,
  });

  useEffect(() => {
    if (user) {
      fetchTaskCounts();
      fetchReferralData();
      // Load daily check last completed time from localStorage
      const lastCompleted = localStorage.getItem(`daily_check_${user.id}`);
      if (lastCompleted) {
        setDailyCheckLastCompleted(new Date(lastCompleted));
      }
    }
  }, [user]);

  const fetchTaskCounts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('referral')
        .select('follow, tweet, retweet, like, comment, join_tg, daily_check, daily_tweet, is_followed, is_tweeted, is_retweet, is_liked, is_comment, is_tg, is_dailycheck, is_dtweet')
        .eq('referrer_id', user.id)
        .is('referee_id', null)
        .maybeSingle();

      if (error) {
        console.error('Error fetching task counts:', error);
        return;
      }

      if (data) {
        setTaskCounts({
          follow: data.follow || 0,
          tweet: data.tweet || 0,
          retweet: data.retweet || 0,
          like: data.like || 0,
          comment: data.comment || 0,
          join_tg: data.join_tg || 0,
          daily_check: data.daily_check || 0,
          daily_tweet: data.daily_tweet || 0,
        });
        setTaskBooleans({
          is_followed: data.is_followed || false,
          is_tweeted: data.is_tweeted || false,
          is_retweet: data.is_retweet || false,
          is_liked: data.is_liked || false,
          is_comment: data.is_comment || false,
          is_tg: data.is_tg || false,
          is_dailycheck: data.is_dailycheck || false,
          is_dtweet: data.is_dtweet || false,
        });
      } else {
        // Row doesn't exist, create it as a fallback
        const referralCode = user.id.substring(0, 8).toUpperCase().replace(/-/g, '');
        const username = user.user_metadata?.user_name || user.user_metadata?.full_name || null;
        
        const { error: insertError } = await supabase
          .from('referral')
          .insert({
            referrer_id: user.id,
            referral_code: referralCode,
            username: username,
            points_awarded: 0,
            referee_points: 0,
            follow: 0,
            tweet: 0,
            retweet: 0,
            like: 0,
            comment: 0,
            join_tg: 0,
            daily_check: 0,
            daily_tweet: 0,
            is_followed: false,
            is_tweeted: false,
            is_retweet: false,
            is_liked: false,
            is_comment: false,
            is_tg: false,
            is_dailycheck: false,
            is_dtweet: false,
          });

        if (insertError && insertError.code !== '23505') {
          // 23505 is unique constraint - row might have been created by another process
          console.error('Error creating referral row in fetchTaskCounts:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in fetchTaskCounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      // Get referral code
      const { data: referralData, error: referralError } = await supabase
        .from('referral')
        .select('referral_code')
        .eq('referrer_id', user.id)
        .is('referee_id', null)
        .maybeSingle();

      if (referralData?.referral_code) {
        const code = referralData.referral_code;
        setReferralCode(code);
        setReferralLink(`${window.location.origin}?ref=${code}`);
      } else if (!referralError) {
        // Generate referral code if doesn't exist
        const code = user.id.substring(0, 8).toUpperCase().replace(/-/g, '');
        setReferralCode(code);
        setReferralLink(`${window.location.origin}?ref=${code}`);
      }

      // Count successful referrals (where referee_id is not null)
      const { data: referrals, error: countError } = await supabase
        .from('referral')
        .select('id')
        .eq('referrer_id', user.id)
        .not('referee_id', 'is', null);

      if (!countError && referrals) {
        setReferralCount(referrals.length);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  const handleCopyReferralLink = async () => {
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

  // Helper function to map task field to its corresponding is_* boolean field
  const getBooleanFieldName = (field: keyof TaskCounts): keyof TaskBooleans => {
    const fieldMap: Record<keyof TaskCounts, keyof TaskBooleans> = {
      follow: 'is_followed',
      tweet: 'is_tweeted',
      retweet: 'is_retweet',
      like: 'is_liked',
      comment: 'is_comment',
      join_tg: 'is_tg',
      daily_check: 'is_dailycheck',
      daily_tweet: 'is_dtweet',
    };
    return fieldMap[field];
  };

  const isTaskAvailable = (task: Task): boolean => {
    // Daily check can be done every 24 hours
    if (task.field === 'daily_check') {
      if (!dailyCheckLastCompleted) return true;
      const now = new Date();
      const lastCompleted = new Date(dailyCheckLastCompleted);
      const hoursSinceLastCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);
      return hoursSinceLastCompletion >= 24;
    }
    
    // All tasks: available if not completed (count === 0)
    const count = taskCounts[task.field] || 0;
    return count === 0;
  };

  const handleTaskClick = async (task: Task) => {
    if (!user) return;

    // Check if task is available (one-time tasks or 24h cooldown for daily)
    if (!isTaskAvailable(task)) {
      if (task.field === 'daily_check') {
        const now = new Date();
        const lastCompleted = new Date(dailyCheckLastCompleted!);
        const hoursSinceLastCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);
        const hoursRemaining = Math.ceil(24 - hoursSinceLastCompletion);
        toast.info(`Daily check-in available in ${hoursRemaining} hour(s).`);
      } else {
        toast.info('This task has already been completed.');
      }
      return;
    }

    // Get the corresponding boolean field name
    const booleanField = getBooleanFieldName(task.field);
    
    // Check if already clicked (waiting for verification)
    if (taskBooleans[booleanField]) {
      toast.info('Please verify this task first.');
      return;
    }

    // Open external links for social tasks
    if (task.url) {
      window.open(task.url, '_blank');
    } else if (task.field === 'follow') {
      window.open('https://x.com/gmonadofficial', '_blank');
    } else if (task.field === 'join_tg' || task.field === 'tweet') {
      // Leave these for now - don't open anything
      toast.info(`Complete this task on ${task.name} to earn points!`);
    } else {
      toast.info(`Complete this task on ${task.name} to earn points!`);
    }

    // Set the corresponding is_* field to true in database
    try {
      const updateData: Record<string, boolean> = { [booleanField]: true };
      console.log(`Updating ${booleanField} for task ${task.field}:`, updateData);
      const { error } = await supabase
        .from('referral')
        .update(updateData)
        .eq('referrer_id', user.id)
        .is('referee_id', null);

      if (error) {
        console.error(`Error updating ${booleanField}:`, error);
        toast.error('Failed to update task status. Please try again.');
      } else {
        console.log(`Successfully updated ${booleanField} to true`);
        // Update local state
        setTaskBooleans((prev) => ({
          ...prev,
          [booleanField]: true,
        }));
      }
    } catch (error) {
      console.error(`Error in handleTaskClick for ${task.field}:`, error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleVerify = async (task: Task) => {
    if (!user) return;

    // Prevent multiple clicks - check if already verifying
    if (verifyingTaskId === task.id) {
      return;
    }

    // Get the corresponding boolean field name
    const booleanField = getBooleanFieldName(task.field);
    
    // Check if the task was clicked (is_* field should be true)
    if (!taskBooleans[booleanField]) {
      toast.info('Please click the task first.');
      return;
    }

    // Check if task is available (one-time tasks or 24h cooldown for daily)
    if (!isTaskAvailable(task)) {
      if (task.field === 'daily_check') {
        const now = new Date();
        const lastCompleted = new Date(dailyCheckLastCompleted!);
        const hoursSinceLastCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);
        const hoursRemaining = Math.ceil(24 - hoursSinceLastCompletion);
        toast.info(`Daily check-in available in ${hoursRemaining} hour(s).`);
      } else {
        toast.info('This task has already been completed.');
      }
      return;
    }

    // Set verifying state to prevent multiple clicks
    setVerifyingTaskId(task.id);

    try {
      // Get current count
      const currentCount = taskCounts[task.field] || 0;
      // Add task points value (e.g., 150 for follow, 50 for like, etc.)
      const newCount = currentCount + task.points;

      // Update database with new count and reset the is_* field
      const updateData: Record<string, any> = {
        [task.field]: newCount,
        [booleanField]: false,
      };

      const { error } = await supabase
        .from('referral')
        .update(updateData)
        .eq('referrer_id', user.id)
        .is('referee_id', null);

      if (error) {
        console.error('Error updating task count:', error);
        toast.error('Failed to verify task. Please try again.');
        return;
      }

      // Update local state
      setTaskCounts((prev) => ({
        ...prev,
        [task.field]: newCount,
      }));

      // Reset the is_* boolean field
      setTaskBooleans((prev) => ({
        ...prev,
        [booleanField]: false,
      }));

      // For daily_check, store the completion timestamp
      if (task.field === 'daily_check') {
        const now = new Date();
        setDailyCheckLastCompleted(now);
        localStorage.setItem(`daily_check_${user.id}`, now.toISOString());
      }

      toast.success(`Task verified! You earned ${task.points} points!`);
    } catch (error) {
      console.error('Error in handleVerify:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      // Reset verifying state
      setVerifyingTaskId(null);
    }
  };

  const tweetUrl = 'https://x.com/gmonadofficial/status/1801239820884406430';

  const tasks: Task[] = [
    {
      id: 'referral',
      name: 'Refer friends',
      icon: <Gift className="w-4 h-4" />,
      points: 100,
      field: 'follow', // Placeholder, won't be used for referral
    },
    {
      id: 'retweet',
      name: 'Retweet this',
      icon: <Repeat2 className="w-4 h-4" />,
      points: 50,
      field: 'retweet',
      url: tweetUrl,
    },
    {
      id: 'comment',
      name: 'Comment on this',
      icon: <MessageSquare className="w-4 h-4" />,
      points: 50,
      field: 'comment',
      url: tweetUrl,
    },
    {
      id: 'join_tg',
      name: 'Join Telegram',
      icon: <Send className="w-4 h-4" />,
      points: 100,
      field: 'join_tg',
    },
    {
      id: 'tweet',
      name: 'Tweet this',
      icon: <Twitter className="w-4 h-4" />,
      points: 100,
      field: 'tweet',
    },
    {
      id: 'daily_check',
      name: 'Daily Check In',
      icon: <Calendar className="w-4 h-4" />,
      points: 10,
      field: 'daily_check',
    },
    {
      id: 'daily_tweet',
      name: 'Daily Tweet',
      icon: <Twitter className="w-4 h-4" />,
      points: 10,
      field: 'daily_tweet',
    },
    {
      id: 'follow',
      name: 'Follow @gmonadofficial',
      icon: <Twitter className="w-4 h-4" />,
      points: 100,
      field: 'follow',
    },
    {
      id: 'like',
      name: 'Like this',
      icon: <Heart className="w-4 h-4" />,
      points: 50,
      field: 'like',
      url: tweetUrl,
    },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-lg animate-pulse">
        <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-3 h-72" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
     <div className='text-center mb-3 px-12'>
        <h2 className="text-sm font-bold text-white">
          Earn GMonad Points to move up the list
        </h2>
     </div>

      {/* Task List */}
      <div className="space-y-2 pb-2">
          {tasks.map((task) => {
            const count = taskCounts[task.field];
            const isTaskAvail = isTaskAvailable(task);
            // For referral, never show as completed or verify. For daily_check, it's never "completed" - just on cooldown. For others, check if count > 0
            const isCompleted = task.id === 'referral'
              ? false  // Referral is never completed
              : task.field === 'daily_check' 
              ? false  // Daily check is never permanently completed
              : count > 0;
            // Get the corresponding boolean field and check if it's true (skip for referral)
            const booleanField: keyof TaskBooleans | null = task.id === 'referral' ? null : getBooleanFieldName(task.field);
            const showVerify = task.id === 'referral' ? false : (booleanField ? taskBooleans[booleanField] : false);
            
            // Calculate cooldown hours for daily_check
            let hoursRemaining: number | null = null;
            if (task.field === 'daily_check' && !isTaskAvail && dailyCheckLastCompleted) {
              const now = new Date();
              const lastCompleted = new Date(dailyCheckLastCompleted);
              const hoursSinceLastCompletion = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);
              hoursRemaining = Math.ceil(24 - hoursSinceLastCompletion);
            }
            const isOnCooldown = task.field === 'daily_check' && !isTaskAvail && hoursRemaining !== null;

            return (
              <div
                key={task.id}
                onClick={() => {
                  // Special handling for referral task - open dialog
                  if (task.id === 'referral') {
                    setReferralDialogOpen(true);
                    return;
                  }
                  
                  console.log(`Task ${task.id} clicked:`, {
                    isCompleted,
                    showVerify,
                    isTaskAvail,
                    booleanField,
                    taskBooleans: taskBooleans[booleanField],
                    isOnCooldown
                  });
                  // Don't allow click if on cooldown
                  if (isOnCooldown) {
                    return;
                  }
                  // For daily_check, allow click if not on cooldown and verify button not showing
                  // For other tasks, only allow click if task is available and verify button is not showing
                  if (task.field === 'daily_check') {
                    if (!showVerify) {
                      handleTaskClick(task);
                    } else {
                      console.log('Daily check: verify button already showing');
                    }
                  } else if (!isCompleted && !showVerify && isTaskAvail) {
                    handleTaskClick(task);
                  } else {
                    console.log('Click blocked:', {
                      reason: isCompleted ? 'completed' : showVerify ? 'verify showing' : 'not available'
                    });
                  }
                }}
                className={`w-full flex items-center justify-between p-2 rounded-md border transition-all duration-200 group ${
                  isCompleted 
                    ? 'bg-black/20 border-white/5 opacity-60 cursor-not-allowed' 
                    : isOnCooldown
                    ? 'bg-black/20 border-white/5 opacity-60 cursor-not-allowed'
                    : showVerify
                    ? 'bg-black/60 border-white/5 cursor-default'
                    : 'bg-black/60 border-white/5 hover:bg-black/40 hover:border-purple-400/20 cursor-pointer'
                }`}
              >
                {/* Left: Icon and Task Name */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${
                    isCompleted || isOnCooldown
                      ? 'bg-gradient-to-br from-purple-500/40 to-pink-500/40 text-purple-200' 
                      : 'bg-white/5 text-purple-300'
                  } transition-colors`}>
                    {task.icon}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isCompleted || isOnCooldown ? 'text-white/60' : 'text-white/80'
                    }`}>
                      {task.name}
                    </p>
                  </div>
                </div>

                {/* Right: Points, Verify Button, Cooldown Message, or Arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isOnCooldown ? (
                    <span className="text-xs text-white/60 whitespace-nowrap">
                      Available in {hoursRemaining} hour{hoursRemaining !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-green-400 whitespace-nowrap">
                        +{task.points}
                      </span>
                      
                      {task.id === 'referral' ? (
                        // Referral task always shows arrow
                        <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-purple-300 transition-colors flex-shrink-0" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      ) : showVerify ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerify(task);
                          }}
                          disabled={verifyingTaskId === task.id}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 flex items-center gap-1 ml-10 ${
                            verifyingTaskId === task.id
                              ? 'text-white/60 bg-white/40 cursor-not-allowed'
                              : 'text-black bg-white/80 hover:bg-white/90 cursor-pointer'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {verifyingTaskId === task.id ? 'Verifying...' : 'Verify'}
                        </button>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-purple-300 transition-colors flex-shrink-0" />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <ReferralDialog open={referralDialogOpen} onOpenChange={setReferralDialogOpen} />
    </>
  );
}

