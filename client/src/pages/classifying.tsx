import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AppState, AppScreen } from "@/lib/types";
import { ClassificationRequest, ClassificationResponse } from "@shared/schema";

interface ClassifyingProps {
  appState: AppState;
  navigateToScreen: (screen: AppScreen) => void;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function Classifying({ appState, navigateToScreen, updateAppState }: ClassifyingProps) {
  const classifyMutation = useMutation({
    mutationFn: async (request: ClassificationRequest): Promise<ClassificationResponse> => {
      const response = await apiRequest('POST', '/api/classify-items', request);
      return response.json();
    },
    onSuccess: (data) => {
      const classifiedItems = data.classifiedItems.map(item => ({
        ...item,
        imageUrl: appState.uploadedImages.find(img => img.id === item.id)?.previewUrl || ''
      }));
      
      updateAppState({ classifiedItems });
      navigateToScreen('confirmation');
    },
    onError: (error) => {
      updateAppState({
        error: error instanceof Error ? error.message : 'Failed to classify items'
      });
    }
  });

  useEffect(() => {
    if (appState.uploadedImages.length > 0) {
      const request: ClassificationRequest = {
        images: appState.uploadedImages.map(img => ({
          id: img.id,
          imageData: img.imageData
        }))
      };
      
      classifyMutation.mutate(request);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen justify-center items-center px-6">
      {/* Progress Indicator */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step 2 of 4</span>
          <span>AI Analysis</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
        </div>
      </div>

      {/* Animation */}
      <div className="text-center mb-8">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-2xl text-primary">🔍</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analyzing Your Items</h2>
        <p className="text-gray-600">Our AI is identifying each clothing item...</p>
      </div>

      {/* Status Messages */}
      <div className="w-full max-w-xs">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Processing images</span>
            <span className="text-green-500">✓</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Identifying categories</span>
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2 opacity-50">
            <span className="text-gray-600">Calculating confidence</span>
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
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
