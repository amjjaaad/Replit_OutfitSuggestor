import { Button } from "@/components/ui/button";
import { useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AppState, AppScreen, UploadedImage } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface SelectionProps {
  appState: AppState;
  navigateToScreen: (screen: AppScreen) => void;
  updateAppState: (updates: Partial<AppState>) => void;
}

export default function Selection({ appState, navigateToScreen, updateAppState }: SelectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      const response = await apiRequest('POST', '/api/upload-images', formData);
      return response.json();
    },
    onSuccess: (data) => {
      const newImages: UploadedImage[] = data.files.map((file: any) => ({
        ...file,
        previewUrl: `data:${file.mimetype};base64,${file.imageData}`
      }));
      
      updateAppState({
        uploadedImages: [...appState.uploadedImages, ...newImages]
      });
      
      toast({
        title: "Success",
        description: `${newImages.length} image(s) uploaded successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    }
  });

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      uploadMutation.mutate(files);
    }
  }, [uploadMutation]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeImage = (imageId: string) => {
    updateAppState({
      uploadedImages: appState.uploadedImages.filter(img => img.id !== imageId)
    });
  };

  const handleContinue = () => {
    if (appState.uploadedImages.length > 0) {
      navigateToScreen('classifying');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <button
          onClick={() => navigateToScreen('home')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <span className="text-gray-600">←</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Add Your Items</h1>
        <div className="w-8"></div>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step 1 of 4</span>
          <span>Upload Photos</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {/* Upload Area */}
        <div className="mb-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 cursor-pointer hover:border-primary transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-4xl text-gray-400 mb-4">☁️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Your Clothing</h3>
            <p className="text-gray-500 mb-4">Take photos or select from your gallery</p>
            <div className="space-y-3">
              <Button className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors">
                📷 Take Photo
              </Button>
              <Button
                variant="outline"
                className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🖼️ Choose from Gallery
              </Button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* Uploaded Items */}
        {appState.uploadedImages.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Items ({appState.uploadedImages.length})
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {appState.uploadedImages.map((image) => (
                <div key={image.id} className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                  <img
                    src={image.previewUrl}
                    alt={image.originalname}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate">{image.originalname}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <span className="text-blue-500 mt-1 mr-3">ℹ️</span>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Tips for Best Results</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use good lighting and clear backgrounds</li>
                <li>• Include one item per photo</li>
                <li>• Upload at least 3 items for better combinations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-6 border-t border-gray-200">
        <Button
          onClick={handleContinue}
          disabled={appState.uploadedImages.length === 0 || uploadMutation.isPending}
          className={`w-full font-semibold py-4 rounded-xl text-lg ${
            appState.uploadedImages.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary/90'
          } h-auto`}
        >
          {uploadMutation.isPending
            ? 'Uploading...'
            : `Continue with ${appState.uploadedImages.length} Items`}
        </Button>
      </div>
    </div>
  );
}
