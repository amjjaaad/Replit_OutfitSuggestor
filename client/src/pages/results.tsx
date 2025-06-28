import { Button } from "@/components/ui/button";
import { AppState, AppScreen } from "@/lib/types";

interface ResultsProps {
  appState: AppState;
  navigateToScreen: (screen: AppScreen) => void;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function Results({ appState, navigateToScreen }: ResultsProps) {
  const getOutfitItems = (itemIds: string[]) => {
    return itemIds.map(id => 
      appState.classifiedItems.find(item => item.id === id)
    ).filter(Boolean);
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      'from-gray-50 to-gray-100',
      'from-blue-50 to-indigo-50',
      'from-purple-50 to-pink-50'
    ];
    return gradients[index] || gradients[0];
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <button
          onClick={() => navigateToScreen('confirmation')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <span className="text-gray-600">←</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Your Outfits</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <span className="text-gray-600">📤</span>
        </button>
      </div>

      {/* Success Message */}
      <div className="px-6 py-4 bg-green-50 border-b border-green-100">
        <div className="flex items-center">
          <span className="text-green-500 mr-3">✓</span>
          <div>
            <h3 className="font-semibold text-green-800">
              {appState.outfitRecommendations.length} Outfits Created!
            </h3>
            <p className="text-sm text-green-700">Swipe through your personalized looks</p>
          </div>
        </div>
      </div>

      {/* Outfit Cards */}
      <div className="flex-1 overflow-y-auto">
        {appState.outfitRecommendations.map((outfit, outfitIndex) => {
          const outfitItems = getOutfitItems(outfit.itemIds);
          
          return (
            <div key={outfitIndex} className="p-6 border-b border-gray-100">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Outfit Preview */}
                <div className={`bg-gradient-to-br ${getGradientClass(outfitIndex)} p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Outfit {outfitIndex + 1}
                    </h3>
                    <div className="flex space-x-1">
                      {outfit.reasoningTags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Items Grid */}
                  <div className={`grid gap-3 mb-4 ${
                    outfitItems.length <= 2 ? 'grid-cols-2' : 
                    outfitItems.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
                  }`}>
                    {outfitItems.map((item, itemIndex) => (
                      <div key={itemIndex} className="aspect-square bg-white rounded-lg p-2 shadow-sm">
                        <img
                          src={item?.imageUrl}
                          alt={`Item ${itemIndex + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {outfit.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="p-4 bg-white">
                  <div className="flex space-x-3">
                    <Button className="flex-1 bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                      <span className="mr-2">❤️</span>
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="mr-2">📤</span>
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => navigateToScreen('selection')}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <span className="mr-2">➕</span>
            Add More Items
          </Button>
          <Button
            onClick={() => navigateToScreen('home')}
            className="flex-1 bg-secondary text-white font-medium py-3 px-4 rounded-xl hover:bg-secondary/90 transition-colors"
          >
            <span className="mr-2">🏠</span>
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}
