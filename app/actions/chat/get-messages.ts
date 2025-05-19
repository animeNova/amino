'use server';

import { db } from '@/db';
import { getUserId } from '../helpers/get-userId';
import { ChatMessage } from '@/schemas/chat-message';

export async function getChatMessages(roomId: string, limit = 50) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return { 
        success: false, 
        error: "You must be logged in to view messages",
        messages: [] 
      };
    }
    
    // Get messages from the database
    const messages = await db
      .selectFrom('chat_messages as cm')
      .innerJoin('user as u', 'u.id', 'cm.user_id')
      .select([
        'cm.id',
        'cm.room_id as roomId',
        'cm.user_id as senderId',
        'u.name as senderName',
        'u.image as senderAvatar',
        'cm.content',
        'cm.type',
        'cm.attachments',
        'cm.created_at as timestamp',
      ])
      .where('cm.room_id', '=', roomId)
      .orderBy('cm.created_at', 'asc')
      .limit(limit)
      .execute();
    
    // Transform the messages to match the ChatMessage type
    const formattedMessages: ChatMessage[] = messages.map(msg => ({
      id: msg.id,
      roomId: msg.roomId,
      senderId: msg.senderId,
      senderName: msg.senderName || 'Anonymous',
      senderAvatar: msg.senderAvatar || undefined,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      type: msg.type as 'text' | 'image' | 'system',
      attachments: msg.attachments ? JSON.parse(msg.attachments) : undefined,
    }));
    
    return { 
      success: true, 
      messages: formattedMessages 
    };
  } catch (error) {
    console.error('Error getting messages:', error);
    return { 
      success: false, 
      error: 'Failed to load messages',
      messages: [] 
    };
  }
}