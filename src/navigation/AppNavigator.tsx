import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// --- REAL SCREEN IMPORTS ---
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import HomeScreen from "../screens/HomeScreen";
import ListingsScreen from "../screens/ListingsScreen";
import ListingDetailScreen from "../screens/ListingDetailScreen";
import CreateListingScreen from "../screens/CreateListingScreen";
import MyListingsScreen from "../screens/MyListingsScreen";
import ChatInboxScreen from "../screens/ChatInboxScreen";
import ChatThreadScreen from "../screens/ChatThreadScreen";
import WeatherScreen from "../screens/WeatherScreen";

// --- NAVIGATORS SETUP ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- PLACEHOLDER FOR UNBUILT SCREENS ---
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={styles.center}>
    <MaterialCommunityIcons name="progress-helper" size={48} color="#9CA3AF" />
    <Text style={{ marginTop: 16, color: "#6B7280", fontSize: 16 }}>
      {name} (Coming Soon)
    </Text>
  </View>
);

// --- TAB NAVIGATOR ---
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
        if (route.name === "Map") iconName = "map-outline";
        if (route.name === "Listings") iconName = "list-outline";
        if (route.name === "Chat") iconName = "chatbubble-outline";
        if (route.name === "Profile") iconName = "person-outline";

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#1B7A3D",
      tabBarInactiveTintColor: "#9CA3AF",
      tabBarStyle: {
        paddingBottom: 8,
        height: 60,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600" as const,
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: "Home" }}
    />

    {/* Unbuilt screens use children pattern to avoid React Navigation warnings */}
    <Tab.Screen name="Map">
      {() => <PlaceholderScreen name="Map View" />}
    </Tab.Screen>

    <Tab.Screen
      name="Listings"
      component={ListingsScreen}
      options={{ title: "Browse" }}
    />
    <Tab.Screen
      name="Chat"
      component={ChatInboxScreen}
      options={{ title: "Messages" }}
    />

    <Tab.Screen name="Profile">
      {() => <PlaceholderScreen name="Profile" />}
    </Tab.Screen>
  </Tab.Navigator>
);

// --- AUTH STACK ---
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// --- ROOT STACK NAVIGATOR ---
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      initialRouteName="Splash"
    >
      {/* Entry & Auth Flows */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth" component={AuthStack} />

      {/* Main App Tabs */}
      <Stack.Screen name="Main" component={MainTabs} />

      {/* Detail & Modal Screens */}
      <Stack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={{ headerShown: true, title: "Details" }}
      />
      <Stack.Screen
        name="CreateListing"
        component={CreateListingScreen}
        options={{
          presentation: "modal",
          headerShown: true,
          title: "Create Listing",
        }}
      />
      <Stack.Screen
        name="MyListings"
        component={MyListingsScreen}
        options={{ headerShown: true, title: "My Listings" }}
      />
      <Stack.Screen
        name="ChatThread"
        component={ChatThreadScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Weather"
        component={WeatherScreen}
        options={{ headerShown: true, title: "Weather & Alerts" }}
      />
    </Stack.Navigator>
  );
};

// --- STYLES (Fixed with StyleSheet.create) ---
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
});

export default AppNavigator;
