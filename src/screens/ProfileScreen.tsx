import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import theme from "../theme";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import { useAuthStore } from "../stores/useAuthStore";

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          // Navigation will automatically push back to Auth because of AppNavigator logic
        },
      },
    ]);
  };

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.headerCard}>
          <Avatar name={user.name} size={80} />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.name}</Text>
              {user.isVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.colors.primary}
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>
            <Badge
              label={user.role === "farmer" ? "Farmer" : "Buyer"}
              variant="primary"
              size="md"
            />
            <Text style={styles.location}>
              <Ionicons name="location-outline" size={14} />{" "}
              {user.location.district}, {user.location.state}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          {user.role === "farmer" ? (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.totalSales || 0}</Text>
                <Text style={styles.statLabel}>Total Sales</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>4.5</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatDate(user.joinedDate)}
                </Text>
                <Text style={styles.statLabel}>Member Since</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>4.2</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatDate(user.joinedDate)}
                </Text>
                <Text style={styles.statLabel}>Member Since</Text>
              </View>
            </>
          )}
        </View>

        {/* Menu List */}
        <View style={styles.menuSection}>
          <MenuItem
            icon={
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={22}
                color={theme.colors.gray600}
              />
            }
            title="My Listings"
            subtitle="Manage your active and sold crops"
            onPress={() => navigation.navigate("MyListings")}
          />

          <MenuItem
            icon={
              <Ionicons
                name="person-outline"
                size={22}
                color={theme.colors.gray600}
              />
            }
            title="Edit Profile"
            subtitle="Update your name, phone, or district"
            onPress={() =>
              Alert.alert("UI Prototype", "Edit Profile screen coming soon!")
            }
          />

          <MenuItem
            icon={
              <Ionicons
                name="language"
                size={22}
                color={theme.colors.gray600}
              />
            }
            title="Language"
            subtitle="English"
            onPress={() =>
              Alert.alert("UI Prototype", "Language picker coming soon!")
            }
          />

          <MenuItem
            icon={
              <Ionicons
                name="notifications-outline"
                size={22}
                color={theme.colors.gray600}
              />
            }
            title="Notifications"
            subtitle="Chat messages, order updates"
            onPress={() =>
              Alert.alert("UI Prototype", "Notification settings coming soon!")
            }
            showToggle
            toggleValue={true}
          />
        </View>

        <View style={styles.menuSection}>
          <MenuItem
            icon={
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={theme.colors.gray600}
              />
            }
            title="Help & Support"
            subtitle="FAQs, contact us, report a bug"
            onPress={() =>
              Alert.alert("UI Prototype", "Help screen coming soon!")
            }
          />

          <MenuItem
            icon={
              <MaterialCommunityIcons
                name="information-outline"
                size={22}
                color={theme.colors.gray600}
              />
            }
            title="About AgriConnect"
            subtitle="Version 1.0.0"
            onPress={() =>
              Alert.alert(
                "AgriConnect",
                "Smart Farm to Market platform in Uganda.\nVersion 1.0.0",
              )
            }
          />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            size="lg"
            fullWidth
            icon={
              <MaterialCommunityIcons
                name="logout"
                size={20}
                color={theme.colors.error}
              />
            }
            textStyle={{ color: theme.colors.error }}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Reusable Menu Item Component ---
interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  showToggle?: boolean;
  toggleValue?: boolean;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  showToggle,
  onPress,
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={styles.menuItem}
  >
    <View style={styles.menuItemLeft}>
      {icon}
      <View style={styles.menuItemText}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {showToggle ? (
      <View style={[styles.toggle, styles.toggleActive]}>
        <View style={styles.toggleKnob} />
      </View>
    ) : (
      <Ionicons name="chevron-forward" size={20} color={theme.colors.gray300} />
    )}
  </TouchableOpacity>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xxl,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerInfo: {
    marginTop: theme.spacing.lg,
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    ...theme.typography.headingMedium,
    color: theme.colors.gray900,
  },
  location: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginTop: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    ...theme.typography.labelLarge,
    color: theme.colors.gray900,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.gray500,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  menuSection: {
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  menuItemTitle: {
    ...theme.typography.labelLarge,
    color: theme.colors.gray800,
  },
  menuItemSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray400,
    marginTop: 2,
  },
  // Fake Toggle UI (Just for prototype visuals)
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.gray300,
    padding: 2,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
    alignItems: "flex-end",
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  logoutContainer: {
    marginTop: theme.spacing.xxl,
    marginHorizontal: theme.spacing.lg,
  },
});

export default ProfileScreen;
