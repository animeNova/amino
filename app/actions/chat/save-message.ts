'use server';

import { db } from '@/db';
import { getUserId } from '../helpers/get-userId';
import { ChatMessage, chatMessageSchema } from '@/schemas/chat-message';

export async function saveMessage(message: ChatMessage) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return { 
        success: false, 
        error: "You must be logged in to send messages" 
      };
    }
    
    // Validate the message
    const validatedMessage = chatMessageSchema.parse({
      ...message,
      senderId: userId, // Ensure the sender ID matches the authenticated user
    });
    
    // Save the message to the database
    const result = await db
      .insertInto('chat_messages')
      .values({
        room_id: validatedMessage.roomId,
        user_id: validatedMessage.senderId,
        content: validatedMessage.content,
        type: validatedMessage.type,
        attachments: validatedMessage.attachments ? JSON.stringify(validatedMessage.attachments) : null,
        created_at: new Date().toISOString(),
        is_edited: false,
        is_deleted: false
      })
      .returning(['id'])
      .executeTakeFirst();
    
    return { 
      success: true, 
      data: {
        id: result?.id,
      }
    };
  } catch (error) {
    console.error('Error saving message:', error);
    return { 
      success: false, 
      error: 'Failed to save message' 
    };
  }
}