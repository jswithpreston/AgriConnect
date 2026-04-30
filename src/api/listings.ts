import { CropListing, FilterState } from "../types";
import { apiClient } from "./client";

export const listingsApi = {
  getAll: async (filters?: Partial<FilterState>): Promise<CropListing[]> => {
    const { data } = await apiClient.get('/listings', { params: filters });
    return data;
  },

  getById: async (id: string): Promise<CropListing | null> => {
    try {
      const { data } = await apiClient.get(`/listings/${id}`);
      return data;
    } catch {
      return null;
    }
  },

  getByFarmer: async (farmerId: string): Promise<CropListing[]> => {
    const { data } = await apiClient.get(`/listings/farmer/${farmerId}`);
    return data;
  },

  create: async (data: Partial<CropListing>): Promise<CropListing> => {
    const { data: response } = await apiClient.post('/listings', data);
    return response;
  },

  getTrendingCrops: async (): Promise<{ crop: string; count: number }[]> => {
    const { data } = await apiClient.get('/listings/trending');
    return data;
  },
};
