import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { classifyClothingItems, generateOutfits } from "./services/gemini";
import { 
  classificationRequestSchema, 
  outfitGenerationRequestSchema,
  insertClothingItemSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Upload images endpoint
  app.post("/api/upload-images", upload.array('images', 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ error: "No images provided" });
      }

      const uploadedFiles = req.files.map((file, index) => ({
        id: `temp_${Date.now()}_${index}`,
        imageData: file.buffer.toString('base64'),
        mimetype: file.mimetype,
        originalname: file.originalname
      }));

      res.json({ 
        message: "Images uploaded successfully",
        files: uploadedFiles
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload images" });
    }
  });

  // Classify clothing items endpoint
  app.post("/api/classify-items", async (req, res) => {
    try {
      const validatedData = classificationRequestSchema.parse(req.body);
      const classification = await classifyClothingItems(validatedData);
      res.json(classification);
    } catch (error) {
      console.error("Classification error:", error);
      res.status(500).json({ 
        error: "Failed to classify items",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Generate outfits endpoint
  app.post("/api/generate-outfits", async (req, res) => {
    try {
      const validatedData = outfitGenerationRequestSchema.parse(req.body);
      const outfits = await generateOutfits(validatedData);
      res.json(outfits);
    } catch (error) {
      console.error("Outfit generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate outfits",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
