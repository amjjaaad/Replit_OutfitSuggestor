import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const clothingItems = pgTable("clothing_items", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  confidence: integer("confidence"),
  originalCategory: text("original_category"),
});

export const outfits = pgTable("outfits", {
  id: serial("id").primaryKey(),
  itemIds: text("item_ids").array().notNull(),
  reasoningTags: text("reasoning_tags").array().notNull(),
  description: text("description").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClothingItemSchema = createInsertSchema(clothingItems).omit({
  id: true,
});

export const insertOutfitSchema = createInsertSchema(outfits).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ClothingItem = typeof clothingItems.$inferSelect;
export type InsertClothingItem = z.infer<typeof insertClothingItemSchema>;
export type Outfit = typeof outfits.$inferSelect;
export type InsertOutfit = z.infer<typeof insertOutfitSchema>;

// API schemas
export const classificationRequestSchema = z.object({
  images: z.array(z.object({
    id: z.string(),
    imageData: z.string(), // base64 encoded image
  })),
});

export const classificationResponseSchema = z.object({
  classifiedItems: z.array(z.object({
    id: z.string(),
    predictedCategory: z.enum(["Top", "Pants", "Skirt", "Dress", "Outerwear", "Shoes", "Accessory", "Other"]),
    confidenceScore: z.number().min(0).max(1),
  })),
});

export const outfitGenerationRequestSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    category: z.enum(["Top", "Pants", "Skirt", "Dress", "Outerwear", "Shoes", "Accessory", "Other"]),
    imageUrl: z.string(),
  })),
  userPreferences: z.object({
    style: z.string().optional(),
    occasion: z.string().optional(),
  }).optional(),
});

export const outfitGenerationResponseSchema = z.object({
  recommendations: z.array(z.object({
    itemIds: z.array(z.string()),
    reasoningTags: z.array(z.string()),
    description: z.string(),
  })),
});

export type ClassificationRequest = z.infer<typeof classificationRequestSchema>;
export type ClassificationResponse = z.infer<typeof classificationResponseSchema>;
export type OutfitGenerationRequest = z.infer<typeof outfitGenerationRequestSchema>;
export type OutfitGenerationResponse = z.infer<typeof outfitGenerationResponseSchema>;
