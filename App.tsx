import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import type { Presentation } from './types';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { PresentationGenerator } from './components/PresentationGenerator';
import { PresentationEditor } from './components/PresentationEditor';
import { Loader } from './components/Loader';
import { generatePresentationContent } from './services/geminiService';
import { PresentationExporter } from './components/PresentationExporter';
import { Dashboard } from './components/Dashboard';

type View = 'dashboard' | 'generator' | 'editor';

const App: React.FC = () => {
  const { user, logout, login, signup, isGoogleReady, error: authError, loading: isAuthLoading } = useAuth();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    if (user) {
      setCurrentView('dashboard');
      setPresentation(null);
    }
  }, [user]);
  
  const handleGenerate = async (topic: string) => {
    setIsLoading(true);
    try {
      const generatedPresentation = await generatePresentationContent(topic);
      setPresentation(generatedPresentation);
      setCurrentView('editor');
    } catch (error) {
      console.error("Failed to generate presentation:", error);
      // You could show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    setPresentation(null);
    setCurrentView('dashboard');
  };
  
  const handleNewPresentation = () => {
      setCurrentView('generator');
  };
  
  const handleLogout = () => {
    setPresentation(null);
    logout();
  }

  const handleExport = () => {
    if (presentation) {
        setIsExporting(true);
    }
  };

  const handleExportComplete = () => {
      setIsExporting(false);
  };

  const renderContent = () => {
    if (!user) {
      return <LoginScreen 
        onLogin={login}
        onSignup={signup}
        isGoogleReady={isGoogleReady}
        authError={authError}
        isLoading={isAuthLoading}
      />;
    }

    if (currentView === 'dashboard') {
        return <Dashboard user={user} onNewPresentation={handleNewPresentation} />;
    }
    
    if (currentView === 'generator') {
        return <PresentationGenerator onGenerate={handleGenerate} user={user} />;
    }
    
    if (currentView === 'editor' && presentation) {
      return <PresentationEditor presentation={presentation} setPresentation={setPresentation} />;
    }

    // Fallback to dashboard if state is inconsistent
    setCurrentView('dashboard');
    return <Dashboard user={user} onNewPresentation={handleNewPresentation} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {isLoading && <Loader />}
      {isExporting && presentation && (
        <PresentationExporter presentation={presentation} onComplete={handleExportComplete} />
      )}
      {user && (
        <Header 
            user={user} 
            onLogout={handleLogout} 
            onGoToDashboard={handleGoToDashboard} 
            onExport={handleExport}
            isExporting={isExporting}
        />
       )}
      <main className="flex-grow flex flex-col">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;