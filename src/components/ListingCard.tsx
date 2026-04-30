import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { CropListing } from "../types";
import theme from "../theme";
import Badge from "./Badge";
import Avatar from "./Avatar";

interface ListingCardProps {
  listing: CropListing;
  onPress: (listing: CropListing) => void;
}

const ListingCard: React.FC<ListingCardProps> = memo(({ listing, onPress }) => {
  const formatPrice = (price: number) => `UGX ${price.toLocaleString("en-UG")}`;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(listing)}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        {listing.images.length > 0 ? (
          <Image
            source={{ uri: listing.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>🌱</Text>
          </View>
        )}
        <View style={styles.qualityBadge}>
          <Badge label={`Grade ${listing.quality}`} variant="quality" />
        </View>
        {!listing.isAvailable && (
          <View style={styles.soldOverlay}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.cropName} numberOfLines={1}>
            {listing.crop}
          </Text>
          <Text style={styles.price}>
            {formatPrice(listing.price)}
            <Text style={styles.priceUnit}>/{listing.pricePer}</Text>
          </Text>
        </View>

        {listing.variety && (
          <Text style={styles.variety} numberOfLines={1}>
            {listing.variety}
          </Text>
        )}

        <View style={styles.details}>
          <Text style={styles.detailText}>
            📦 {listing.quantity} {listing.unit}
          </Text>
          <Text style={styles.detailSeparator}>•</Text>
          <Text style={styles.detailText}>📍 {listing.location.district}</Text>
        </View>

        <View style={styles.footer}>
          <Avatar name={listing.farmer.name} size={24} />
          <Text style={styles.farmerName} numberOfLines={1}>
            {listing.farmer.name}
          </Text>
          {listing.farmer.isVerified && <Text style={styles.verified}>✓</Text>}
          <View style={{ flex: 1 }} />
          <Text style={styles.views}>{listing.views} views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.md,
    marginBottom: theme.spacing.lg,
  },
  imageContainer: {
    height: 160,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.primary50,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    fontSize: 40,
  },
  qualityBadge: {
    position: "absolute",
    top: theme.spacing.md,
    left: theme.spacing.md,
  },
  soldOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  soldText: {
    ...theme.typography.headingLarge,
    color: theme.colors.white,
    fontWeight: "800",
    letterSpacing: 3,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.xs,
  },
  cropName: {
    ...theme.typography.headingSmall,
    color: theme.colors.gray900,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  price: {
    ...theme.typography.labelLarge,
    color: theme.colors.primaryDark,
    fontWeight: "800",
  },
  priceUnit: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    fontWeight: "400",
  },
  variety: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginBottom: theme.spacing.sm,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  detailText: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray600,
  },
  detailSeparator: {
    marginHorizontal: theme.spacing.sm,
    color: theme.colors.gray300,
    fontSize: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  farmerName: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray600,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  verified: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  views: {
    ...theme.typography.labelSmall,
    color: theme.colors.gray400,
  },
});

ListingCard.displayName = "ListingCard";
export default ListingCard;
