import { ChatConversation, ChatMessage } from "../types";
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
} from "../constants/mockData";

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const chatApi = {
  getConversations: async (): Promise<ChatConversation[]> => {
    await delay();
    return [...MOCK_CONVERSATIONS].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  getMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    await delay();
    return MOCK_MESSAGES[conversationId] || [];
  },

  sendMessage: async (
    conversationId: string,
    text: string,
  ): Promise<ChatMessage> => {
    await delay(200);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: "demo-farmer-001",
      text,
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    if (!MOCK_MESSAGES[conversationId]) {
      MOCK_MESSAGES[conversationId] = [];
    }
    MOCK_MESSAGES[conversationId].push(newMsg);

    // Update conversation last message
    const conv = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
    if (conv) {
      conv.lastMessage = {
        text,
        timestamp: newMsg.timestamp,
        senderId: newMsg.senderId,
      };
      conv.updatedAt = newMsg.timestamp;
    }

    return newMsg;
  },
};
