import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";
import ListingCard from "../components/ListingCard";
import LoadingScreen from "../components/LoadingScreen";
import { useListings } from "../hooks/useListings";
import { useFilterStore } from "../stores/useFilterStore";
import { CropListing } from "../types";
import { usersApi } from "../api/users";

interface SearchScreenProps {
  navigation: any;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filters = useFilterStore();
  const { data: listings, isLoading } = useListings();

  React.useEffect(() => {
    usersApi.getDistricts().then(setDistricts);
  }, []);

  // Filter listings based on search query and selected filters
  const filteredListings = useMemo(() => {
    if (!listings) return [];

    return listings.filter((listing) => {
      const matchesSearch =
        searchQuery === "" ||
        listing.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDistrict =
        selectedDistrict === "" ||
        listing.location.district === selectedDistrict;

      const matchesQuality =
        selectedQuality === "" || listing.quality === selectedQuality;

      return matchesSearch && matchesDistrict && matchesQuality;
    });
  }, [listings, searchQuery, selectedDistrict, selectedQuality]);

  const handleListingPress = (listing: CropListing) => {
    navigation.navigate("ListingDetail", { id: listing.id });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDistrict("");
    setSelectedQuality("");
  };

  if (isLoading && !listings) return <LoadingScreen />;

  const hasActiveFilters =
    searchQuery || selectedDistrict || selectedQuality;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.gray400}
          />
          <TextInput
            placeholder="Search crops, varieties..."
            placeholderTextColor={theme.colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.input}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.gray400}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowAdvanced(!showAdvanced)}
          style={styles.advancedButton}
        >
          <Ionicons
            name={showAdvanced ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Advanced Filters */}
      {showAdvanced && (
        <ScrollView style={styles.filtersPanel} scrollEnabled={false}>
          {/* Quality Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Quality Grade</Text>
            <View style={styles.chipGroup}>
              {["A", "B", "C"].map((quality) => (
                <TouchableOpacity
                  key={quality}
                  activeOpacity={0.7}
                  onPress={() =>
                    setSelectedQuality(
                      selectedQuality === quality ? "" : quality
                    )
                  }
                  style={[
                    styles.chip,
                    selectedQuality === quality &&
                      styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedQuality === quality &&
                        styles.chipTextActive,
                    ]}
                  >
                    Grade {quality}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* District Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>District</Text>
            <View style={styles.districtList}>
              {districts.slice(0, 5).map((district) => (
                <TouchableOpacity
                  key={district}
                  activeOpacity={0.7}
                  onPress={() =>
                    setSelectedDistrict(
                      selectedDistrict === district ? "" : district
                    )
                  }
                  style={[
                    styles.districtItem,
                    selectedDistrict === district &&
                      styles.districtItemActive,
                  ]}
                >
                  <Ionicons
                    name={
                      selectedDistrict === district
                        ? "checkbox"
                        : "checkbox-outline"
                    }
                    size={18}
                    color={
                      selectedDistrict === district
                        ? theme.colors.primary
                        : theme.colors.gray400
                    }
                  />
                  <Text
                    style={[
                      styles.districtText,
                      selectedDistrict === district &&
                        styles.districtTextActive,
                    ]}
                  >
                    {district}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {hasActiveFilters && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={clearFilters}
              style={styles.clearButton}
            >
              <Ionicons name="close" size={16} color={theme.colors.error} />
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredListings.length} result{filteredListings.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={handleListingPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        scrollEnabled={!showAdvanced}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="magnify-close"
              size={48}
              color={theme.colors.gray300}
            />
            <Text style={styles.emptyText}>No crops found</Text>
            <Text style={styles.emptySubtext}>
              Try different search terms or filters
            </Text>
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
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    ...theme.typography.bodyMedium,
    color: theme.colors.gray900,
  },
  advancedButton: {
    padding: theme.spacing.sm,
  },
  filtersPanel: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    maxHeight: 300,
  },
  filterSection: {
    marginBottom: theme.spacing.lg,
  },
  filterLabel: {
    ...theme.typography.labelMedium,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.sm,
  },
  chipGroup: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray100,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    ...theme.typography.labelSmall,
    color: theme.colors.gray700,
  },
  chipTextActive: {
    color: theme.colors.white,
  },
  districtList: {
    gap: theme.spacing.sm,
  },
  districtItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  districtItemActive: {
    backgroundColor: theme.colors.primary50,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  districtText: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray600,
  },
  districtTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  clearButtonText: {
    ...theme.typography.labelSmall,
    color: theme.colors.error,
  },
  resultsHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  resultsCount: {
    ...theme.typography.labelMedium,
    color: theme.colors.gray500,
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

export default SearchScreen;
