import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = memo(
  ({ title, message, onRetry }) => {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠</Text>
        </View>
        <Text style={styles.title}>{title || "Something went wrong"}</Text>
        <Text style={styles.message}>
          {message || "Please try again later"}
        </Text>
        {onRetry && (
          <Button
            title="Try Again"
            onPress={onRetry}
            variant="outline"
            size="md"
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.xxxxl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.errorLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    ...theme.typography.headingSmall,
    color: theme.colors.gray800,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  message: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gray500,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    maxWidth: 280,
  },
});

ErrorState.displayName = "ErrorState";
export default ErrorState;
