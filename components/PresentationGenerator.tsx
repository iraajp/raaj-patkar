import React, { useState } from 'react';

interface PresentationGeneratorProps {
  onGenerate: (topic: string) => void;
  user: { name: string };
}

const examplePrompts = [
    "The history of space exploration",
    "Introduction to quantum computing",
    "Sustainable urban planning",
    "The art of storytelling in marketing"
];

export const PresentationGenerator: React.FC<PresentationGeneratorProps> = ({ onGenerate, user }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic.trim());
    }
  };
  
  const handlePromptClick = (prompt: string) => {
    setTopic(prompt);
    onGenerate(prompt);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-white p-8 animate-slide-in">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-5xl font-display font-bold tracking-tighter mb-4">Welcome, {user.name.split(' ')[0]}!</h2>
        <p className="text-xl text-gray-400 mb-10">What would you like to create a presentation about?</p>
        
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'The future of artificial intelligence'"
            className="w-full bg-gray-900 border-2 border-gray-700 rounded-full py-4 pl-6 pr-32 text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          <button 
            type="submit" 
            disabled={!topic.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
          >
            Create
          </button>
        </form>

        <div className="mt-12">
            <p className="text-gray-400 mb-4">Or try one of these examples:</p>
            <div className="flex flex-wrap justify-center gap-3">
                {examplePrompts.map(prompt => (
                    <button 
                        key={prompt} 
                        onClick={() => handlePromptClick(prompt)}
                        className="bg-gray-800 text-gray-300 py-2 px-4 rounded-full text-sm hover:bg-gray-700 hover:text-white transition-colors"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};