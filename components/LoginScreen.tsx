import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { GOOGLE_CLIENT_ID } from '../config';

declare global {
  interface Window {
    google: any;
  }
}

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (name: string, email: string, password: string) => Promise<boolean>;
  isGoogleReady: boolean;
  authError: string | null;
  isLoading: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignup, isGoogleReady, authError, isLoading }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (GOOGLE_CLIENT_ID.startsWith("YOUR_GOOGLE_CLIENT_ID")) {
      return;
    }
    if (isGoogleReady && googleButtonRef.current) {
        if (googleButtonRef.current.childElementCount === 0) {
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: "outline", size: "large", type: 'standard', text: 'signin_with' }
            );
        }
    }
  }, [isGoogleReady]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (mode === 'login') {
        onLogin(email, password);
    } else {
        onSignup(name, email, password);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    // Clear fields on mode change
    setName('');
    setEmail('');
    setPassword('');
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white animate-fade-in p-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-block bg-primary p-4 rounded-xl mb-6 shadow-lg shadow-primary/20">
             <Icon name="play" className="w-12 h-12 text-white transform -rotate-12" />
        </div>
        <h1 className="text-5xl font-display font-bold tracking-tighter mb-2">AI Presentation Architect</h1>
        <p className="text-lg text-gray-400 mb-8">
            {mode === 'login' ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {mode === 'signup' && (
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon name="user" className="w-5 h-5"/>
                    </span>
                    <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)}
                        className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"/>
                 </div>
            )}
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="email" className="w-5 h-5"/>
                </span>
                <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"/>
            </div>
            <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon name="lock" className="w-5 h-5"/>
                </span>
                <input type="password" placeholder="Password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"/>
            </div>
            
            {authError && <p className="text-red-400 text-sm text-center animate-fade-in">{authError}</p>}

            <button type="submit" disabled={isLoading}
                className="w-full bg-primary text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:bg-primary-hover disabled:bg-gray-600 disabled:cursor-wait flex items-center justify-center">
                 {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                 ) : (
                    mode === 'login' ? 'Login' : 'Create Account'
                 )}
            </button>
        </form>

        <div className="mt-4 text-center">
            <button onClick={toggleMode} className="text-sm text-gray-400 hover:text-primary transition-colors">
                {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
        </div>

        <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div className="flex justify-center min-h-[40px]">
            {GOOGLE_CLIENT_ID.startsWith("YOUR_GOOGLE_CLIENT_ID") ? (
                <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-2 rounded-lg text-sm text-left">
                    <p className="font-bold">Google Sign-In Disabled</p>
                    <p>Update <code>config.ts</code> with a valid Client ID to enable.</p>
                </div>
            ) : isGoogleReady ? (
                <div ref={googleButtonRef}></div>
            ) : (
                <p className="text-gray-400">Loading Google Sign-In...</p>
            )}
        </div>
      </div>
    </div>
  );
};