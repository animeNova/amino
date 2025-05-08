'use server';

import { db } from "@/db";
import { canRequestJoin } from "@/utils/permissions";
import { getUserId } from "../helpers/get-userId";

export const CreateJoinRequest = async (communityId: string) => {
    try {
        const userId = await getUserId();
        const hasPermission = await canRequestJoin(userId, communityId);
        if (!hasPermission) {
            throw new Error("You don't have permission to join this community.");
        }

        // Check if the community is public
        const community = await db
            .selectFrom('community')
            .where('id', '=', communityId)
            .select(['visibility'])
            .executeTakeFirst();

        if (community?.visibility === 'public') {
            // For public communities, add user directly as a member
            const member = await db
                .insertInto('members')
                .values({
                    communityId: communityId,
                    user_Id: userId,
                    role: 'member'
                })
                .returningAll()
                .executeTakeFirst();
            
            return { 
                type: 'direct_join',
                data: member 
            };
        } else {
            // For private communities, create a join request
            const joinRequest = await db
                .insertInto('join_requests')
                .values({
                    community_id: communityId,
                    user_id: userId,
                    status: 'pending',
                })
                .returningAll()
                .executeTakeFirst();
            
            return { 
                type: 'join_request',
                data: joinRequest 
            };
        }
    } catch (error) {
        console.error('Error creating join request:', error);
        throw new Error('Failed to join community');
    }
}