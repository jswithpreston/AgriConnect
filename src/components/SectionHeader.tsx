import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../theme";

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = memo(
  ({ title, onViewAll }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {onViewAll && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onViewAll}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.headingSmall,
    color: theme.colors.gray900,
  },
  viewAllButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  viewAllText: {
    ...theme.typography.labelMedium,
    color: theme.colors.primary,
  },
});

SectionHeader.displayName = "SectionHeader";
export default SectionHeader;
