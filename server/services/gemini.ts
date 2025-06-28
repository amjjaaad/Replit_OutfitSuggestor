import { GoogleGenAI } from "@google/genai";
import { ClassificationRequest, ClassificationResponse, OutfitGenerationRequest, OutfitGenerationResponse } from "@shared/schema";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function classifyClothingItems(request: ClassificationRequest): Promise<ClassificationResponse> {
  try {
    const systemPrompt = `You are an expert AI fashion item classifier. Your sole purpose is to analyze images of clothing and accurately categorize them. You must adhere strictly to the predefined categories and the requested JSON output format.

For each image provided in the input list, identify the single most prominent clothing item and classify it into one of the following exact categories: Top, Pants, Skirt, Dress, Outerwear, Shoes, Accessory, Other.

Also, provide a confidence score from 0.0 to 1.0 for your classification.

Respond with a single JSON object containing a key "classifiedItems". This key must hold an array of objects, where each object corresponds to an input item and includes the "itemId", your "predictedCategory", and the "confidenceScore". Do not include any other text or explanation outside of the JSON object.`;

    // Prepare the content with images
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}

Analyze these clothing items: ${JSON.stringify({
              items: request.images.map(img => ({ itemId: img.id }))
            })}`
          },
          ...request.images.map(img => ({
            inlineData: {
              data: img.imageData,
              mimeType: "image/jpeg"
            }
          }))
        ]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            classifiedItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  itemId: { type: "string" },
                  predictedCategory: { 
                    type: "string",
                    enum: ["Top", "Pants", "Skirt", "Dress", "Outerwear", "Shoes", "Accessory", "Other"]
                  },
                  confidenceScore: { type: "number", minimum: 0, maximum: 1 }
                },
                required: ["itemId", "predictedCategory", "confidenceScore"]
              }
            }
          },
          required: ["classifiedItems"]
        }
      },
      contents
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      classifiedItems: result.classifiedItems || []
    };
  } catch (error) {
    throw new Error("Failed to classify clothing items: " + (error as Error).message);
  }
}

export async function generateOutfits(request: OutfitGenerationRequest): Promise<OutfitGenerationResponse> {
  try {
    const systemPrompt = `You are a world-class AI fashion stylist. Your goal is to create stylish, complete, and coherent outfits from a given collection of clothing items. You must follow the user's preferences and use only the items provided.

Create 3 unique and complete outfits from the provided list of clothing items. A complete outfit should ideally consist of a Top, a bottom (Pants or Skirt), and Shoes. Outerwear and Accessory items are optional but can be used to enhance an outfit.

Respond with a single JSON object containing a key "recommendations". This key must hold an array of outfit objects. Each outfit object must contain:
1. "itemIds": An array of the itemId strings used in this outfit.
2. "reasoningTags": A short array of 2-3 descriptive tags (e.g., "Classic Combo", "Comfort-First", "Street Style").
3. "description": A single, concise sentence explaining why the outfit works for the user's preferences.

Do not include any other text or explanation outside of the JSON object.`;

    const userPrompt = `Create outfits from these items: ${JSON.stringify(request)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  itemIds: {
                    type: "array",
                    items: { type: "string" }
                  },
                  reasoningTags: {
                    type: "array",
                    items: { type: "string" }
                  },
                  description: { type: "string" }
                },
                required: ["itemIds", "reasoningTags", "description"]
              }
            }
          },
          required: ["recommendations"]
        }
      },
      contents: userPrompt
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      recommendations: result.recommendations || []
    };
  } catch (error) {
    throw new Error("Failed to generate outfits: " + (error as Error).message);
  }
}