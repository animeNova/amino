'use server';

import { db } from "@/db";
import { canRequestJoin } from "@/utils/permissions";
import { getUserId } from "../helpers/get-userId";

export const CreateJoinRequest =async (communityId : string) => {
    try {
        const userId = await getUserId();
        const hasPermission = await canRequestJoin(userId,communityId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const joinRequest = await db.insertInto('join_requests').values({
            community_id : communityId,
            user_id: userId,
            status: 'pending',
        }).returningAll().executeTakeFirst();

        return joinRequest
    } catch (error) {
        console.error('Error create join request:', error);
        throw new Error('Failed to create join request');
    }
}