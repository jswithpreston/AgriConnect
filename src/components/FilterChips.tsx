import React, { memo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import theme from "../theme";

interface FilterChip {
  label: string;
  value: string;
  selected?: boolean;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onSelect: (value: string) => void;
  selectedValue?: string;
}

const FilterChips: React.FC<FilterChipsProps> = memo(
  ({ chips, onSelect, selectedValue }) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {chips.map((chip) => {
          const isSelected = chip.value === selectedValue;
          return (
            <TouchableOpacity
              key={chip.value}
              activeOpacity={0.7}
              onPress={() => onSelect(chip.value)}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected
                    ? styles.chipTextSelected
                    : styles.chipTextUnselected,
                ]}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    minHeight: 36,
    justifyContent: "center",
    borderWidth: 1.5,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipUnselected: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.borderDark,
  },
  chipText: {
    ...theme.typography.labelMedium,
  },
  chipTextSelected: {
    color: theme.colors.white,
  },
  chipTextUnselected: {
    color: theme.colors.gray700,
  },
});

FilterChips.displayName = "FilterChips";
export default FilterChips;
