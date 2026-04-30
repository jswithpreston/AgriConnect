import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chat";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => chatApi.getConversations(),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => chatApi.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 1000 * 15,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      text,
    }: {
      conversationId: string;
      text: string;
    }) => chatApi.sendMessage(conversationId, text),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
