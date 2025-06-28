export interface UploadedImage {
  id: string;
  imageData: string;
  mimetype: string;
  originalname: string;
  previewUrl?: string;
}

export interface ClassifiedItem {
  id: string;
  predictedCategory: string;
  confidenceScore: number;
  imageUrl?: string;
}

export interface OutfitRecommendation {
  itemIds: string[];
  reasoningTags: string[];
  description: string;
}

export type AppScreen = 'home' | 'selection' | 'classifying' | 'confirmation' | 'generating' | 'results';

export interface AppState {
  currentScreen: AppScreen;
  uploadedImages: UploadedImage[];
  classifiedItems: ClassifiedItem[];
  outfitRecommendations: OutfitRecommendation[];
  isLoading: boolean;
  error: string | null;
}
