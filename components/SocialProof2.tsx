// components/SocialProof2.tsx
import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

interface SocialProofProps {
  testimonials: Testimonial[];
}

const SocialProof2: React.FC<SocialProofProps> = ({ testimonials }) => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg shadow">
              <p className="mb-4 italic">"{testimonial.text}"</p>
              <p className="font-bold">{testimonial.name}</p>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof2;
