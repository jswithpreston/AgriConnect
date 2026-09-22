import { CropListing, FilterState } from "../types";
import { MOCK_LISTINGS, MOCK_TRENDING_CROPS } from "../constants/mockData";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export const listingsApi = {
  getAll: async (filters?: Partial<FilterState>): Promise<CropListing[]> => {
    await delay();
    let results = [...MOCK_LISTINGS];

    if (filters?.crop) {
      results = results.filter((l) =>
        l.crop.toLowerCase().includes(filters.crop!.toLowerCase()),
      );
    }
    if (filters?.quality) {
      results = results.filter((l) => l.quality === filters.quality);
    }
    if (filters?.minPrice != null) {
      results = results.filter((l) => l.price >= filters.minPrice!);
    }
    if (filters?.maxPrice != null) {
      results = results.filter((l) => l.price <= filters.maxPrice!);
    }
    if (filters?.district) {
      results = results.filter((l) =>
        l.location.district
          .toLowerCase()
          .includes(filters.district!.toLowerCase()),
      );
    }
    if (filters?.isAvailable !== undefined) {
      results = results.filter((l) => l.isAvailable === filters.isAvailable);
    }

    if (filters?.sortBy === "price_low") {
      results.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === "price_high") {
      results.sort((a, b) => b.price - a.price);
    } else if (filters?.sortBy === "newest") {
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return results;
  },

  getById: async (id: string): Promise<CropListing | null> => {
    await delay(300);
    return MOCK_LISTINGS.find((l) => l.id === id) || null;
  },

  getByFarmer: async (farmerId: string): Promise<CropListing[]> => {
    await delay();
    return MOCK_LISTINGS.filter((l) => l.farmerId === farmerId);
  },

  create: async (data: Partial<CropListing>): Promise<CropListing> => {
    await delay(600);
    const newListing: CropListing = {
      id: `listing-${Date.now()}`,
      farmerId: data.farmerId || "demo-farmer-001",
      farmer: data.farmer || {
        id: "demo-farmer-001",
        name: "John Ssekandi",
        rating: 4.7,
        isVerified: true,
        location: { lat: 0.3476, lng: 32.5825, district: "Kampala" },
      },
      crop: data.crop || "",
      variety: data.variety || "",
      quantity: data.quantity || 0,
      unit: data.unit || "kg",
      price: data.price || 0,
      pricePer: data.pricePer || "kg",
      quality: data.quality || "A",
      harvestDate: data.harvestDate || new Date().toISOString(),
      images: data.images || [],
      description: data.description || "",
      location: data.location || {
        lat: 0.3476,
        lng: 32.5825,
        district: "Kampala",
        state: "Central Region",
      },
      isAvailable: true,
      createdAt: new Date().toISOString(),
      views: 0,
    };
    MOCK_LISTINGS.unshift(newListing);
    return newListing;
  },

  getTrendingCrops: async (): Promise<{ crop: string; count: number }[]> => {
    await delay(200);
    return MOCK_TRENDING_CROPS;
  },
};
