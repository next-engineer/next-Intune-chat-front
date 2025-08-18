import { z } from 'zod';

export const chatRequestSchema = z.object({
  roomId: z.string().min(1, '채팅방 ID는 필수입니다'),
  content: z.string().min(1, '메시지 내용은 비어있을 수 없습니다'),
});

export type ChatRequestSchema = z.infer<typeof chatRequestSchema>;

export const validateChatRequest = (data: unknown): ChatRequestSchema => {
  return chatRequestSchema.parse(data);
}; 