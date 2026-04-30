import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";

type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "quality";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const Badge: React.FC<BadgeProps> = memo(
  ({ label, variant = "neutral", size = "sm" }) => {
    const getStyle = () => {
      switch (variant) {
        case "success":
          return { bg: theme.colors.successLight, text: theme.colors.success };
        case "warning":
          return { bg: theme.colors.warningLight, text: theme.colors.warning };
        case "error":
          return { bg: theme.colors.errorLight, text: theme.colors.error };
        case "info":
          return { bg: theme.colors.infoLight, text: theme.colors.info };
        case "quality":
          if (label === "A")
            return {
              bg: theme.colors.successLight,
              text: theme.colors.qualityA,
            };
          if (label === "B")
            return {
              bg: theme.colors.warningLight,
              text: theme.colors.qualityB,
            };
          return { bg: theme.colors.errorLight, text: theme.colors.qualityC };
        case "neutral":
        default:
          return { bg: theme.colors.gray100, text: theme.colors.gray600 };
      }
    };

    const colors = getStyle();

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.bg },
          size === "sm" ? styles.sm : styles.md,
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: colors.text },
            size === "sm" ? styles.textSm : styles.textMd,
          ]}
        >
          {label}
        </Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
  },
  sm: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  text: {
    fontWeight: "600",
  },
  textSm: {
    ...theme.typography.labelSmall,
  },
  textMd: {
    ...theme.typography.labelMedium,
  },
});

Badge.displayName = "Badge";
export default Badge;
