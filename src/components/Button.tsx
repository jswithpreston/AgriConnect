import React, { memo } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import theme from "../theme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = memo(
  ({
    title,
    onPress,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
    fullWidth = false,
  }) => {
    const isDisabled = disabled || loading;

    const getBackgroundColor = () => {
      if (isDisabled) return theme.colors.gray300;
      switch (variant) {
        case "primary":
          return theme.colors.primary;
        case "secondary":
          return theme.colors.secondary;
        case "outline":
          return "transparent";
        case "ghost":
          return "transparent";
        case "danger":
          return theme.colors.error;
      }
    };

    const getTextColor = () => {
      if (isDisabled) return theme.colors.gray500;
      switch (variant) {
        case "primary":
          return theme.colors.white;
        case "secondary":
          return theme.colors.gray900;
        case "outline":
          return theme.colors.primary;
        case "ghost":
          return theme.colors.primary;
        case "danger":
          return theme.colors.white;
      }
    };

    const getPadding = () => {
      switch (size) {
        case "sm":
          return { paddingVertical: 8, paddingHorizontal: 16 };
        case "md":
          return { paddingVertical: 12, paddingHorizontal: 24 };
        case "lg":
          return { paddingVertical: 16, paddingHorizontal: 32 };
      }
    };

    const getFontSize = () => {
      switch (size) {
        case "sm":
          return theme.typography.labelMedium;
        case "md":
          return theme.typography.labelLarge;
        case "lg":
          return theme.typography.bodyLarge;
      }
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={isDisabled ? 1 : 0.7}
        style={[
          styles.container,
          {
            backgroundColor: getBackgroundColor(),
            ...getPadding(),
            minWidth: fullWidth ? "100%" : undefined,
          },
          variant === "outline" && styles.outlineBorder,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text
              style={[
                styles.text,
                getFontSize(),
                { color: getTextColor() },
                icon ? styles.textWithIcon : undefined,
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.md,
    minHeight: theme.touchTarget.minHeight,
  },
  text: {
    textAlign: "center",
  },
  textWithIcon: {
    marginLeft: theme.spacing.sm,
  },
  outlineBorder: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
});

Button.displayName = "Button";
export default Button;
