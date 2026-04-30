import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";
import Button from "../components/Button";
import Input from "../components/Input";
import { useLogin } from "../hooks/useAuth";

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"farmer" | "buyer">("farmer");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const loginMutation = useLogin();

  const handleSendOtp = () => {
    if (phone.length === 9) {
      setShowOtp(true);
    }
  };

  const handleLogin = () => {
    if (otp.length === 6) {
      loginMutation.mutate(
        { phone, role },
        {
          onSuccess: () => {
            navigation.replace("Main");
          },
          onError: (error) => {
            Alert.alert(
              "Login Failed",
              "Something went wrong. Check your console.",
            );
            console.error("Login error:", error);
          },
        },
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        style={styles.keyboardView}
      >
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

        <View style={styles.header}>
          <MaterialCommunityIcons
            name="sprout"
            size={48}
            color={theme.colors.primary}
          />
          <Text style={styles.appName}>AgriConnect</Text>
          <Text style={styles.appSubtext}>Uganda's Farm to Market</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your account</Text>

          <View style={styles.roleContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.roleCard,
                role === "farmer" && styles.roleCardActive,
              ]}
              onPress={() => setRole("farmer")}
            >
              <MaterialCommunityIcons
                name="tractor"
                size={32}
                color={
                  role === "farmer"
                    ? theme.colors.primary
                    : theme.colors.gray400
                }
              />
              <Text
                style={[
                  styles.roleLabel,
                  role === "farmer" && styles.roleLabelActive,
                ]}
              >
                Farmer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.roleCard,
                role === "buyer" && styles.roleCardActive,
              ]}
              onPress={() => setRole("buyer")}
            >
              <Ionicons
                name="cart-outline"
                size={32}
                color={
                  role === "buyer" ? theme.colors.primary : theme.colors.gray400
                }
              />
              <Text
                style={[
                  styles.roleLabel,
                  role === "buyer" && styles.roleLabelActive,
                ]}
              >
                Buyer
              </Text>
            </TouchableOpacity>
          </View>

          {!showOtp ? (
            <>
              <Input
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="e.g. 772 123456"
                keyboardType="phone-pad"
                maxLength={9}
                leftIcon={<Text style={styles.phonePrefix}>+256</Text>}
              />
              <Button
                title="Send OTP"
                onPress={handleSendOtp}
                disabled={phone.length < 9}
                fullWidth
              />
            </>
          ) : (
            <>
              <Input
                label="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter 123456"
                keyboardType="number-pad"
                maxLength={6}
                hint={`Sent to +256 ${phone}`}
              />

              {/* CHANGED: Using loginMutation.isPending here instead of Zustand */}
              <Button
                title="Verify & Login"
                onPress={handleLogin}
                disabled={otp.length < 6 || loginMutation.isPending}
                loading={loginMutation.isPending}
                fullWidth
              />

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowOtp(false)}
                style={styles.changePhone}
              >
                <Text style={styles.changePhoneText}>Change phone number</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  keyboardView: { flex: 1 },
  demoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary50,
    paddingVertical: theme.spacing.sm,
    gap: 6,
  },
  demoText: { ...theme.typography.bodySmall, color: theme.colors.primaryDark },
  demoCode: { fontWeight: "800", letterSpacing: 1 },
  header: {
    alignItems: "center",
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl,
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
  content: { flex: 1, paddingHorizontal: theme.spacing.xl },
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
  roleContainer: {
    flexDirection: "row",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
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
  phonePrefix: {
    ...theme.typography.bodyLarge,
    color: theme.colors.gray500,
    fontWeight: "600",
  },
  changePhone: { alignItems: "center", marginTop: theme.spacing.md },
  changePhoneText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  dividerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.gray400,
    marginHorizontal: theme.spacing.lg,
  },
  registerLink: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  registerText: { ...theme.typography.bodyMedium, color: theme.colors.gray500 },
  registerHighlight: { color: theme.colors.primary, fontWeight: "700" },
});

export default LoginScreen;
