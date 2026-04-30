const typography = {
  // Display — large headings
  displayLarge: {
    fontSize: 32,
    fontWeight: "800" as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 36,
    letterSpacing: -0.3,
  },

  // Headings
  headingLarge: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  headingMedium: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  headingSmall: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },

  // Body — optimized for readability
  bodyLarge: {
    fontSize: 17,
    fontWeight: "400" as const,
    lineHeight: 26,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 18,
  },

  // Labels
  labelLarge: {
    fontSize: 15,
    fontWeight: "600" as const,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 13,
    fontWeight: "600" as const,
    lineHeight: 18,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: "600" as const,
    lineHeight: 16,
    letterSpacing: 0.3,
  },

  // Overlines
  overline: {
    fontSize: 11,
    fontWeight: "700" as const,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
} as const;

export default typography;
export type Typography = typeof typography;
