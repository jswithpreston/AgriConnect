import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import theme from "../theme";
import LoadingScreen from "../components/LoadingScreen";
import { useListings } from "../hooks/useListings";
import { CropListing } from "../types";

interface MapScreenProps {
  navigation: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const { data: listings, isLoading } = useListings();
  const mapRef = useRef<MapView>(null);
  const [selectedListing, setSelectedListing] = useState<CropListing | null>(
    null,
  );

  const defaultRegion = {
    latitude: 0.3476,
    longitude: 32.5825,
    latitudeDelta: 3,
    longitudeDelta: 3,
  };

  const [isMapReady, setIsMapReady] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          setLocationPermission(true);
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        }
      } catch (e) {
        console.warn("Could not fetch current location", e);
      }
    })();
  }, []);

  useEffect(() => {
    if (isMapReady && userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }
  }, [isMapReady, userLocation]);

  useEffect(() => {
    if (isMapReady && listings && listings.length > 0 && mapRef.current && !userLocation) {
      const coordinates = listings.map((l) => ({
        latitude: l.location.lat,
        longitude: l.location.lng,
      }));

      // Small timeout to ensure layout is complete
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      }, 100);
    }
  }, [listings, isMapReady]);

  if (isLoading && !listings) return <LoadingScreen />;

  const formatPrice = (price: number) => `UGX ${price.toLocaleString("en-UG")}`;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        initialRegion={defaultRegion}
        style={styles.map}
        onMapReady={() => setIsMapReady(true)}
        showsUserLocation={locationPermission}
        showsMyLocationButton={locationPermission}
      >
        {listings?.map((listing) => (
          <Marker
            key={listing.id}
            coordinate={{
              latitude: listing.location.lat,
              longitude: listing.location.lng,
            }}
            title={listing.crop}
            description={listing.location.district}
            pinColor={theme.colors.primary}
            onPress={() => setSelectedListing(listing)}
          >
            <Callout tooltip style={styles.callout}>
              <View style={styles.calloutContent}>
                <Text style={styles.calloutCrop}>{listing.crop}</Text>
                <Text style={styles.calloutDetails}>
                  {listing.quantity} {listing.unit}
                </Text>
                <Text style={styles.calloutPrice}>
                  {formatPrice(listing.price)}/{listing.pricePer}
                </Text>
                <Text style={styles.calloutFarmer}>{listing.farmer.name}</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.calloutButton}
                  onPress={() =>
                    navigation.navigate("ListingDetail", { id: listing.id })
                  }
                >
                  <Text style={styles.calloutButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.button}
          onPress={() => {
            if (listings && listings.length > 0 && mapRef.current) {
              const coordinates = listings.map((l) => ({
                latitude: l.location.lat,
                longitude: l.location.lng,
              }));
              mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                animated: true,
              });
            }
          }}
        >
          <Ionicons name="expand" size={20} color={theme.colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.button}
          onPress={() => {
            mapRef.current?.animateToRegion(defaultRegion, 500);
          }}
        >
          <Ionicons name="location" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Info Panel */}
      {selectedListing && (
        <View style={styles.infoPanel}>
          <View style={styles.infoPanelHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoPanelCrop}>{selectedListing.crop}</Text>
              <Text style={styles.infoPanelVariety}>
                {selectedListing.variety}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedListing(null)}>
              <Ionicons name="close" size={24} color={theme.colors.gray500} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoPanelDetails}>
            <View style={styles.detailRow}>
              <Ionicons
                name="cube-outline"
                size={16}
                color={theme.colors.gray500}
              />
              <Text style={styles.detailText}>
                {selectedListing.quantity} {selectedListing.unit}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                name="pricetag-outline"
                size={16}
                color={theme.colors.gray500}
              />
              <Text style={styles.detailText}>
                {formatPrice(selectedListing.price)}/{selectedListing.pricePer}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={theme.colors.gray500}
              />
              <Text style={styles.detailText}>
                {selectedListing.location.district}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate("ListingDetail", { id: selectedListing.id })
            }
          >
            <Text style={styles.detailsButtonText}>View Full Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  callout: {
    width: 240,
  },
  calloutContent: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  calloutCrop: {
    ...theme.typography.headingSmall,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.xs,
  },
  calloutDetails: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginBottom: theme.spacing.xs,
  },
  calloutPrice: {
    ...theme.typography.labelMedium,
    color: theme.colors.primary,
    fontWeight: "700",
    marginBottom: theme.spacing.xs,
  },
  calloutFarmer: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.sm,
  },
  calloutButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  calloutButtonText: {
    ...theme.typography.labelSmall,
    color: theme.colors.white,
  },
  controls: {
    position: "absolute",
    right: theme.spacing.lg,
    bottom: theme.spacing.xl + 120,
    gap: theme.spacing.md,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
  infoPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  infoPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  infoPanelCrop: {
    ...theme.typography.headingMedium,
    color: theme.colors.gray900,
  },
  infoPanelVariety: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginTop: theme.spacing.xs,
  },
  infoPanelDetails: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  detailText: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray600,
  },
  detailsButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
  },
  detailsButtonText: {
    ...theme.typography.labelMedium,
    color: theme.colors.white,
  },
});

export default MapScreen;
