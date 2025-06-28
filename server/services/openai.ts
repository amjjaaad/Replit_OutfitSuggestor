import OpenAI from "openai";
import { ClassificationRequest, ClassificationResponse, OutfitGenerationRequest, OutfitGenerationResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function classifyClothingItems(request: ClassificationRequest): Promise<ClassificationResponse> {
  try {
    const messages: any[] = [
      {
        role: "system",
        content: `You are an expert AI fashion item classifier. Your sole purpose is to analyze images of clothing and accurately categorize them. You must adhere strictly to the predefined categories and the requested JSON output format.

For each image provided in the input list, identify the single most prominent clothing item and classify it into one of the following exact categories: Top, Pants, Skirt, Dress, Outerwear, Shoes, Accessory, Other.

Also, provide a confidence score from 0.0 to 1.0 for your classification.

Respond with a single JSON object containing a key "classifiedItems". This key must hold an array of objects, where each object corresponds to an input item and includes the "itemId", your "predictedCategory", and the "confidenceScore". Do not include any other text or explanation outside of the JSON object.`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze these clothing items: ${JSON.stringify({
              items: request.images.map(img => ({ itemId: img.id }))
            })}`
          },
          ...request.images.map(img => ({
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${img.imageData}`
            }
          }))
        ]
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      recommendations: result.recommendations || []
    };
  } catch (error) {
    throw new Error("Failed to generate outfits: " + (error as Error).message);
  }
}
