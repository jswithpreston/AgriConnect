import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";
import Avatar from "../components/Avatar";
import ChatBubble from "../components/ChatBubble";
import LoadingScreen from "../components/LoadingScreen";
import { useMessages, useSendMessage } from "../hooks/useChat";
import { useAuthStore } from "../stores/useAuthStore";

interface ChatThreadScreenProps {
  navigation: any;
  route: any;
}

const ChatThreadScreen: React.FC<ChatThreadScreenProps> = ({ route }) => {
  const { conversationId, recipientName } = route.params;
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const user = useAuthStore((s) => s.user);

  const { data: messages, isLoading } = useMessages(conversationId);
  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    if (messages?.length) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessageMutation.mutate({ conversationId, text: text.trim() });
    setText("");
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Avatar name={recipientName || "User"} size={36} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{recipientName || "User"}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? undefined : "padding"}
        style={styles.keyboardView}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble message={item} isOwn={item.senderId === user?.id} />
          )}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      <View style={styles.inputBar}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.gray400}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSend}
          disabled={!text.trim()}
          style={[styles.sendButton, text.trim() ? styles.sendActive : styles.sendInactive]}
        >
          <Ionicons name="send" size={20} color={text.trim() ? "#fff" : theme.colors.gray400} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  headerInfo: { marginLeft: theme.spacing.md },
  headerName: { ...theme.typography.labelLarge, color: theme.colors.gray900 },
  headerStatus: { ...theme.typography.bodySmall, color: theme.colors.online },
  keyboardView: { flex: 1 },
  messagesList: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    maxHeight: 100,
    justifyContent: "center",
  },
  input: {
    ...theme.typography.bodyLarge,
    color: theme.colors.gray900,
    maxHeight: 80,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.spacing.sm,
  },
  sendButtonActive: { backgroundColor: theme.colors.primary },
  sendButtonInactive: { backgroundColor: theme.colors.gray100 },
  sendActive: { backgroundColor: theme.colors.primary },
  sendInactive: { backgroundColor: theme.colors.gray100 },
});

export default ChatThreadScreen;
