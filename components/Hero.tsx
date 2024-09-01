// components/Hero.tsx
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          Transform Your Professional Image with AI
        </h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Generate stunning, business-ready headshots in seconds. Perfect for LinkedIn, resumes, and more!
        </p>
        <button className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-100 transition duration-300 shadow-lg">
          Generate Your Headshot
        </button>
      </div>
    </section>
  );
};

export default Hero;
