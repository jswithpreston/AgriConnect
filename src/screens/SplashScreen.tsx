import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";
import { useAuthStore } from "../stores/useAuthStore";

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { isAuthenticated, isOnboarded } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOnboarded) navigation.replace("Onboarding");
      else if (!isAuthenticated) navigation.replace("Auth");
      else navigation.replace("Main");
    }, 1500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isOnboarded, navigation]);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="sprout" size={80} color="#FFFFFF" />
      <Text style={styles.appName}>AgriConnect</Text>
      <Text style={styles.tagline}>Direct Farm to Market</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    ...theme.typography.displayLarge,
    color: theme.colors.white,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  tagline: { ...theme.typography.bodyLarge, color: "rgba(255,255,255,0.8)" },
});

export default SplashScreen;
