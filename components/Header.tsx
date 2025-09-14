import React from 'react';
import type { User } from '../types';
import { Icon } from './Icon';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNewPresentation: () => void;
  onExport: () => void;
  isExporting: boolean;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNewPresentation, onExport, isExporting }) => {
  return (
    <header className="w-full bg-gray-950 p-4 border-b border-gray-800 flex justify-between items-center animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
           <Icon name="play" className="w-6 h-6 text-white transform -rotate-12" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">AI Presenter</h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onNewPresentation}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-950">
          <Icon name="new" className="w-5 h-5" />
          New
        </button>
        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-950 disabled:bg-gray-700 disabled:cursor-wait"
        >
          {isExporting ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Icon name="download" className="w-5 h-5" />
          )}
          {isExporting ? 'Exporting...' : 'Export'}
        </button>
        <div className="flex items-center gap-3">
            <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border-2 border-gray-700" />
            <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
        </div>
        <button 
          onClick={onLogout} 
          className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-950">
            <Icon name="logout" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};