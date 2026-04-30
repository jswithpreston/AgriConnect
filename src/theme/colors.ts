const colors = {
  // Primary — deep green, high visibility in sunlight
  primary: "#1B7A3D",
  primaryLight: "#28A745",
  primaryDark: "#145C2E",
  primary50: "#E8F5EC",
  primary100: "#C6E9CD",

  // Secondary — warm amber for CTAs
  secondary: "#F59E0B",
  secondaryLight: "#FBBF24",
  secondaryDark: "#D97706",
  secondary50: "#FEF9E7",

  // Neutrals — high contrast for outdoor use
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
  black: "#000000",

  // Semantic
  success: "#059669",
  successLight: "#D1FAE5",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  error: "#DC2626",
  errorLight: "#FEE2E2",
  info: "#2563EB",
  infoLight: "#DBEAFE",

  // Quality grades
  qualityA: "#059669",
  qualityB: "#D97706",
  qualityC: "#DC2626",

  // Map
  mapPin: "#DC2626",
  mapCluster: "#1B7A3D",
  mapClusterText: "#FFFFFF",

  // Chat
  chatSent: "#1B7A3D",
  chatSentText: "#FFFFFF",
  chatReceived: "#F3F4F6",
  chatReceivedText: "#111827",

  // Status
  online: "#22C55E",
  offline: "#9CA3AF",

  // Overlays
  overlay: "rgba(0, 0, 0, 0.5)",
  overlayLight: "rgba(0, 0, 0, 0.1)",

  // Background
  background: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",

  // Borders
  border: "#E5E7EB",
  borderDark: "#D1D5DB",
} as const;

export default colors;
export type Colors = typeof colors;
