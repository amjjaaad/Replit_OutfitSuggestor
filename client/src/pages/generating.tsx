import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AppState, AppScreen } from "@/lib/types";
import { OutfitGenerationRequest, OutfitGenerationResponse } from "@shared/schema";

interface GeneratingProps {
  appState: AppState;
  navigateToScreen: (screen: AppScreen) => void;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function Generating({ appState, navigateToScreen, updateAppState }: GeneratingProps) {
  const generateMutation = useMutation({
    mutationFn: async (request: OutfitGenerationRequest): Promise<OutfitGenerationResponse> => {
      const response = await apiRequest('POST', '/api/generate-outfits', request);
      return response.json();
    },
    onSuccess: (data) => {
      updateAppState({ outfitRecommendations: data.recommendations });
      navigateToScreen('results');
    },
    onError: (error) => {
      updateAppState({
        error: error instanceof Error ? error.message : 'Failed to generate outfits'
      });
    }
  });

  useEffect(() => {
    if (appState.classifiedItems.length > 0) {
      const request: OutfitGenerationRequest = {
        items: appState.classifiedItems.map(item => ({
          id: item.id,
          category: item.predictedCategory as any,
          imageUrl: item.imageUrl || ''
        })),
        userPreferences: {
          style: "Casual",
          occasion: "Everyday"
        }
      };
      
      generateMutation.mutate(request);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen justify-center items-center px-6">
      {/* Progress Indicator */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step 4 of 4</span>
          <span>Creating Outfits</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '90%' }}></div>
        </div>
      </div>

      {/* Animation */}
      <div className="text-center mb-8">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-secondary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-3xl text-secondary">✨</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Creating Your Outfits</h2>
        <p className="text-gray-600 mb-4">Our AI stylist is combining your items into perfect looks...</p>
        
        {/* Dynamic Status */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 text-left">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Analyzing color combinations</span>
              <span className="text-green-500">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Matching styles and occasions</span>
              <span className="text-green-500">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Generating 3 unique outfits</span>
              <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 w-full max-w-sm">
        <div className="flex items-start">
          <span className="text-accent mr-3 mt-1">💡</span>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Style Tip</h4>
            <p className="text-sm text-gray-600">
              Mixing textures adds visual interest to any outfit. Try pairing smooth fabrics with textured ones!
            </p>
          </div>
        </div>
      </div>

      {appState.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {appState.error}
        </div>
      )}
    </div>
  );
}
