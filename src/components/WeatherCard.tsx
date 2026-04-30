import React, { memo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import theme from "../theme";
import { WeatherData } from "../types";

interface WeatherCardProps {
  weather: WeatherData;
  compact?: boolean;
}

const getWeatherEmoji = (icon: string): string => {
  const map: Record<string, string> = {
    sunny: "☀️",
    partly_cloudy: "⛅",
    cloudy: "☁️",
    light_rain: "🌦️",
    rain: "🌧️",
    heavy_rain: "⛈️",
    thunderstorm: "🌩️",
    fog: "🌫️",
  };
  return map[icon] || "🌤️";
};

const WeatherCard: React.FC<WeatherCardProps> = memo(
  ({ weather, compact = false }) => {
    if (compact) {
      return (
        <View style={styles.compactContainer}>
          <Text style={styles.compactEmoji}>
            {getWeatherEmoji(weather.current.icon)}
          </Text>
          <View>
            <Text style={styles.compactTemp}>{weather.current.temp}°C</Text>
            <Text style={styles.compactCondition}>
              {weather.current.condition}
            </Text>
          </View>
          {weather.alerts.length > 0 && <View style={styles.alertDot} />}
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.location}>{weather.location}</Text>

        <View style={styles.currentSection}>
          <Text style={styles.emoji}>
            {getWeatherEmoji(weather.current.icon)}
          </Text>
          <Text style={styles.temp}>{weather.current.temp}°</Text>
          <View style={styles.currentDetails}>
            <Text style={styles.condition}>{weather.current.condition}</Text>
            <Text style={styles.feelsLike}>
              Feels like {weather.current.feelsLike}°C
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>💧 Humidity</Text>
            <Text style={styles.statValue}>{weather.current.humidity}%</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>💨 Wind</Text>
            <Text style={styles.statValue}>
              {weather.current.windSpeed} km/h {weather.current.windDir}
            </Text>
          </View>
        </View>

        {weather.alerts.length > 0 && (
          <View style={styles.alertSection}>
            {weather.alerts.map((alert) => (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  alert.type === "warning" && styles.alertWarning,
                  alert.type === "danger" && styles.alertDanger,
                  alert.type === "info" && styles.alertInfo,
                ]}
              >
                <Text style={styles.alertTitle}>
                  {alert.type === "warning"
                    ? "⚠️"
                    : alert.type === "danger"
                      ? "🚨"
                      : "ℹ️"}{" "}
                  {alert.title}
                </Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.hourlySection}>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourlyScroll}
          >
            {weather.hourly.map((h, i) => (
              <View key={i} style={styles.hourlyItem}>
                <Text style={styles.hourlyTime}>{h.time}</Text>
                <Text style={styles.hourlyEmoji}>
                  {getWeatherEmoji(h.icon)}
                </Text>
                <Text style={styles.hourlyTemp}>{h.temp}°</Text>
                {h.precipitation > 30 && (
                  <Text style={styles.hourlyRain}>💧{h.precipitation}%</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.dailySection}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          {weather.daily.map((d, i) => (
            <View key={i} style={styles.dailyRow}>
              <Text style={[styles.dailyDay, i === 0 && styles.dailyDayToday]}>
                {d.dayName}
              </Text>
              <Text style={styles.dailyEmoji}>{getWeatherEmoji(d.icon)}</Text>
              {d.precipitation > 30 && (
                <Text style={styles.dailyRain}>💧{d.precipitation}%</Text>
              )}
              {d.precipitation <= 30 && <View style={{ width: 50 }} />}
              <View style={styles.dailyTempBar}>
                <View
                  style={[
                    styles.dailyTempFill,
                    {
                      flex: d.tempMax - d.tempMin + 5,
                      marginLeft: d.tempMin - 15,
                    },
                  ]}
                />
              </View>
              <Text style={styles.dailyTempLow}>{d.tempMin}°</Text>
              <Text style={styles.dailyTempHigh}>{d.tempMax}°</Text>
            </View>
          ))}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  location: {
    ...theme.typography.labelMedium,
    color: theme.colors.gray500,
    marginBottom: theme.spacing.md,
  },
  currentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  emoji: {
    fontSize: 48,
    marginRight: theme.spacing.md,
  },
  temp: {
    ...theme.typography.displayLarge,
    color: theme.colors.gray900,
    marginRight: theme.spacing.lg,
  },
  currentDetails: {
    flex: 1,
  },
  condition: {
    ...theme.typography.bodyLarge,
    color: theme.colors.gray700,
    fontWeight: "600",
  },
  feelsLike: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginTop: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    ...theme.typography.labelLarge,
    color: theme.colors.gray800,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.lg,
  },
  alertSection: {
    marginBottom: theme.spacing.lg,
  },
  alertCard: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  alertWarning: {
    backgroundColor: theme.colors.warningLight,
  },
  alertDanger: {
    backgroundColor: theme.colors.errorLight,
  },
  alertInfo: {
    backgroundColor: theme.colors.infoLight,
  },
  alertTitle: {
    ...theme.typography.labelLarge,
    color: theme.colors.gray800,
    marginBottom: theme.spacing.xs,
  },
  alertMessage: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray600,
  },
  hourlySection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.labelLarge,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.md,
  },
  hourlyScroll: {
    gap: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
  },
  hourlyItem: {
    alignItems: "center",
    minWidth: 56,
  },
  hourlyTime: {
    ...theme.typography.labelSmall,
    color: theme.colors.gray500,
    marginBottom: theme.spacing.xs,
  },
  hourlyEmoji: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  hourlyTemp: {
    ...theme.typography.labelMedium,
    color: theme.colors.gray800,
  },
  hourlyRain: {
    ...theme.typography.labelSmall,
    color: theme.colors.info,
    marginTop: theme.spacing.xs,
  },
  dailySection: {},
  dailyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  dailyDay: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gray600,
    width: 44,
  },
  dailyDayToday: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  dailyEmoji: {
    fontSize: 20,
    width: 30,
  },
  dailyRain: {
    ...theme.typography.labelSmall,
    color: theme.colors.info,
    width: 50,
  },
  dailyTempBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colors.gray200,
    borderRadius: 2,
    marginHorizontal: theme.spacing.sm,
    overflow: "hidden",
  },
  dailyTempFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  dailyTempLow: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray400,
    width: 30,
    textAlign: "right",
  },
  dailyTempHigh: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray800,
    fontWeight: "600",
    width: 30,
    textAlign: "right",
  },
  // Compact
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
    padding: theme.spacing.md,
    position: "relative",
  },
  compactEmoji: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  compactTemp: {
    ...theme.typography.headingMedium,
    color: theme.colors.gray900,
  },
  compactCondition: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
  },
  alertDot: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.warning,
  },
});

WeatherCard.displayName = "WeatherCard";
export default WeatherCard;
