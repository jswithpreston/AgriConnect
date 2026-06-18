import React from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

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
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MapScreen from "../screens/MapScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          Home: "home-outline",
          Map: "map-outline",
          Listings: "list-outline",
          Chat: "chatbubble-outline",
          Profile: "person-outline",
        };
        return (
          <Ionicons
            name={icons[route.name] || "home-outline"}
            size={size}
            color={color}
          />
        );
      },
      tabBarActiveTintColor: "#1B7A3D",
      tabBarInactiveTintColor: "#9CA3AF",
      tabBarStyle: {
        paddingBottom: 8,
        height: 60,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: "600" as const },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
    <Tab.Screen name="Map" component={MapScreen} options={{ title: "Map" }} />
    <Tab.Screen name="Listings" component={ListingsScreen} options={{ title: "Browse" }} />
    <Tab.Screen name="Chat" component={ChatInboxScreen} options={{ title: "Messages" }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    initialRouteName="Splash"
  >
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Auth" component={AuthStack} />
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen
      name="ListingDetail"
      component={ListingDetailScreen}
      options={{ headerShown: true, title: "Details" }}
    />
    <Stack.Screen
      name="CreateListing"
      component={CreateListingScreen}
      options={{ presentation: "modal", headerShown: true, title: "Create Listing" }}
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
    {/* Named "ChatInbox" so HomeScreen's navigation.navigate("ChatInbox") works */}
    <Stack.Screen
      name="ChatInbox"
      component={ChatInboxScreen}
      options={{ headerShown: true, title: "Messages" }}
    />
    <Stack.Screen
      name="Weather"
      component={WeatherScreen}
      options={{ headerShown: true, title: "Weather & Alerts" }}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{ headerShown: true, title: "Search" }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
