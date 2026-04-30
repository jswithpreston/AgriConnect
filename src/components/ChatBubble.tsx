import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChatMessage } from "../types";
import theme from "../theme";

interface ChatBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = memo(({ message, isOwn }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return "✓✓";
      default:
        return "";
    }
  };

  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.ownContainer : styles.otherContainer,
      ]}
    >
      <View
        style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}
      >
        <Text style={[styles.text, isOwn ? styles.ownText : styles.otherText]}>
          {message.text}
        </Text>
        <View style={[styles.footer, isOwn && styles.ownFooter]}>
          <Text style={[styles.time, isOwn && styles.ownTime]}>
            {formatTime(message.timestamp)}
          </Text>
          {isOwn && (
            <Text
              style={[
                styles.status,
                message.status === "read" && styles.statusRead,
              ]}
            >
              {getStatusIcon()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  ownContainer: {
    alignItems: "flex-end",
  },
  otherContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  ownBubble: {
    backgroundColor: theme.colors.chatSent,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  otherBubble: {
    backgroundColor: theme.colors.chatReceived,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  text: {
    ...theme.typography.bodyLarge,
  },
  ownText: {
    color: theme.colors.chatSentText,
  },
  otherText: {
    color: theme.colors.chatReceivedText,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: theme.spacing.xs,
  },
  ownFooter: {
    paddingLeft: theme.spacing.xxl,
  },
  time: {
    ...theme.typography.labelSmall,
    color: theme.colors.gray400,
  },
  ownTime: {
    color: "rgba(255,255,255,0.7)",
  },
  status: {
    ...theme.typography.labelSmall,
    color: "rgba(255,255,255,0.5)",
    marginLeft: theme.spacing.xs,
  },
  statusRead: {
    color: "#A7F3D0",
  },
});

ChatBubble.displayName = "ChatBubble";
export default ChatBubble;
