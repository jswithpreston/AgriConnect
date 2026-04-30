import React, { memo } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import theme from "../theme";

interface LoadingScreenProps {
  fullScreen?: boolean;
  size?: "small" | "large";
  color?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = memo(
  ({ fullScreen = true, size = "large", color }) => {
    return (
      <View style={[styles.container, fullScreen && styles.fullScreen]}>
        <ActivityIndicator size={size} color={color || theme.colors.primary} />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

LoadingScreen.displayName = "LoadingScreen";
export default LoadingScreen;
