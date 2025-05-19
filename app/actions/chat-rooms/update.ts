'use server';

import { db } from "@/db";
import { chatRoomSchema } from "@/schemas/schema";
import { isCommunityModerator } from "@/utils/permissions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";

export async function UpdateChatRoomAction(roomId: string, data: z.infer<typeof chatRoomSchema>) {
    try {
        const userId = await getUserId();
        
        // Get the chat room to check permissions
        const room = await db
            .selectFrom('chat_rooms')
            .where('id', '=', roomId)
            .select(['community_id'])
            .executeTakeFirst();
            
        if (!room) {
            throw new Error("Chat room not found");
        }
        
        // Check if user has permission to update this chat room
        const hasPermission = await isCommunityModerator(userId, room.community_id);
        if (!hasPermission) {
            throw new Error("You don't have permission to update this chat room.");
        }
        
        const parsedData = chatRoomSchema.parse(data);
        
        // Update the chat room
        await db.updateTable('chat_rooms')
            .set({
                name: parsedData.name,
                description: parsedData.description ?? null,
                image: parsedData.image ?? null,
                type: parsedData.type,
            })
            .where('id', '=', roomId)
            .execute();
        
        // Revalidate the community page
        revalidatePath(`/community/${room.community_id}`);
        
        return { success: true, message: "Chat room updated successfully" };
    } catch (error) {
        console.error('Error updating chat room:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to update chat room');
    }
}