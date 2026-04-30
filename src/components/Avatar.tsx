import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
  showOnline?: boolean;
  isOnline?: boolean;
}

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string): string => {
  const colors = [
    "#1B7A3D",
    "#D97706",
    "#7C3AED",
    "#DC2626",
    "#0891B2",
    "#4F46E5",
    "#BE185D",
    "#065F46",
    "#92400E",
    "#1E3A5F",
    "#6D28D9",
    "#B91C1C",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const Avatar: React.FC<AvatarProps> = memo(
  ({ name, uri, size = 44, showOnline = false, isOnline = false }) => {
    const fontSize = size * 0.36;
    const onlineDotSize = Math.max(size * 0.28, 10);

    return (
      <View style={{ width: size, height: size }}>
        {uri ? (
          <View
            style={[
              styles.imagePlaceholder,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: getAvatarColor(name),
              },
            ]}
          >
            <Text style={{ color: "#fff", fontSize }}>{getInitials(name)}</Text>
          </View>
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: getAvatarColor(name),
              },
            ]}
          >
            <Text
              style={{ color: "#fff", fontSize, fontWeight: "700" as const }}
            >
              {getInitials(name)}
            </Text>
          </View>
        )}
        {showOnline && (
          <View
            style={[
              styles.onlineDot,
              {
                width: onlineDotSize,
                height: onlineDotSize,
                borderRadius: onlineDotSize / 2,
                backgroundColor: isOnline
                  ? theme.colors.online
                  : theme.colors.gray400,
                borderColor: theme.colors.white,
                right: 0,
                bottom: 0,
              },
            ]}
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    borderWidth: 2,
  },
});

Avatar.displayName = "Avatar";
export default Avatar;
