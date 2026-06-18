import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";
import { useWeather } from "../hooks/useWeather";

const WeatherScreen: React.FC = () => {
  const { data: weather, isLoading } = useWeather();

  if (isLoading || !weather) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={theme.colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Weather */}
        <View style={styles.currentCard}>
          <Text style={styles.location}>{weather.location}</Text>
          <Text style={styles.tempLarge}>{weather.current.temp}°C</Text>
          <Text style={styles.condition}>{weather.current.condition}</Text>
          <View style={styles.currentDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.detailText}>{weather.current.humidity}%</Text>
              <Text style={styles.detailLabel}>Humidity</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.detailText}>{weather.current.windSpeed} km/h</Text>
              <Text style={styles.detailLabel}>Wind</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="thermometer-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.detailText}>{weather.current.feelsLike}°C</Text>
              <Text style={styles.detailLabel}>Feels Like</Text>
            </View>
          </View>
        </View>

        {/* Alerts */}
        {weather.alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farming Alerts</Text>
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
                <Ionicons
                  name={
                    alert.type === "warning"
                      ? "warning-outline"
                      : alert.type === "danger"
                      ? "alert-circle-outline"
                      : "information-circle-outline"
                  }
                  size={20}
                  color={
                    alert.type === "warning"
                      ? theme.colors.warning
                      : alert.type === "danger"
                      ? theme.colors.error
                      : theme.colors.info
                  }
                />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Hourly Forecast */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.hourlyRow}>
              {weather.hourly.map((h, i) => (
                <View key={i} style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>{h.time}</Text>
                  <Text style={styles.hourlyIcon}>{h.icon}</Text>
                  <Text style={styles.hourlyTemp}>{h.temp}°</Text>
                  {h.precipitation > 0 && (
                    <Text style={styles.hourlyRain}>{h.precipitation}%</Text>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 7-Day Forecast */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          {weather.daily.map((day, i) => (
            <View key={i} style={styles.dailyRow}>
              <Text style={styles.dayName}>{day.dayName}</Text>
              <Text style={styles.dailyIcon}>{day.icon}</Text>
              <Text style={styles.dailyCondition}>{day.condition}</Text>
              <View style={styles.dailyTemps}>
                <Text style={styles.tempMax}>{day.tempMax}°</Text>
                <Text style={styles.tempMin}>{day.tempMin}°</Text>
              </View>
              {day.precipitation > 0 && (
                <View style={styles.rainChance}>
                  <Ionicons name="rainy-outline" size={12} color={theme.colors.info} />
                  <Text style={styles.rainText}>{day.precipitation}%</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: theme.spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  currentCard: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xxl,
    alignItems: "center",
    paddingBottom: theme.spacing.xxxl,
  },
  location: { ...theme.typography.labelLarge, color: "rgba(255,255,255,0.8)", marginBottom: theme.spacing.sm },
  tempLarge: { fontSize: 72, fontWeight: "200", color: "#fff", lineHeight: 80 },
  condition: { ...theme.typography.bodyLarge, color: "rgba(255,255,255,0.9)", marginTop: theme.spacing.sm },
  currentDetails: {
    flexDirection: "row",
    marginTop: theme.spacing.xl,
    gap: theme.spacing.xxl,
  },
  detailItem: { alignItems: "center", gap: 4 },
  detailText: { ...theme.typography.labelMedium, color: "#fff" },
  detailLabel: { ...theme.typography.labelSmall, color: "rgba(255,255,255,0.7)" },
  section: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    marginBottom: 0,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  sectionTitle: { ...theme.typography.labelLarge, color: theme.colors.gray700, marginBottom: theme.spacing.md },
  alertCard: {
    flexDirection: "row",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
    alignItems: "flex-start",
  },
  alertWarning: { backgroundColor: theme.colors.warningLight },
  alertDanger: { backgroundColor: theme.colors.errorLight },
  alertInfo: { backgroundColor: theme.colors.infoLight },
  alertContent: { flex: 1 },
  alertTitle: { ...theme.typography.labelMedium, color: theme.colors.gray800, marginBottom: 4 },
  alertMessage: { ...theme.typography.bodySmall, color: theme.colors.gray600 },
  hourlyRow: { flexDirection: "row", gap: theme.spacing.md, paddingVertical: theme.spacing.sm },
  hourlyItem: { alignItems: "center", minWidth: 56, gap: 4 },
  hourlyTime: { ...theme.typography.labelSmall, color: theme.colors.gray500 },
  hourlyIcon: { fontSize: 24 },
  hourlyTemp: { ...theme.typography.labelMedium, color: theme.colors.gray800 },
  hourlyRain: { ...theme.typography.labelSmall, color: theme.colors.info },
  dailyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  dayName: { ...theme.typography.labelMedium, color: theme.colors.gray700, width: 80 },
  dailyIcon: { fontSize: 20, width: 32, textAlign: "center" },
  dailyCondition: { ...theme.typography.bodySmall, color: theme.colors.gray500, flex: 1 },
  dailyTemps: { flexDirection: "row", gap: theme.spacing.sm },
  tempMax: { ...theme.typography.labelMedium, color: theme.colors.gray800 },
  tempMin: { ...theme.typography.labelSmall, color: theme.colors.gray400 },
  rainChance: { flexDirection: "row", alignItems: "center", gap: 2, marginLeft: theme.spacing.sm },
  rainText: { ...theme.typography.labelSmall, color: theme.colors.info },
});

export default WeatherScreen;
