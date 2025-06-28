import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Home from "@/pages/home";
import Selection from "@/pages/selection";
import Classifying from "@/pages/classifying";
import Confirmation from "@/pages/confirmation";
import Generating from "@/pages/generating";
import Results from "@/pages/results";
import { AppState, AppScreen } from "@/lib/types";

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'home',
    uploadedImages: [],
    classifiedItems: [],
    outfitRecommendations: [],
    isLoading: false,
    error: null,
  });

  const navigateToScreen = (screen: AppScreen) => {
    setAppState(prev => ({ ...prev, currentScreen: screen, error: null }));
  };

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentScreen = () => {
    const commonProps = { appState, navigateToScreen, updateAppState };

    switch (appState.currentScreen) {
      case 'home':
        return <Home {...commonProps} />;
      case 'selection':
        return <Selection {...commonProps} />;
      case 'classifying':
        return <Classifying {...commonProps} />;
      case 'confirmation':
        return <Confirmation {...commonProps} />;
      case 'generating':
        return <Generating {...commonProps} />;
      case 'results':
        return <Results {...commonProps} />;
      default:
        return <Home {...commonProps} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
          {renderCurrentScreen()}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
