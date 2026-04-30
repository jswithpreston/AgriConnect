import React, { memo, forwardRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from "react-native";
import theme from "../theme";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextInputProps["style"];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      containerStyle,
      inputStyle,
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const hasError = !!error;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.inputWrapper,
            hasError && styles.inputError,
            props.editable === false && styles.inputDisabled,
          ]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon ? styles.inputWithLeftIcon : undefined,
              rightIcon ? styles.inputWithRightIcon : undefined,
              inputStyle,
            ]}
            placeholderTextColor={theme.colors.gray400}
            underlineColorAndroid="transparent"
            {...props}
          />
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.labelMedium,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: theme.colors.borderDark,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    minHeight: theme.touchTarget.minHeight,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputDisabled: {
    backgroundColor: theme.colors.gray100,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    ...theme.typography.bodyLarge,
    color: theme.colors.gray900,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  inputWithLeftIcon: {
    paddingLeft: theme.spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: theme.spacing.sm,
  },
  leftIcon: {
    paddingLeft: theme.spacing.lg,
  },
  rightIcon: {
    paddingRight: theme.spacing.lg,
  },
  errorText: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  hintText: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginTop: theme.spacing.xs,
  },
});

Input.displayName = "Input";
export default memo(Input);
