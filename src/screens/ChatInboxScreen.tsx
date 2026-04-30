import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import LoadingScreen from "../components/LoadingScreen";
import EmptyState from "../components/EmptyState";
import { useConversations } from "../hooks/useChat";

interface ChatInboxScreenProps {
  navigation: any;
}

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  }
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
};

const ChatInboxScreen: React.FC<ChatInboxScreenProps> = ({ navigation }) => {
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) return <LoadingScreen />;

  const handlePress = (conversation: any) => {
    navigation.navigate("ChatThread", {
      conversationId: conversation.id,
      recipientName: conversation.participants.find(
        (p: any) => p.id !== "current_user",
      )?.name,
    });
  };

  const renderConversation = ({ item }: any) => {
    const otherUser = item.participants.find(
      (p: any) => p.id !== "current_user",
    );

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress(item)}
        style={styles.card}
      >
        <Avatar
          name={otherUser?.name || "User"}
          size={52}
          showOnline
          isOnline={otherUser?.isOnline}
        />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>
              {otherUser?.name}
            </Text>
            <Text style={styles.time}>
              {formatTime(item.lastMessage.timestamp)}
            </Text>
          </View>
          <Text style={styles.message} numberOfLines={1}>
            {item.lastMessage.text}
          </Text>
          {item.listing && (
            <View style={styles.listingContext}>
              <Ionicons
                name="leaf-outline"
                size={12}
                color={theme.colors.primary}
              />
              <Text style={styles.listingText}>
                {item.listing.crop} • {item.listing.price}
              </Text>
            </View>
          )}
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon={
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color={theme.colors.gray300}
              />
            }
            title="No messages yet"
            description="Start a conversation by contacting a farmer or buyer from a listing."
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: { ...theme.typography.headingLarge, color: theme.colors.gray900 },
  listContent: { paddingBottom: theme.spacing.xxl },
  card: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  content: { flex: 1, marginLeft: theme.spacing.md },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    ...theme.typography.labelLarge,
    color: theme.colors.gray900,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  time: { ...theme.typography.labelSmall, color: theme.colors.gray400 },
  message: { ...theme.typography.bodySmall, color: theme.colors.gray500 },
  listingContext: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: theme.colors.primary50,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  listingText: {
    ...theme.typography.labelSmall,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});

export default ChatInboxScreen;
