import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";
import ListingCard from "../components/ListingCard";
import LoadingScreen from "../components/LoadingScreen";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { useFarmerListings } from "../hooks/useListings";
import { CropListing } from "../types";

interface MyListingsScreenProps {
  navigation: any;
}

const MyListingsScreen: React.FC<MyListingsScreenProps> = ({ navigation }) => {
  const [filter, setFilter] = useState<"all" | "active" | "sold">("all");
  const {
    data: listings,
    isLoading,
    error,
    refetch,
  } = useFarmerListings("current_user");

  const filteredListings =
    listings?.filter((l) => {
      if (filter === "active") return l.isAvailable;
      if (filter === "sold") return !l.isAvailable;
      return true;
    }) || [];

  const handlePress = (listing: CropListing) => {
    navigation.navigate("ListingDetail", { id: listing.id });
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorState onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Listings</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("CreateListing")}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabs}>
        {(["all", "active", "sold"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.7}
            onPress={() => setFilter(tab)}
            style={[styles.tab, filter === tab && styles.tabActive]}
          >
            <Text
              style={[styles.tabText, filter === tab && styles.tabTextActive]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={handlePress} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon={
              <MaterialCommunityIcons
                name="clipboard-text-off-outline"
                size={48}
                color={theme.colors.gray300}
              />
            }
            title="No listings yet"
            description="Tap the + button to add your first crop listing."
            actionLabel="Add Listing"
            onAction={() => navigation.navigate("CreateListing")}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: { ...theme.typography.headingLarge, color: theme.colors.gray900 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.gray100,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
  },
  tabActive: { backgroundColor: theme.colors.white, ...theme.shadows.sm },
  tabText: { ...theme.typography.labelMedium, color: theme.colors.gray500 },
  tabTextActive: { color: theme.colors.primary, fontWeight: "700" },
  listContent: { paddingBottom: theme.spacing.xxl },
});

export default MyListingsScreen;
