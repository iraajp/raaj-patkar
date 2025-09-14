import React from 'react';
import { Icon } from './Icon';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white animate-fade-in">
      <div className="w-full max-w-md text-center p-8">
        <div className="inline-block bg-primary p-4 rounded-xl mb-6 shadow-lg shadow-primary/20">
             <Icon name="play" className="w-12 h-12 text-white transform -rotate-12" />
        </div>
        <h1 className="text-5xl font-display font-bold tracking-tighter mb-4">AI Presentation Architect</h1>
        <p className="text-lg text-gray-400 mb-8 max-w-sm mx-auto">
          Turn your ideas into stunning presentations in seconds. Let AI be your creative partner.
        </p>
        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
        >
          <Icon name="google" className="w-6 h-6"/>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};