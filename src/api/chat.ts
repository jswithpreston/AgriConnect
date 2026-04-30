import { ChatConversation, ChatMessage } from "../types";
import { apiClient } from "./client";

export const chatApi = {
  getConversations: async (): Promise<ChatConversation[]> => {
    const { data } = await apiClient.get('/chat/conversations');
    return data;
  },

  getMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    const { data } = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
    return data;
  },

  sendMessage: async (
    conversationId: string,
    text: string,
  ): Promise<ChatMessage> => {
    const { data } = await apiClient.post('/chat/messages', {
      conversationId,
      text,
    });
    return data;
  },
};
