import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import theme from "../theme";
import Button from "../components/Button";
import { useAuthStore } from "../stores/useAuthStore";

interface OnboardingScreenProps {
  navigation: any;
}
const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: 1,
    icon: "sprout" as const,
    iconSet: "mci",
    title: "Sell Your Crops Directly",
    description:
      "List your harvest and connect with buyers near you. No middlemen, better prices for your hard work.",
    bg: theme.colors.primary50,
  },
  {
    id: 2,
    icon: "search" as const,
    iconSet: "ion",
    title: "Find Fresh Produce",
    description:
      "Discover crops from verified farmers in your area. Quality produce at fair prices, directly from the field.",
    bg: theme.colors.secondary50,
  },
  {
    id: 3,
    icon: "partly-sunny" as const,
    iconSet: "ion",
    title: "Weather-Smart Farming",
    description:
      "Get real-time weather alerts and forecasts. Make informed decisions to protect your crops and plan better.",
    bg: theme.colors.infoLight,
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1)
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    else handleGetStarted();
  };
  const handleSkip = () => {
    setOnboarded();
    navigation.replace("Auth");
  };
  const handleGetStarted = () => {
    setOnboarded();
    navigation.replace("Auth");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const renderIcon = (slide: (typeof SLIDES)[0]) => {
    if (slide.iconSet === "mci")
      return (
        <MaterialCommunityIcons
          name={slide.icon as any}
          size={96}
          color={theme.colors.primary}
        />
      );
    return (
      <Ionicons
        name={slide.icon as any}
        size={96}
        color={theme.colors.secondary}
      />
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.slide, { backgroundColor: item.bg }]}>
      {renderIcon(item)}
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSkip}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
        <Button
          title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  skipButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  skipText: { ...theme.typography.labelLarge, color: theme.colors.gray500 },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xxl,
  },
  slideTitle: {
    ...theme.typography.displayMedium,
    color: theme.colors.gray900,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.xxl,
  },
  slideDescription: {
    ...theme.typography.bodyLarge,
    color: theme.colors.gray600,
    textAlign: "center",
    lineHeight: 28,
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: theme.colors.primary, width: 24 },
  dotInactive: { backgroundColor: theme.colors.gray300 },
});

export default OnboardingScreen;
