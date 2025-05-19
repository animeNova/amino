'use server';

import { db } from "@/db";
import { getUserId } from "../helpers/get-userId";
import { canCancelJoinRequest } from "@/utils/permissions";


export const DeleteJoinRequestAction =async (joinRequestId : string) => {
    try {
        const userId = await getUserId();
        const hasPermission = await canCancelJoinRequest(userId, joinRequestId);
        if (!hasPermission) {
            throw new Error('You are not authorized to delete this join request'); 
        }
        const joinRequest = await db.deleteFrom('join_requests')
        .where('user_id' , '=' , userId)
        .where('id' , '=' , joinRequestId)
        .where('status' , '=' , 'pending')
        .executeTakeFirst();
        return joinRequest;
    } catch (error) {
        console.error('Error deleting join request:', error);
        throw new Error('Failed to delete join request');
    }
}