import colors from "./colors";
import typography from "./typography";
import spacing from "./spacing";

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  touchTarget: {
    minHeight: 48,
    minWidth: 48,
  },
} as const;

export type Theme = typeof theme;
export default theme;
