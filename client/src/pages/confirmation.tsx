import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppState, AppScreen } from "@/lib/types";

interface ConfirmationProps {
  appState: AppState;
  navigateToScreen: (screen: AppScreen) => void;
  updateAppState: (updates: Partial<AppState>) => void;
}

const CATEGORIES = ["Top", "Pants", "Skirt", "Dress", "Outerwear", "Shoes", "Accessory", "Other"];

export default function Confirmation({ appState, navigateToScreen, updateAppState }: ConfirmationProps) {
  const updateItemCategory = (itemId: string, newCategory: string) => {
    const updatedItems = appState.classifiedItems.map(item =>
      item.id === itemId ? { ...item, predictedCategory: newCategory } : item
    );
    updateAppState({ classifiedItems: updatedItems });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return '✓';
    if (confidence >= 0.6) return '⚠️';
    return '❌';
  };

  const getBorderColor = (confidence: number) => {
    if (confidence >= 0.8) return 'border-gray-200';
    if (confidence >= 0.6) return 'border-yellow-200';
    return 'border-red-200';
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <button
          onClick={() => navigateToScreen('selection')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <span className="text-gray-600">←</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Review & Confirm</h1>
        <div className="w-8"></div>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step 3 of 4</span>
          <span>Confirm Categories</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
        <p className="text-sm text-blue-800">
          <span className="mr-2">ℹ️</span>
          Review the AI classifications below. Tap any category to change it if needed.
        </p>
      </div>

      {/* Classification List */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <div className="space-y-4">
          {appState.classifiedItems.map((item, index) => (
            <div key={item.id} className={`bg-white rounded-xl p-4 shadow-sm border ${getBorderColor(item.confidenceScore)}`}>
              <div className="flex items-center space-x-4">
                <img
                  src={item.imageUrl}
                  alt={`Item ${index + 1}`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Item {index + 1}</span>
                    <div className={`flex items-center text-xs ${getConfidenceColor(item.confidenceScore)}`}>
                      <span className="mr-1">{getConfidenceIcon(item.confidenceScore)}</span>
                      <span>{Math.round(item.confidenceScore * 100)}% confident</span>
                    </div>
                  </div>
                  <Select
                    value={item.predictedCategory}
                    onValueChange={(value) => updateItemCategory(item.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="p-6 border-t border-gray-200">
        <Button
          onClick={() => navigateToScreen('generating')}
          className="w-full bg-primary text-white font-semibold py-4 rounded-xl text-lg flex items-center justify-center hover:bg-primary/90 transition-colors h-auto"
        >
          <span className="mr-2">✓</span>
          Confirm & Generate Outfits
        </Button>
      </div>
    </div>
  );
}
