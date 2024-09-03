// components/Navigation.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { StripePortalLink } from './StripePortalLink';

export function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                Your App Name
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium">
                Dashboard
              </Link>
              {/* Add more navigation items as needed */}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session && <StripePortalLink />}
            {/* Add other navigation items for authenticated users */}
          </div>
        </div>
      </div>
    </nav>
  );
}
