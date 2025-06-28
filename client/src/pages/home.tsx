import { Button } from "@/components/ui/button";
import { AppState, AppScreen } from "@/lib/types";

interface HomeProps {
  appState: AppState;
  navigateToScreen: (screen: AppScreen) => void;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function Home({ navigateToScreen }: HomeProps) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">✨</div>
          <h1 className="text-3xl font-bold mb-2">StyleSync</h1>
          <p className="text-lg opacity-90">AI-Powered Fashion Assistant</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Turn Your Closet Into Perfect Outfits
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Upload photos of your clothing items and let our AI create stunning outfit combinations tailored just for you.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
              <span className="text-primary text-xl">📷</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Smart Recognition</h3>
              <p className="text-sm text-gray-600">AI identifies your clothing automatically</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
              <span className="text-secondary text-xl">🎨</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Style Matching</h3>
              <p className="text-sm text-gray-600">Creates outfits based on your preferences</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
              <span className="text-accent text-xl">✨</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Instant Results</h3>
              <p className="text-sm text-gray-600">Get 3 unique outfit suggestions</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-6">
        <Button
          onClick={() => navigateToScreen('selection')}
          className="w-full bg-primary text-white font-semibold py-4 rounded-xl text-lg hover:bg-primary/90 transition-colors h-auto"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
