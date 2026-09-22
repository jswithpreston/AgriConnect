import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";
import Button from "../components/Button";
import Input from "../components/Input";
import { useLogin } from "../hooks/useAuth";
import { DEMO_ACCOUNTS } from "../constants/demoCredentials";

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"farmer" | "buyer">("farmer");
  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }
    loginMutation.mutate(
      { phone: email.trim(), password, role },
      {
        onSuccess: () => navigation.replace("Main"),
        onError: () =>
          Alert.alert("Login Failed", "Invalid credentials. Try a demo account below."),
      },
    );
  };

  const handleDemoLogin = (index: number) => {
    const account = DEMO_ACCOUNTS[index];
    setEmail(account.email);
    setPassword(account.password);
    setRole(account.role);
    loginMutation.mutate(
      { phone: account.email, password: account.password, role: account.role },
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
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="sprout"
              size={56}
              color={theme.colors.primary}
            />
            <Text style={styles.appName}>AgriConnect</Text>
            <Text style={styles.appSubtext}>Uganda's Farm to Market</Text>
          </View>

          {/* Demo Banner */}
          <View style={styles.demoBanner}>
            <Ionicons
              name="flash"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.demoTitle}>Demo Mode Active</Text>
          </View>

          {/* Demo Quick Login Buttons */}
          <View style={styles.demoSection}>
            <Text style={styles.demoSectionLabel}>Quick Demo Login</Text>
            <View style={styles.demoButtons}>
              {DEMO_ACCOUNTS.map((account, i) => (
                <TouchableOpacity
                  key={account.email}
                  activeOpacity={0.8}
                  style={[
                    styles.demoCard,
                    account.role === "farmer"
                      ? styles.demoCardFarmer
                      : styles.demoCardBuyer,
                  ]}
                  onPress={() => handleDemoLogin(i)}
                  disabled={loginMutation.isPending}
                >
                  <MaterialCommunityIcons
                    name={account.role === "farmer" ? "tractor" : "cart-outline"}
                    size={28}
                    color={
                      account.role === "farmer"
                        ? theme.colors.primary
                        : theme.colors.secondary
                    }
                  />
                  <Text style={styles.demoCardLabel}>{account.label}</Text>
                  <Text style={styles.demoCardEmail}>{account.email}</Text>
                  <Text style={styles.demoCardPass}>pw: {account.password}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or login manually</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Role Selector */}
          <View style={styles.roleContainer}>
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
                  color={
                    role === r ? theme.colors.primary : theme.colors.gray400
                  }
                />
                <Text
                  style={[
                    styles.roleLabel,
                    role === r && styles.roleLabelActive,
                  ]}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="farmer@demo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="demo123"
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
            <Button
              title="Login"
              onPress={handleLogin}
              disabled={loginMutation.isPending}
              loading={loginMutation.isPending}
              fullWidth
            />
          </View>

          {/* Register Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Register")}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              New here?{" "}
              <Text style={styles.registerHighlight}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.xxl },
  header: {
    alignItems: "center",
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  appName: {
    ...theme.typography.headingLarge,
    color: theme.colors.primary,
    fontWeight: "800",
    marginTop: theme.spacing.sm,
  },
  appSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray500,
    marginTop: theme.spacing.xs,
  },
  demoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary50,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: 6,
    marginBottom: theme.spacing.lg,
  },
  demoTitle: {
    ...theme.typography.labelMedium,
    color: theme.colors.primaryDark,
    fontWeight: "700",
  },
  demoSection: { marginBottom: theme.spacing.xl },
  demoSectionLabel: {
    ...theme.typography.labelMedium,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  demoButtons: { flexDirection: "row", gap: theme.spacing.md },
  demoCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    gap: theme.spacing.xs,
  },
  demoCardFarmer: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary50,
  },
  demoCardBuyer: {
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.secondary50,
  },
  demoCardLabel: {
    ...theme.typography.labelMedium,
    color: theme.colors.gray800,
    fontWeight: "700",
  },
  demoCardEmail: {
    ...theme.typography.labelSmall,
    color: theme.colors.gray500,
    fontSize: 10,
  },
  demoCardPass: {
    ...theme.typography.labelSmall,
    color: theme.colors.gray400,
    fontSize: 10,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  dividerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray400,
    marginHorizontal: theme.spacing.md,
  },
  roleContainer: {
    flexDirection: "row",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  roleCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  roleCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary50,
  },
  roleLabel: {
    ...theme.typography.labelLarge,
    color: theme.colors.gray500,
    marginTop: theme.spacing.sm,
  },
  roleLabelActive: { color: theme.colors.primary, fontWeight: "700" },
  form: { gap: theme.spacing.sm, marginBottom: theme.spacing.xl },
  registerLink: { alignItems: "center", paddingVertical: theme.spacing.md },
  registerText: { ...theme.typography.bodyMedium, color: theme.colors.gray500 },
  registerHighlight: { color: theme.colors.primary, fontWeight: "700" },
});

export default LoginScreen;
