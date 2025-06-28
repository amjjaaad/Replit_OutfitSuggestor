import { ClothingItem, InsertClothingItem, Outfit, InsertOutfit, User, InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createClothingItem(item: InsertClothingItem): Promise<ClothingItem>;
  getClothingItem(id: number): Promise<ClothingItem | undefined>;
  createOutfit(outfit: InsertOutfit): Promise<Outfit>;
  getOutfit(id: number): Promise<Outfit | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clothingItems: Map<number, ClothingItem>;
  private outfits: Map<number, Outfit>;
  private currentUserId: number;
  private currentItemId: number;
  private currentOutfitId: number;

  constructor() {
    this.users = new Map();
    this.clothingItems = new Map();
    this.outfits = new Map();
    this.currentUserId = 1;
    this.currentItemId = 1;
    this.currentOutfitId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createClothingItem(insertItem: InsertClothingItem): Promise<ClothingItem> {
    const id = this.currentItemId++;
    const item: ClothingItem = { 
      ...insertItem, 
      id,
      confidence: insertItem.confidence || null,
      originalCategory: insertItem.originalCategory || null
    };
    this.clothingItems.set(id, item);
    return item;
  }

  async getClothingItem(id: number): Promise<ClothingItem | undefined> {
    return this.clothingItems.get(id);
  }

  async createOutfit(insertOutfit: InsertOutfit): Promise<Outfit> {
    const id = this.currentOutfitId++;
    const outfit: Outfit = { 
      ...insertOutfit, 
      id,
      itemIds: [...insertOutfit.itemIds],
      reasoningTags: [...insertOutfit.reasoningTags]
    };
    this.outfits.set(id, outfit);
    return outfit;
  }

  async getOutfit(id: number): Promise<Outfit | undefined> {
    return this.outfits.get(id);
  }
}

export const storage = new MemStorage();
