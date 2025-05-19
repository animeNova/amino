'use server';

import { db } from "@/db";
import { chatMessageSchema } from "@/schemas/schema";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";
import { canAccessChatRoom } from "@/utils/chat-permissions";

export async function CreateChatMessageAction(data: z.infer<typeof chatMessageSchema>) {
    try {
        const userId = await getUserId();
        
        // Check if user has permission to send messages in this room
        const hasPermission = await canAccessChatRoom(userId, data.room_id);
        if (!hasPermission) {
            throw new Error("You don't have permission to send messages in this chat room.");
        }
        
        const parsedData = chatMessageSchema.parse(data);
        
        // Insert the message
        const result = await db.insertInto('chat_messages').values({
            content: parsedData.content,
            attachments: parsedData.attachments || null,
            type: parsedData.type || 'text',
            room_id: parsedData.room_id,
            user_id: userId,
            reply_to: parsedData.reply_to || null,
            is_edited: false,
            is_deleted: false
        }).returningAll().executeTakeFirst();
        
        return { success: true, messageId: result?.id };
    } catch (error) {
        console.error('Error creating chat message:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to send message');
    }
}