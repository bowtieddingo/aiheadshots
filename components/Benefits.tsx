// components/Benefits.tsx
import React from 'react';

const Benefits: React.FC = () => {
  const benefits = [
    "Professional-looking headshots in seconds",
    "No photography skills required",
    "Perfect for LinkedIn, resumes, and professional profiles",
    "Affordable alternative to professional photo shoots"
  ];

  return (
    <section className="bg-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start bg-white p-6 rounded-lg shadow-md h-24">
              <svg className="h-8 w-8 text-indigo-500 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-lg text-gray-700 max-w-xs">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
