import { db } from "@/db";
import { isCommunityMember, isCommunityModerator } from "./permissions";

/**
 * Check if a user can access a chat room
 */
export async function canAccessChatRoom(userId: string, roomId: string): Promise<boolean> {
    try {
        // Get the chat room
        const room = await db
            .selectFrom('chat_rooms')
            .where('id', '=', roomId)
            .select(['community_id', 'type'])
            .executeTakeFirst();
            
        if (!room) {
            return false;
        }
        
        // Public rooms are accessible to all community members
        if (room.type === 'public') {
            return await isCommunityMember(userId, room.community_id);
        }
        
        // Private rooms require specific membership
        if (room.type === 'private') {
            // Check if user is a community moderator (they can access all rooms)
            const isModerator = await isCommunityModerator(userId, room.community_id);
            if (isModerator) {
                return true;
            }
            
            // Check if user is a member of this specific room
            const isMember = await db
                .selectFrom('chat_room_members')
                .where('room_id', '=', roomId)
                .where('user_id', '=', userId)
                .select('id')
                .executeTakeFirst();
                
            return !!isMember;
        }
        
        // Direct message rooms
        if (room.type === 'direct') {
            // Check if user is a participant in this direct message
            const isParticipant = await db
                .selectFrom('chat_room_members')
                .where('room_id', '=', roomId)
                .where('user_id', '=', userId)
                .select('id')
                .executeTakeFirst();
                
            return !!isParticipant;
        }
        
        return false;
    } catch (error) {
        console.error('Error checking chat room access:', error);
        return false;
    }
}

/**
 * Check if a user can manage a chat room (create, update, delete)
 */
export async function canManageChatRoom(userId: string, roomId: string): Promise<boolean> {
    try {
        // Get the chat room
        const room = await db
            .selectFrom('chat_rooms')
            .where('id', '=', roomId)
            .select(['community_id', 'created_by'])
            .executeTakeFirst();
            
        if (!room) {
            return false;
        }
        
        // Room creator can always manage
        if (room.created_by === userId) {
            return true;
        }
        
        // Community moderators can manage all rooms
        return await isCommunityModerator(userId, room.community_id);
    } catch (error) {
        console.error('Error checking chat room management permission:', error);
        return false;
    }
}