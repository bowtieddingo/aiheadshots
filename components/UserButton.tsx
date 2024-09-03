"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!session) return null;

  const handleBillingClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No URL returned from the server');
      }
    } catch (error) {
      console.error('Error redirecting to customer portal:', error);
      let errorMessage = 'Unable to access billing portal. Please try again later.';
      if (error.message.includes('No active subscription found')) {
        errorMessage = 'You don\'t have an active subscription. Please subscribe to a plan first.';
      } else if (error.message.includes('No customer associated with the subscription')) {
        errorMessage = 'There was an issue with your subscription. Please contact support.';
      } else if (error.message.includes('Invalid URL')) {
        errorMessage = 'There was an issue with the application configuration. Please contact support.';
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 px-2">
          {session.user?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem className="font-normal">
          {session.user?.name}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleBillingClick} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Billing'}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
