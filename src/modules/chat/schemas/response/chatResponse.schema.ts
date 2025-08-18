import { z } from 'zod';

export const chatMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  timestamp: z.string(),
});

export const chatRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  participants: z.array(z.string()),
  lastMessage: chatMessageSchema.optional(),
  unreadCount: z.number().default(0),
});

export type ChatMessageSchema = z.infer<typeof chatMessageSchema>;
export type ChatRoomSchema = z.infer<typeof chatRoomSchema>;

export const validateChatMessage = (data: unknown): ChatMessageSchema => {
  return chatMessageSchema.parse(data);
};

export const validateChatRoom = (data: unknown): ChatRoomSchema => {
  return chatRoomSchema.parse(data);
}; 