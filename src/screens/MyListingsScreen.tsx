import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";
import ListingCard from "../components/ListingCard";
import LoadingScreen from "../components/LoadingScreen";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { useFarmerListings } from "../hooks/useListings";
import { CropListing } from "../types";

const MyListingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [filter, setFilter] = useState<"all" | "active" | "sold">("all");
  const { data: listings, isLoading, error, refetch } = useFarmerListings();

  const filtered = (listings || []).filter((l) => {
    if (filter === "active") return l.isAvailable;
    if (filter === "sold") return !l.isAvailable;
    return true;
  });

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorState onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Listings</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("CreateListing")}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {(["all", "active", "sold"] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, filter === tab && styles.tabActive]} onPress={() => setFilter(tab)}>
            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} onPress={(l: CropListing) => navigation.navigate("ListingDetail", { id: l.id })} />}
        contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}
        ListEmptyComponent={
          <EmptyState
            icon={<MaterialCommunityIcons name="clipboard-text-off-outline" size={48} color={theme.colors.gray300} />}
            title="No listings yet"
            description="Tap + to add your first crop listing."
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md },
  title: { ...theme.typography.headingLarge, color: theme.colors.gray900 },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center" },
  tabs: { flexDirection: "row", marginHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg, backgroundColor: theme.colors.gray100, borderRadius: theme.borderRadius.md, padding: 4 },
  tab: { flex: 1, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.sm, alignItems: "center" },
  tabActive: { backgroundColor: theme.colors.white, ...theme.shadows.sm },
  tabText: { ...theme.typography.labelMedium, color: theme.colors.gray500 },
  tabTextActive: { color: theme.colors.primary, fontWeight: "700" },
});

export default MyListingsScreen;
