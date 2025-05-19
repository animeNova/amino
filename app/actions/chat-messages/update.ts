'use server';

import { db } from "@/db";
import { updateChatMessageSchema } from "@/schemas/schema";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";

export async function UpdateChatMessageAction(messageId: string, data: z.infer<typeof updateChatMessageSchema>) {
    try {
        const userId = await getUserId();
        
        // Check if the message exists and belongs to the user
        const message = await db
            .selectFrom('chat_messages')
            .where('id', '=', messageId)
            .select(['user_id'])
            .executeTakeFirst();
            
        if (!message) {
            throw new Error("Message not found");
        }
        
        if (message.user_id !== userId) {
            throw new Error("You can only edit your own messages");
        }
        
        const parsedData = updateChatMessageSchema.parse(data);
        
        // Update the message
        await db.updateTable('chat_messages')
            .set({
                content: parsedData.content,
                is_edited: true
            })
            .where('id', '=', messageId)
            .execute();
        
        return { success: true, message: "Message updated successfully" };
    } catch (error) {
        console.error('Error updating chat message:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to update message');
    }
}