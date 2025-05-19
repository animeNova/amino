'use server';

import { db } from "@/db";
import { getUserId } from "../helpers/get-userId";
import { revalidatePath } from "next/cache";

// Interface for chat room member results
export interface ChatRoomMemberResult {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userImage: string | null;
  role: string;
  joinedAt: Date;
}

// Get members of a chat room
export async function getChatRoomMembers(roomId: string) {
  try {
    const userId = await getUserId();
    
    // Check if user has access to this room
    const userMembership = await db
      .selectFrom('chat_room_members')
      .where('room_id', '=', roomId)
      .where('user_id', '=', userId)
      .executeTakeFirst();
      
    if (!userMembership) {
      return { 
        success: false, 
        error: "You don't have access to this chat room" 
      };
    }
    
    // Get all members of the room
    const members = await db
      .selectFrom('chat_room_members')
      .innerJoin('user', 'user.id', 'chat_room_members.user_id')
      .where('chat_room_members.room_id', '=', roomId)
      .select([
        'chat_room_members.id',
        'chat_room_members.room_id as roomId',
        'chat_room_members.user_id as userId',
        'user.name as userName',
        'user.image as userImage',
        'chat_room_members.role',
        'chat_room_members.joined_at as joinedAt'
      ])
      .orderBy('chat_room_members.role')
      .orderBy('user.name')
      .execute();
      
    return { 
      success: true, 
      data: members 
    };
  } catch (error) {
    console.error('Error fetching chat room members:', error);
    return { 
      success: false, 
      error: 'Failed to fetch chat room members' 
    };
  }
}

// Add a member to a chat room
export async function addChatRoomMember(roomId: string, memberUserId: string, role: string = 'member') {
  try {
    const userId = await getUserId();
    
    // Check if the current user is an admin or owner of the room
    const userMembership = await db
      .selectFrom('chat_room_members')
      .where('room_id', '=', roomId)
      .where('user_id', '=', userId)
      .where('role', 'in', ['admin', 'owner'])
      .executeTakeFirst();
      
    if (!userMembership) {
      return { 
        success: false, 
        error: "You don't have permission to add members to this chat room" 
      };
    }
    
    // Check if the user is already a member
    const existingMembership = await db
      .selectFrom('chat_room_members')
      .where('room_id', '=', roomId)
      .where('user_id', '=', memberUserId)
      .executeTakeFirst();
      
    if (existingMembership) {
      return { 
        success: false, 
        error: "User is already a member of this chat room" 
      };
    }
    
    // Add the user to the chat room
    await db
      .insertInto('chat_room_members')
      .values({
        room_id: roomId,
        user_id: memberUserId,
        role: role,
        joined_at: new Date().toISOString(),
        last_read_at: new Date().toISOString(),
        is_muted: false
      })
      .execute();
      
    revalidatePath(`/community/[slug]`);
    
    return { 
      success: true, 
      message: "Member added successfully" 
    };
  } catch (error) {
    console.error('Error adding chat room member:', error);
    return { 
      success: false, 
      error: 'Failed to add member to chat room' 
    };
  }
}

// Remove a member from a chat room
export async function removeChatRoomMember(memberId: string) {
  try {
    const userId = await getUserId();
    
    // Get the member record to check permissions
    const memberRecord = await db
      .selectFrom('chat_room_members')
      .where('id', '=', memberId)
      .selectAll()
      .executeTakeFirst();
      
    if (!memberRecord) {
      return { 
        success: false, 
        error: "Member not found" 
      };
    }
    
    // Check if the current user is an admin or owner of the room
    const userMembership = await db
      .selectFrom('chat_room_members')
      .where('room_id', '=', memberRecord.room_id)
      .where('user_id', '=', userId)
      .where('role', 'in', ['admin', 'owner'])
      .executeTakeFirst();
      
    // Allow users to remove themselves
    const isSelfRemoval = memberRecord.user_id === userId;
    
    if (!userMembership && !isSelfRemoval) {
      return { 
        success: false, 
        error: "You don't have permission to remove members from this chat room" 
      };
    }
    
    // Prevent removing the owner
    if (memberRecord.role === 'owner' && !isSelfRemoval) {
      return { 
        success: false, 
        error: "Cannot remove the owner of the chat room" 
      };
    }
    
    // Remove the member
    await db
      .deleteFrom('chat_room_members')
      .where('id', '=', memberId)
      .execute();
      
    revalidatePath(`/community/[slug]`);
    
    return { 
      success: true, 
      message: "Member removed successfully" 
    };
  } catch (error) {
    console.error('Error removing chat room member:', error);
    return { 
      success: false, 
      error: 'Failed to remove member from chat room' 
    };
  }
}

// Update a member's role in a chat room
export async function updateChatRoomMemberRole(memberId: string, newRole: string) {
  try {
    const userId = await getUserId();
    
    // Get the member record to check permissions
    const memberRecord = await db
      .selectFrom('chat_room_members')
      .where('id', '=', memberId)
      .selectAll()
      .executeTakeFirst();
      
    if (!memberRecord) {
      return { 
        success: false, 
        error: "Member not found" 
      };
    }
    
    // Check if the current user is an owner of the room
    const userMembership = await db
      .selectFrom('chat_room_members')
      .where('room_id', '=', memberRecord.room_id)
      .where('user_id', '=', userId)
      .where('role', '=', 'owner')
      .executeTakeFirst();
      
    if (!userMembership) {
      return { 
        success: false, 
        error: "Only the owner can change member roles" 
      };
    }
    
    // Prevent changing the owner's role
    if (memberRecord.role === 'owner') {
      return { 
        success: false, 
        error: "Cannot change the owner's role" 
      };
    }
    
    // Update the member's role
    await db
      .updateTable('chat_room_members')
      .set({ role: newRole })
      .where('id', '=', memberId)
      .execute();
      
    revalidatePath(`/community/[slug]`);
    
    return { 
      success: true, 
      message: "Member role updated successfully" 
    };
  } catch (error) {
    console.error('Error updating chat room member role:', error);
    return { 
      success: false, 
      error: 'Failed to update member role' 
    };
  }
}