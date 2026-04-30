import { create } from "zustand";
import { FilterState } from "../types";

interface FilterStoreState extends FilterState {
  setCrop: (crop: string) => void;
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  setDistance: (distance: number) => void;
  setQuality: (quality: string) => void;
  setSortBy: (sortBy: FilterState["sortBy"]) => void;
  setDistrict: (district: string) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

const defaultFilters: FilterState = {
  crop: "",
  minPrice: null,
  maxPrice: null,
  distance: 50,
  quality: "",
  sortBy: "nearest",
  district: "",
};

export const useFilterStore = create<FilterStoreState>()((set, get) => ({
  ...defaultFilters,

  setCrop: (crop) => set({ crop }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setDistance: (distance) => set({ distance }),
  setQuality: (quality) => set({ quality }),
  setSortBy: (sortBy) => set({ sortBy }),
  setDistrict: (district) => set({ district }),

  resetFilters: () => set(defaultFilters),

  hasActiveFilters: () => {
    const state = get();
    return !!(
      state.crop ||
      state.minPrice ||
      state.maxPrice ||
      state.quality ||
      state.district ||
      state.sortBy !== "nearest"
    );
  },
}));
