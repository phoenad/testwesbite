import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const username = user.user_metadata?.user_name || user.user_metadata?.full_name || 'User';
  const displayName = user.user_metadata?.user_name ? `@${user.user_metadata.user_name}` : username;

  const handleDisconnect = async () => {
    try {
      await signOut();
      toast.success('Disconnected from X');
    } catch (error: any) {
      console.error('Error in handleDisconnect:', error);
      toast.error(`Failed to disconnect: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="flex items-center gap-0 rounded-lg border border-white/20 bg-black/30 backdrop-blur-md overflow-hidden">
      <div className="px-4 py-2 flex items-center gap-2 border-r border-white/10">
        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
        <span className="text-sm font-medium text-white whitespace-nowrap">{displayName}</span>
      </div>
      <button
        onClick={handleDisconnect}
        className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 whitespace-nowrap"
      >
        Disconnect
      </button>
    </div>
  );
}

