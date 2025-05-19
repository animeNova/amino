'use server';

import { db } from "@/db";
import { getUserId } from "../helpers/get-userId";
import { canAccessChatRoom } from "@/utils/chat-permissions";

export interface ChatMessageResult {
    id: string;
    content: string;
    attachments: any | null;
    type: string;
    room_id: string;
    user_id: string;
    user_name: string;
    user_image: string | null;
    reply_to: string | null;
    reply_to_content?: string | null;
    reply_to_user_name?: string | null;
    is_edited: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface GetChatMessagesOptions {
    limit?: number;
    before?: string; // Message ID to get messages before (for pagination)
    after?: string;  // Message ID to get messages after (for real-time updates)
}

export async function getChatMessages(roomId: string, options: GetChatMessagesOptions = {}) {
    try {
        const userId = await getUserId();
        
        // Check if user has permission to access this room
        // const hasPermission = await canAccessChatRoom(userId, roomId);
        // if (!hasPermission) {
        //     throw new Error("You don't have permission to access this chat room.");
        // }
        
        const limit = options.limit ?? 50;
        
        // Build the query
        let query = db.selectFrom('chat_messages')
            .where('room_id', '=', roomId)
            .innerJoin('user', 'user.id', 'chat_messages.user_id')
            .select([
                'chat_messages.id',
                'chat_messages.content',
                'chat_messages.attachments',
                'chat_messages.type',
                'chat_messages.room_id',
                'chat_messages.user_id',
                'user.name as user_name',
                'user.image as user_image',
                'chat_messages.reply_to',
                'chat_messages.is_edited',
                'chat_messages.created_at',
                'chat_messages.updated_at',
            ])
            .limit(limit);
            
        // Apply pagination if needed
        if (options.before) {
            query = query.where('chat_messages.id', '<', options.before);
        } else if (options.after) {
            query = query.where('chat_messages.id', '>', options.after);
        }
        
        // Get messages ordered by creation time (newest first for pagination)
        const messages = await query
            .orderBy('chat_messages.created_at', 'desc')
            .execute();
            
        // If there are reply messages, fetch the replied-to content
        const messagesWithReplies = await Promise.all(
            messages.map(async (message) => {
                if (message.reply_to) {
                    const replyMessage = await db
                        .selectFrom('chat_messages')
                        .innerJoin('user', 'user.id', 'chat_messages.user_id')
                        .where('chat_messages.id', '=', message.reply_to)
                        .select([
                            'chat_messages.content as reply_to_content',
                            'user.name as reply_to_user_name',
                        ])
                        .executeTakeFirst();
                        
                    return {
                        ...message,
                        reply_to_content: replyMessage?.reply_to_content ?? null,
                        reply_to_user_name: replyMessage?.reply_to_user_name ?? null,
                    };
                }
                return message;
            })
        );
        
        // Return in chronological order for display (oldest first)
        return { messages: messagesWithReplies.reverse() };
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        throw new Error('Failed to fetch chat messages');
    }
}