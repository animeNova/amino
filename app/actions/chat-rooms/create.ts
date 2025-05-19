'use server';

import { db } from "@/db";
import { getUserId } from "../helpers/get-userId";
import { revalidatePath } from "next/cache";
import { ChatRoomFormInput } from "@/schemas/schema";
import { canCreateChatRoom } from "@/utils/permissions";

export async function createChatRoom(data: ChatRoomFormInput) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return { 
        success: false, 
        error: "You must be logged in to create a chat room" 
      };
    }
    
    // Check if the user has permission to create a chat room in this community
    const canCreate = await canCreateChatRoom(userId, data.community_id);
    
    if (!canCreate) {
      return { 
        success: false, 
        error: "You don't have permission to create chat rooms in this community" 
      };
    }
    
    // Create the chat room
    const result = await db
      .insertInto('chat_rooms')
      .values({
        name: data.name,
        description: data.description || null,
        image: data.image || null,
        type: data.type,
        community_id: data.community_id,
        created_by: userId,
      })
      .returning(['id'])
      .executeTakeFirst();
    
    if (!result) {
      throw new Error("Failed to create chat room");
    }
    
    // Add the creator as an admin member of the chat room
    await db
      .insertInto('chat_room_members')
      .values({
        room_id: result.id,
        user_id: userId,
        role: 'admin',
        joined_at : new Date().toISOString(),
        last_read_at : new Date().toISOString(),
        is_muted : false,
      })
      .execute();
    
    // Revalidate the community page to show the new chat room
    revalidatePath(`/community/[slug]`);
    revalidatePath(`/community/${data.community_id}`);
    
    return { 
      success: true, 
      data: {
        id: result.id,
        name: data.name
      },
      message: "Chat room created successfully" 
    };
  } catch (error) {
    console.error('Error creating chat room:', error);
    return { 
      success: false, 
      error: 'Failed to create chat room' 
    };
  }
}