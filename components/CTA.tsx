// components/CallToAction.tsx
import React from 'react';

interface CallToActionProps {
  text: string;
  buttonText: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ text, buttonText }) => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">{text}</h2>
        <button className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition duration-300 shadow-lg">
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
