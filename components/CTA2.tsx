// components/CTA2.tsx
import React from 'react';

interface CallToActionProps {
  text: string;
  buttonText: string;
}

const CallToAction2: React.FC<CallToActionProps> = ({ text, buttonText }) => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{text}</h2>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300">
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default CallToAction2;
