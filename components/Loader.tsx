
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Igniting creative neurons...",
  "Analyzing your prompt...",
  "Crafting the title slide...",
  "Structuring key points...",
  "Generating stunning visuals...",
  "Designing content layouts...",
  "Assembling the presentation...",
  "Polishing the final details...",
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
      <svg className="w-16 h-16 animate-spin text-primary mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-xl font-medium text-gray-300 transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};
