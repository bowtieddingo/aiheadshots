// components/Features.tsx
import React from 'react';

const Features: React.FC = () => {
  const features = [
    { title: "AI-Powered Enhancement", description: "Our advanced AI algorithms optimize lighting, background, and facial features." },
    { title: "Multiple Styles", description: "Choose from various professional styles to match your industry and personal brand." },
    { title: "Quick Turnaround", description: "Get your professional headshot in less than 5 minutes." },
    { title: "Easy-to-Use Interface", description: "Simple upload and editing process, no technical skills required." }
  ];

  return (
    <section className="bg-white py-20" id="features">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-100 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-indigo-600">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
