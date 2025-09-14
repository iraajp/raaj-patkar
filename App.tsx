import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import type { Presentation, User } from './types';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { PresentationGenerator } from './components/PresentationGenerator';
import { PresentationEditor } from './components/PresentationEditor';
import { Loader } from './components/Loader';
import { generatePresentationContent } from './services/geminiService';
import { PresentationExporter } from './components/PresentationExporter';

const App: React.FC = () => {
  const { user, login, logout } = useAuth();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleGenerate = async (topic: string) => {
    setIsLoading(true);
    try {
      const generatedPresentation = await generatePresentationContent(topic);
      setPresentation(generatedPresentation);
    } catch (error) {
      console.error("Failed to generate presentation:", error);
      // You could show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPresentation = () => {
    setPresentation(null);
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
      return <LoginScreen onLogin={login} />;
    }

    if (presentation) {
      return <PresentationEditor presentation={presentation} setPresentation={setPresentation} />;
    }
    
    return <PresentationGenerator onGenerate={handleGenerate} user={user} />;
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
            onNewPresentation={handleNewPresentation} 
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