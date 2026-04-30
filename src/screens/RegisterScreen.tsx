import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";
import Button from "../components/Button";
import Input from "../components/Input";
import { useRegister } from "../hooks/useAuth";

interface RegisterScreenProps {
  navigation: any;
}

const UGANDA_DISTRICTS = [
  "Kampala",
  "Wakiso",
  "Mukono",
  "Jinja",
  "Masaka",
  "Mbarara",
  "Gulu",
  "Lira",
  "Fort Portal",
  "Kabale",
  "Soroti",
  "Arua",
  "Mbale",
  "Entebbe",
  "Kasese",
  "Hoima",
  "Rukungiri",
  "Iganga",
  "Bushenyi",
  "Kotido",
];

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"farmer" | "buyer">("farmer");
  const [district, setDistrict] = useState("");
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const registerMutation = useRegister();

  const handleSendOtp = () => {
    if (name.length >= 2 && phone.length === 9 && district) {
      setShowOtp(true);
    }
  };

  const handleRegister = () => {
    if (otp.length === 6) {
      registerMutation.mutate(
        { name, phone, role, district },
        {
          onSuccess: () => {
            // Success! Navigate straight to the Main App tabs
            navigation.replace("Main");
          },
        },
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Demo Mode Banner */}
          <View style={styles.demoBanner}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color={theme.colors.primary}
            />
            <Text style={styles.demoText}>
              Demo Mode: Use OTP <Text style={styles.demoCode}>123456</Text>
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.gray800}
            />
          </TouchableOpacity>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join AgriConnect Uganda</Text>

          {/* Role Selector */}
          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.md,
              marginBottom: theme.spacing.xxl,
            }}
          >
            {(["farmer", "buyer"] as const).map((r) => (
              <View key={r} style={{ flex: 1 }}>
                <Button
                  title={r === "farmer" ? "  Farmer" : "  Buyer"}
                  onPress={() => setRole(r)}
                  variant={role === r ? "primary" : "outline"}
                  size="md"
                  icon={
                    r === "farmer" ? (
                      <MaterialCommunityIcons
                        name="tractor"
                        size={18}
                        color={
                          role === "farmer" ? "#fff" : theme.colors.primary
                        }
                      />
                    ) : (
                      <Ionicons
                        name="cart-outline"
                        size={18}
                        color={role === "buyer" ? "#fff" : theme.colors.primary}
                      />
                    )
                  }
                />
              </View>
            ))}
          </View>

          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />

          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. 772 123456"
            keyboardType="phone-pad"
            maxLength={9}
            leftIcon={<Text style={styles.phonePrefix}>+256</Text>}
          />

          {/* District Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>District</Text>
            <View style={styles.pickerRow}>
              {UGANDA_DISTRICTS.slice(0, 5).map((d) => (
                <View key={d} style={styles.chipWrapper}>
                  <Button
                    title={d}
                    onPress={() => setDistrict(d)}
                    variant={district === d ? "primary" : "outline"}
                    size="sm"
                  />
                </View>
              ))}
            </View>
            {showDistrictPicker ? (
              <View style={styles.districtGrid}>
                {UGANDA_DISTRICTS.map((d) => (
                  <View key={d} style={styles.chipWrapper}>
                    <Button
                      title={d}
                      onPress={() => {
                        setDistrict(d);
                        setShowDistrictPicker(false);
                      }}
                      variant={district === d ? "primary" : "ghost"}
                      size="sm"
                    />
                  </View>
                ))}
              </View>
            ) : (
              <Text
                style={styles.showMore}
                onPress={() => setShowDistrictPicker(true)}
              >
                Show more districts...
              </Text>
            )}
          </View>

          {!showOtp ? (
            <Button
              title="Send OTP"
              onPress={handleSendOtp}
              disabled={name.length < 2 || phone.length < 9 || !district}
              fullWidth
            />
          ) : (
            <>
              <Input
                label="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter 123456"
                keyboardType="number-pad"
                maxLength={6}
              />
              <Button
                title="Verify & Create Account"
                onPress={handleRegister}
                disabled={otp.length < 6}
                loading={registerMutation.isPending}
                fullWidth
              />
            </>
          )}

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text
                style={styles.loginHighlight}
                onPress={() => navigation.navigate("Login")}
              >
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  demoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary50,
    paddingVertical: theme.spacing.sm,
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  demoText: { ...theme.typography.bodySmall, color: theme.colors.primaryDark },
  demoCode: { fontWeight: "800", letterSpacing: 1 },
  backButton: {
    marginBottom: theme.spacing.lg,
    alignSelf: "flex-start",
    padding: theme.spacing.sm,
  },
  title: {
    ...theme.typography.headingLarge,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.gray500,
    marginBottom: theme.spacing.xxl,
  },
  phonePrefix: {
    ...theme.typography.bodyLarge,
    color: theme.colors.gray500,
    fontWeight: "600",
  },
  pickerContainer: { marginBottom: theme.spacing.lg },
  pickerLabel: {
    ...theme.typography.labelMedium,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.sm,
  },
  pickerRow: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  chipWrapper: { marginBottom: theme.spacing.xs },
  districtGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  showMore: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
  loginLink: { alignItems: "center", marginTop: theme.spacing.xl },
  loginText: { ...theme.typography.bodyMedium, color: theme.colors.gray500 },
  loginHighlight: { color: theme.colors.primary, fontWeight: "700" },
});

export default RegisterScreen;
