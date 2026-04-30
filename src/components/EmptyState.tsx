import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = memo(
  ({ title, description, icon, actionLabel, onAction }) => {
    return (
      <View style={styles.container}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        {actionLabel && onAction && (
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="primary"
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
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.headingSmall,
    color: theme.colors.gray800,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gray500,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    maxWidth: 280,
  },
});

EmptyState.displayName = "EmptyState";
export default EmptyState;
