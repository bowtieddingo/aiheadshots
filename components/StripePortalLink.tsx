// components/StripePortalLink.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export function StripePortalLink() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!session) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error redirecting to customer portal:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null; // Don't render the link if the user is not logged in

  return (
    <a
      href="#"
      onClick={handleClick}
      className="text-sm font-medium text-gray-700 hover:text-gray-800"
    >
      {isLoading ? 'Loading...' : 'Billing'}
    </a>
  );
}
