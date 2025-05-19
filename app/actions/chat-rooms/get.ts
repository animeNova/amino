'use server';

import { db } from "@/db";
import { isCommunityMember } from "@/utils/permissions";
import { getUserIdSafe } from "../helpers/get-userId";

export interface ChatRoomResult {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    type: 'public' | 'private' | 'direct';
    community_id: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
    memberCount: string | number | bigint | null;
}

export async function getChatRoomsByCommunity(communityId: string) {
    try {
        const userId = await getUserIdSafe();
        
        // Check if user is a member of the community for private rooms
        const isMember = userId ? await isCommunityMember(userId, communityId) : false;
        
        // Base query to get all public rooms
        let query = db.selectFrom('chat_rooms')
            .where('community_id', '=', communityId)
            .where('type', '=', 'public');
            
        // If user is a member, also include private rooms
        if (isMember) {
            query = db.selectFrom('chat_rooms')
                .where('community_id', '=', communityId)
                .where(eb => 
                    eb.or([
                        eb('type', '=', 'public'),
                        eb('type', '=', 'private')
                    ])
                );
        }
        
        // Add member count subquery
        const rooms = await query
            .select([
                'id',
                'name',
                'description',
                'image',
                'type',
                'community_id',
                'created_by',
                'created_at',
                'updated_at',
                eb => eb.selectFrom('chat_room_members')
                    .whereRef('chat_room_members.room_id', '=', 'chat_rooms.id')
                    .select(eb => eb.fn.count('user_id').as('count'))
                    .as('memberCount')
            ])
            .orderBy('created_at', 'desc')
            .execute();
            
        return { rooms };
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        throw new Error('Failed to fetch chat rooms');
    }
}

export async function getChatRoomById(roomId: string): Promise<ChatRoomResult | null> {
    try {
        const room = await db.selectFrom('chat_rooms')
            .where('id', '=', roomId)
            .select([
                'id',
                'name',
                'description',
                'image',
                'type',
                'community_id',
                'created_by',
                'created_at',
                'updated_at',
                eb => eb.selectFrom('chat_room_members')
                    .whereRef('chat_room_members.room_id', '=', 'chat_rooms.id')
                    .select(eb => eb.fn.count('user_id').as('count'))
                    .as('memberCount')
            ])
            .executeTakeFirst();
            
        return room || null;
    } catch (error) {
        console.error('Error fetching chat room:', error);
        return null;
    }
}