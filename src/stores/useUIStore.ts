import { create } from "zustand";

interface UIState {
  selectedListingId: string | null;
  isBottomSheetOpen: boolean;
  language: "en" | "hi";

  setSelectedListingId: (id: string | null) => void;
  setBottomSheetOpen: (open: boolean) => void;
  setLanguage: (lang: "en" | "hi") => void;
}

export const useUIStore = create<UIState>()((set) => ({
  selectedListingId: null,
  isBottomSheetOpen: false,
  language: "en",

  setSelectedListingId: (selectedListingId) => set({ selectedListingId }),
  setBottomSheetOpen: (isBottomSheetOpen) => set({ isBottomSheetOpen }),
  setLanguage: (language) => set({ language }),
}));
