import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { ReferralDialog } from './ReferralDialog';

export function ReferralButton() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Only show if user is logged in
  if (!user) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        className="px-4 py-2 bg-gray-500 text-white rounded-full gap-2 border border-white/20 hover:bg-gray-400 transition-all duration-300"
      >
        <Gift className="w-4 h-4" />
        <span className="text-sm font-medium">Referral</span>
      </Button>
      <ReferralDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

