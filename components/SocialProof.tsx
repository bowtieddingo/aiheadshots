// components/SocialProof.tsx
import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

interface SocialProofProps {
  testimonials: Testimonial[];
}

const SocialProof: React.FC<SocialProofProps> = ({ testimonials }) => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-100 p-8 rounded-lg shadow-md">
              <p className="mb-6 italic text-gray-600">&quot;{testimonial.text}&quot;</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
