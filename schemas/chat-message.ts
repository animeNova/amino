import * as z from 'zod';

export const chatMessageSchema = z.object({
  id: z.string().optional(),
  roomId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  senderAvatar: z.string().optional(),
  content: z.string().min(1, "Message cannot be empty"),
  timestamp: z.date().optional(),
  type: z.enum(['text', 'image', 'system']).default('text'),
  attachments: z.array(z.string()).optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatInputSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  roomId: z.string(),
  type: z.enum(['text', 'image']).default('text'),
  attachments: z.array(z.string()).optional(),
});

export type ChatInputValues = z.infer<typeof chatInputSchema>;