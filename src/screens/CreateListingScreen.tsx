import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";
import Button from "../components/Button";
import Input from "../components/Input";
import { listingsApi } from "../api/listings";

interface CreateListingScreenProps {
  navigation: any;
}

const CROPS = [
  "Matooke",
  "Maize",
  "Beans",
  "Coffee",
  "Simsim",
  "Sweet Potatoes",
  "Cassava",
  "Irish Potatoes",
  "Groundnuts",
  "Cabbage",
];
const UNITS = ["bags (100kg)", "bags (50kg)", "bunches", "kg", "tonnes"];

const CreateListingScreen: React.FC<CreateListingScreenProps> = ({
  navigation,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crop, setCrop] = useState("");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("bags (100kg)");
  const [price, setPrice] = useState("");
  const [quality, setQuality] = useState<"A" | "B" | "C">("B");
  const [description, setDescription] = useState("");

  const handlePublish = async () => {
    if (!crop || !quantity || !price) {
      Alert.alert("Missing Info", "Please fill in Crop, Quantity, and Price.");
      return;
    }

    setIsSubmitting(true);
    try {
      await listingsApi.create({
        crop,
        variety,
        quantity: parseInt(quantity),
        unit,
        price: parseInt(price),
        quality,
        description,
      });
      Alert.alert("Success", "Listing published successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to publish listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          hitSlop={10}
        >
          <Ionicons name="close" size={28} color={theme.colors.gray800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Mock Image Upload */}
        <TouchableOpacity activeOpacity={0.7} style={styles.imageUploadBox}>
          <MaterialCommunityIcons
            name="camera-plus-outline"
            size={32}
            color={theme.colors.gray400}
          />
          <Text style={styles.imageUploadText}>Add Photos (Optional)</Text>
        </TouchableOpacity>

        {/* Crop Selection */}
        <Text style={styles.sectionLabel}>Select Crop *</Text>
        <View style={styles.chipGrid}>
          {CROPS.map((c) => (
            <TouchableOpacity
              key={c}
              activeOpacity={0.7}
              onPress={() => setCrop(c)}
              style={[styles.chip, crop === c && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, crop === c && styles.chipTextActive]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Variety"
          value={variety}
          onChangeText={setVariety}
          placeholder="e.g. East African Highland"
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Input
              label="Quantity *"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="e.g. 50"
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
            <Text style={styles.sectionLabel}>Unit</Text>
            {UNITS.map((u) => (
              <TouchableOpacity
                key={u}
                activeOpacity={0.7}
                onPress={() => setUnit(u)}
                style={[
                  styles.unitButton,
                  unit === u && styles.unitButtonActive,
                ]}
              >
                <Text
                  style={[styles.unitText, unit === u && styles.unitTextActive]}
                >
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          label="Price per unit (USh) *"
          value={price}
          onChangeText={setPrice}
          placeholder="e.g. 25000"
          keyboardType="numeric"
        />

        {/* Quality Selector */}
        <Text style={styles.sectionLabel}>Quality Grade *</Text>
        <View style={styles.qualityRow}>
          {(["A", "B", "C"] as const).map((q) => (
            <TouchableOpacity
              key={q}
              activeOpacity={0.7}
              onPress={() => setQuality(q)}
              style={[
                styles.qualityCard,
                quality === q && styles.qualityCardActive,
              ]}
            >
              <Text style={styles.qualityGrade}>{q}</Text>
              <Text style={styles.qualityDesc}>
                {q === "A" ? "Premium" : q === "B" ? "Standard" : "Economy"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Tell buyers about your crop..."
          multiline
          numberOfLines={4}
          containerStyle={{ height: 120 }}
        />

        <Button
          title="Publish Listing"
          onPress={handlePublish}
          loading={isSubmitting}
          fullWidth
          size="lg"
        />
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
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.headingSmall,
    color: theme.colors.gray900,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  imageUploadBox: {
    height: 160,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.borderDark,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.gray50,
  },
  imageUploadText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gray400,
    marginTop: theme.spacing.sm,
  },
  sectionLabel: {
    ...theme.typography.labelMedium,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.sm,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.borderDark,
    backgroundColor: theme.colors.white,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: { ...theme.typography.bodySmall, color: theme.colors.gray700 },
  chipTextActive: { color: theme.colors.white, fontWeight: "600" },
  row: { flexDirection: "row", marginBottom: theme.spacing.lg },
  unitButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },
  unitButtonActive: {
    backgroundColor: theme.colors.primary50,
    borderColor: theme.colors.primary,
  },
  unitText: { ...theme.typography.bodySmall, color: theme.colors.gray600 },
  unitTextActive: { color: theme.colors.primary, fontWeight: "600" },
  qualityRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  qualityCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  qualityCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary50,
  },
  qualityGrade: {
    ...theme.typography.displayMedium,
    color: theme.colors.gray900,
  },
  qualityDesc: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginTop: 4,
  },
});

export default CreateListingScreen;
