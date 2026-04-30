import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";
import ListingCard from "../components/ListingCard";
import FilterChips from "../components/FilterChips";
import LoadingScreen from "../components/LoadingScreen";
import ErrorState from "../components/ErrorState";
import { useListings } from "../hooks/useListings";
import { useFilterStore } from "../stores/useFilterStore";
import { CropListing } from "../types";

interface ListingsScreenProps {
  navigation: any;
}

const ListingsScreen: React.FC<ListingsScreenProps> = ({ navigation }) => {
  const [showFilters, setShowFilters] = useState(false);
  const filters = useFilterStore();
  const {
    data: listings,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useListings();

  const handleListingPress = (listing: CropListing) => {
    navigation.navigate("ListingDetail", { id: listing.id });
  };

  if (isLoading && !listings) return <LoadingScreen />;
  if (error && !listings) return <ErrorState onRetry={() => refetch()} />;

  const hasFilters = filters.hasActiveFilters();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Available Crops</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowFilters(!showFilters)}
          style={[styles.filterButton, hasFilters && styles.filterButtonActive]}
        >
          <Ionicons
            name="funnel"
            size={20}
            color={hasFilters ? theme.colors.white : theme.colors.gray700}
          />
          {hasFilters && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>●</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && <FilterChips onClose={() => setShowFilters(false)} />}

      {/* Listings */}
      <FlatList
        data={listings || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={handleListingPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="leaf-outline"
              size={48}
              color={theme.colors.gray300}
            />
            <Text style={styles.emptyText}>No listings found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.headingMedium,
    color: theme.colors.gray900,
  },
  filterButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.warning,
  },
  filterBadgeText: {
    color: theme.colors.warning,
    fontSize: 8,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xxxl,
  },
  emptyText: {
    ...theme.typography.headingSmall,
    color: theme.colors.gray500,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray400,
    marginTop: theme.spacing.sm,
  },
});

export default ListingsScreen;
