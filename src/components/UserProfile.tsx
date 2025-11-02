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
      toast.error('Failed to disconnect');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
            className="px-4 py-2 bg-gray-600 text-white rounded-full gap-2 border border-white/20 hover:bg-gray-500 transition-all duration-300"
        >
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <span className="text-sm font-medium">{displayName}</span>
      </Button>
      <Button
        onClick={handleDisconnect}
        className="px-4 py-2 bg-gray-500 text-white rounded-full gap-2 border border-white/20 hover:bg-gray-400 transition-all duration-300"
      >
        {/* <X className="w-4 h-4 text-red-400" /> */}
        <span className="text-sm font-medium">Disconnect</span>
      </Button>
    </div>
  );
}

