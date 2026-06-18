import { useQuery } from "@tanstack/react-query";
import { listingsApi } from "../api/listings";
import { useFilterStore } from "../stores/useFilterStore";
import { useAuthStore } from "../stores/useAuthStore";

export const useListings = () => {
  const filters = useFilterStore();

  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => listingsApi.getAll(filters),
    staleTime: 1000 * 60 * 2,
  });
};

export const useListingDetail = (id: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsApi.getById(id),
    enabled: !!id,
  });
};

export const useFarmerListings = (farmerId?: string) => {
  const user = useAuthStore((s) => s.user);
  const id = farmerId || user?.id || "";

  return useQuery({
    queryKey: ["farmerListings", id],
    queryFn: () => listingsApi.getByFarmer(id),
    enabled: !!id,
  });
};

export const useTrendingCrops = () => {
  return useQuery({
    queryKey: ["trendingCrops"],
    queryFn: () => listingsApi.getTrendingCrops(),
    staleTime: 1000 * 60 * 10,
  });
};
