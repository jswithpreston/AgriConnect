import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";
import Button from "../components/Button";
import Input from "../components/Input";
import { useRegister } from "../hooks/useAuth";

interface RegisterScreenProps {
  navigation: any;
}

const UGANDA_DISTRICTS = [
  "Kampala", "Wakiso", "Mukono", "Jinja", "Masaka", "Mbarara",
  "Gulu", "Lira", "Fort Portal", "Kabale", "Soroti", "Arua",
  "Mbale", "Entebbe", "Kasese", "Hoima", "Rukungiri", "Iganga",
];

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"farmer" | "buyer">("farmer");
  const [district, setDistrict] = useState("");
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const registerMutation = useRegister();

  const isValid = name.length >= 2 && phone.length >= 9 && password.length >= 4 && !!district;

  const handleRegister = () => {
    if (!isValid) return;
    registerMutation.mutate(
      { name, phone, password, role, district },
      { onSuccess: () => navigation.replace("Main") },
    );
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
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.gray800} />
          </TouchableOpacity>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join AgriConnect Uganda</Text>

          {/* Role Selector */}
          <View style={styles.roleRow}>
            {(["farmer", "buyer"] as const).map((r) => (
              <TouchableOpacity
                key={r}
                activeOpacity={0.7}
                style={[styles.roleCard, role === r && styles.roleCardActive]}
                onPress={() => setRole(r)}
              >
                <MaterialCommunityIcons
                  name={r === "farmer" ? "tractor" : "cart-outline"}
                  size={28}
                  color={role === r ? theme.colors.primary : theme.colors.gray400}
                />
                <Text style={[styles.roleLabel, role === r && styles.roleLabelActive]}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input label="Full Name" value={name} onChangeText={setName} placeholder="Enter your full name" />
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. 772 123456"
            keyboardType="phone-pad"
            maxLength={10}
            leftIcon={<Text style={styles.phonePrefix}>+256</Text>}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry={!showPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color={theme.colors.gray500}
                />
              </TouchableOpacity>
            }
          />

          {/* District Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>District</Text>
            <View style={styles.districtGrid}>
              {(showDistrictPicker ? UGANDA_DISTRICTS : UGANDA_DISTRICTS.slice(0, 6)).map((d) => (
                <TouchableOpacity
                  key={d}
                  activeOpacity={0.7}
                  style={[styles.districtChip, district === d && styles.districtChipActive]}
                  onPress={() => setDistrict(d)}
                >
                  <Text style={[styles.districtChipText, district === d && styles.districtChipTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {!showDistrictPicker && (
              <TouchableOpacity onPress={() => setShowDistrictPicker(true)}>
                <Text style={styles.showMore}>Show all districts...</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            disabled={!isValid || registerMutation.isPending}
            loading={registerMutation.isPending}
            fullWidth
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Login")}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginHighlight}>Login</Text>
            </Text>
          </TouchableOpacity>
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
  backButton: { marginBottom: theme.spacing.lg, alignSelf: "flex-start", padding: theme.spacing.sm },
  title: { ...theme.typography.headingLarge, color: theme.colors.gray900, marginBottom: theme.spacing.sm },
  subtitle: { ...theme.typography.bodyLarge, color: theme.colors.gray500, marginBottom: theme.spacing.xxl },
  roleRow: { flexDirection: "row", gap: theme.spacing.lg, marginBottom: theme.spacing.xxl },
  roleCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  roleCardActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary50 },
  roleLabel: { ...theme.typography.labelLarge, color: theme.colors.gray500, marginTop: theme.spacing.sm },
  roleLabelActive: { color: theme.colors.primary, fontWeight: "700" },
  phonePrefix: { ...theme.typography.bodyLarge, color: theme.colors.gray500, fontWeight: "600" },
  pickerContainer: { marginBottom: theme.spacing.xl },
  pickerLabel: { ...theme.typography.labelMedium, color: theme.colors.gray700, marginBottom: theme.spacing.sm },
  districtGrid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  districtChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  districtChipActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary50 },
  districtChipText: { ...theme.typography.labelSmall, color: theme.colors.gray600 },
  districtChipTextActive: { color: theme.colors.primary, fontWeight: "700" },
  showMore: { ...theme.typography.bodySmall, color: theme.colors.primary, marginTop: theme.spacing.sm },
  loginLink: { alignItems: "center", marginTop: theme.spacing.xl },
  loginText: { ...theme.typography.bodyMedium, color: theme.colors.gray500 },
  loginHighlight: { color: theme.colors.primary, fontWeight: "700" },
});

export default RegisterScreen;
