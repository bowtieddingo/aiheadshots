// components/TopNav.tsx
import React from 'react';

const TopNav: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-800">YourLogo</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-800 hover:text-indigo-600 transition duration-300">Home</a>
          <a href="#" className="text-gray-800 hover:text-indigo-600 transition duration-300">Features</a>
          <a href="#" className="text-gray-800 hover:text-indigo-600 transition duration-300">Pricing</a>
          <a href="#" className="text-gray-800 hover:text-indigo-600 transition duration-300">Contact</a>
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
