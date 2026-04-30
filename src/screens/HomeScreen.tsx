import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import theme from "../theme";
import SectionHeader from "../components/SectionHeader";
import ListingCard from "../components/ListingCard";
import WeatherCard from "../components/WeatherCard";
import Avatar from "../components/Avatar";
import LoadingScreen from "../components/LoadingScreen";
import ErrorState from "../components/ErrorState";
import { useAuthStore } from "../stores/useAuthStore";
import { useListings, useTrendingCrops } from "../hooks/useListings";
import { useWeather } from "../hooks/useWeather";
import { CropListing } from "../types";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role || "farmer";

  const {
    data: listings,
    isLoading: listingsLoading,
    error: listingsError,
    refetch: refetchListings,
  } = useListings();
  const { data: trending } = useTrendingCrops();
  const { data: weather, isLoading: weatherLoading } = useWeather();

  const availableListings =
    listings?.filter((l) => l.isAvailable).slice(0, 5) || [];
  const handleListingPress = (listing: CropListing) => {
    navigation.navigate("ListingDetail", { id: listing.id });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (listingsLoading && !listings) return <LoadingScreen />;
  if (listingsError && !listings)
    return <ErrorState onRetry={refetchListings} />;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar name={user?.name || "User"} size={48} />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.name || "User"}</Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Search")}
            style={styles.searchButton}
          >
            <Ionicons name="search" size={24} color={theme.colors.gray700} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {role === "farmer" ? (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.actionCard,
                  { backgroundColor: theme.colors.primary50 },
                ]}
                onPress={() => navigation.navigate("CreateListing")}
              >
                <MaterialCommunityIcons
                  name="sprout"
                  size={28}
                  color={theme.colors.primary}
                />
                <Text style={styles.actionLabel}>Sell Crops</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.actionCard,
                  { backgroundColor: theme.colors.secondary50 },
                ]}
                onPress={() => navigation.navigate("MyListings")}
              >
                <Ionicons
                  name="clipboard-outline"
                  size={28}
                  color={theme.colors.secondary}
                />
                <Text style={styles.actionLabel}>My Listings</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.actionCard,
                  { backgroundColor: theme.colors.primary50 },
                ]}
                onPress={() => navigation.navigate("Listings")}
              >
                <Ionicons
                  name="search"
                  size={28}
                  color={theme.colors.primary}
                />
                <Text style={styles.actionLabel}>Find Crops</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.actionCard,
                  { backgroundColor: theme.colors.secondary50 },
                ]}
                onPress={() => navigation.navigate("Map")}
              >
                <Ionicons
                  name="map-outline"
                  size={28}
                  color={theme.colors.secondary}
                />
                <Text style={styles.actionLabel}>Nearby Map</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.actionCard,
              { backgroundColor: theme.colors.infoLight },
            ]}
            onPress={() => navigation.navigate("Weather")}
          >
            <Ionicons
              name="partly-sunny-outline"
              size={28}
              color={theme.colors.info}
            />
            <Text style={styles.actionLabel}>Weather</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.actionCard,
              { backgroundColor: theme.colors.warningLight },
            ]}
            onPress={() => navigation.navigate("ChatInbox")}
          >
            <Ionicons
              name="chatbubbles-outline"
              size={28}
              color={theme.colors.warning}
            />
            <Text style={styles.actionLabel}>Messages</Text>
          </TouchableOpacity>
        </View>

        {/* Weather Card (compact) */}
        {weather && !weatherLoading && (
          <View style={styles.section}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Weather")}
            >
              <WeatherCard weather={weather} compact />
            </TouchableOpacity>
          </View>
        )}

        {/* Listings Feed */}
        <SectionHeader
          title="Nearby Listings"
          onViewAll={() => navigation.navigate("Listings")}
        />
        <View style={styles.listingsContainer}>
          {availableListings.length > 0 ? (
            availableListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onPress={handleListingPress}
              />
            ))
          ) : (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons
                name="sprout-outline"
                size={48}
                color={theme.colors.gray300}
              />
              <Text style={styles.emptyText}>No active listings nearby</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerText: { marginLeft: theme.spacing.md },
  greeting: { ...theme.typography.bodyMedium, color: theme.colors.gray500 },
  userName: { ...theme.typography.headingSmall, color: theme.colors.gray900 },
  searchButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  actionCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  actionLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.gray700,
    fontWeight: "700",
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  listingsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  emptyBox: { alignItems: "center", paddingVertical: theme.spacing.xxxl },
  emptyText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gray400,
    marginTop: theme.spacing.md,
  },
});

export default HomeScreen;
