import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import theme from "../theme";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import LoadingScreen from "../components/LoadingScreen";
import ErrorState from "../components/ErrorState";
import { useListingDetail } from "../hooks/useListings";
import { useAuthStore } from "../stores/useAuthStore";

interface ListingDetailScreenProps {
  navigation: any;
  route: any;
}

const ListingDetailScreen: React.FC<ListingDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { id } = route.params;
  const { data: listing, isLoading, error, refetch } = useListingDetail(id);
  const user = useAuthStore((s) => s.user);

  if (isLoading) return <LoadingScreen />;
  if (error || !listing)
    return <ErrorState message="Listing not found." onRetry={refetch} />;

  const formatPrice = (price: number) => `USh ${price.toLocaleString("en-US")}`;

  const handleContact = () => {
    // In a real app, this checks if a chat exists, if not creates one, then navigates.
    // For mock, we navigate straight to a mock chat thread.
    navigation.navigate("ChatThread", {
      conversationId: "conv-001",
      recipientName: listing.farmer.name,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Image Header */}
        <View style={styles.imageContainer}>
          {listing.images.length > 0 ? (
            <Image
              source={{ uri: listing.images[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons
                name="image-off-outline"
                size={48}
                color={theme.colors.gray300}
              />
            </View>
          )}
          {!listing.isAvailable && (
            <View style={styles.soldBanner}>
              <Text style={styles.soldText}>SOLD OUT</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cropName}>{listing.crop}</Text>
              <Text style={styles.variety}>{listing.variety}</Text>
            </View>
            <Text style={styles.price}>
              {formatPrice(listing.price)}
              <Text style={styles.priceUnit}>/{listing.pricePer}</Text>
            </Text>
          </View>

          {/* Badges */}
          <View style={styles.badgeRow}>
            <Badge label={listing.quality} variant="quality" size="md" />
            <Badge
              label={listing.isAvailable ? "Available" : "Sold Out"}
              variant={listing.isAvailable ? "success" : "neutral"}
              size="md"
            />
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="cube-outline"
                size={20}
                color={theme.colors.gray500}
              />
              <Text style={styles.detailLabel}>Quantity</Text>
              <Text style={styles.detailValue}>
                {listing.quantity} {listing.unit}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.gray500}
              />
              <Text style={styles.detailLabel}>Harvest Date</Text>
              <Text style={styles.detailValue}>
                {new Date(listing.harvestDate).toLocaleDateString("en-UG")}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="location-outline"
                size={20}
                color={theme.colors.gray500}
              />
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>
                {listing.location.district}, {listing.location.state}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="eye-outline"
                size={20}
                color={theme.colors.gray500}
              />
              <Text style={styles.detailLabel}>Views</Text>
              <Text style={styles.detailValue}>{listing.views} views</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{listing.description}</Text>

          {/* Farmer Card */}
          <View style={styles.farmerCard}>
            <Avatar name={listing.farmer.name} size={52} />
            <View style={styles.farmerInfo}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.farmerName}>{listing.farmer.name}</Text>
                {listing.farmer.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={theme.colors.primary}
                    style={{ marginLeft: 6 }}
                  />
                )}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <FontAwesome
                  name="star"
                  size={14}
                  color={theme.colors.secondary}
                />
                <Text style={styles.farmerRating}>
                  {listing.farmer.rating} Rating
                </Text>
              </View>
              <Text style={styles.farmerLocation}>
                {listing.farmer.location.district}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      {listing.isAvailable && user?.id !== listing.farmerId && (
        <View style={styles.bottomBar}>
          <Button
            title="Contact Farmer"
            onPress={handleContact}
            fullWidth
            size="lg"
            icon={
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  imageContainer: { height: 280, width: "100%", position: "relative" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: theme.colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  soldBanner: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: theme.colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  soldText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  cropName: { ...theme.typography.headingLarge, color: theme.colors.gray900 },
  variety: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gray500,
    marginTop: 4,
  },
  price: {
    ...theme.typography.headingMedium,
    color: theme.colors.primaryDark,
    fontWeight: "800",
  },
  priceUnit: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    fontWeight: "400",
  },
  badgeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  detailsGrid: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  detailLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginLeft: theme.spacing.md,
    width: 80,
  },
  detailValue: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gray800,
    flex: 1,
    fontWeight: "600",
  },
  sectionTitle: {
    ...theme.typography.headingSmall,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.bodyLarge,
    color: theme.colors.gray600,
    lineHeight: 26,
    marginBottom: theme.spacing.xl,
  },
  farmerCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    ...theme.shadows.md,
  },
  farmerInfo: { flex: 1, marginLeft: theme.spacing.md },
  farmerName: { ...theme.typography.labelLarge, color: theme.colors.gray900 },
  farmerRating: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginLeft: 6,
  },
  farmerLocation: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray400,
    marginTop: 4,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});

export default ListingDetailScreen;
