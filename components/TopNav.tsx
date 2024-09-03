// components/TopNav.tsx
'use client';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const TopNav: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">AI Headshots</Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-800 hover:text-indigo-600 transition duration-300">Home</Link>
          <Link href="#features" className="text-gray-800 hover:text-indigo-600 transition duration-300">Features</Link>
          <Link href="#pricing" className="text-gray-800 hover:text-indigo-600 transition duration-300">Pricing</Link>
          <Link href="#contact" className="text-gray-800 hover:text-indigo-600 transition duration-300">Contact</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-800 hover:text-indigo-600 transition duration-300">Dashboard</Link>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Sign In
            </button>
          )}
        </div>
        <div className="md:hidden">
          <button className="text-gray-800 hover:text-indigo-600 focus:outline-none">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
