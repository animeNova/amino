'use server';

import { db } from "@/db";
import { canUpdateJoinRequestStatus } from "@/utils/permissions";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";

export const updateJoinRequestSchema = z.object({
    status: z.enum(['accepted', 'rejected'] , {
        message : 'Status must be either accepted or rejected'
    }),
})

export const UpdateJoinRequest =async (requestId : string,data : z.infer<typeof updateJoinRequestSchema>) => {
    try {
        const userId = await getUserId();
        const hasPermission = await canUpdateJoinRequestStatus(userId,requestId);
        if (!hasPermission) {
            throw new Error("You don't have permission to update a join request.");
        }
        const parsedData = updateJoinRequestSchema.parse(data);
        const joinRequest = await db.updateTable('join_requests')
        .where('id', '=', requestId)
        .set({
            status: parsedData.status,
            responded_by : userId,
        }).returningAll().executeTakeFirst();
        if(joinRequest && joinRequest.status === 'accepted'){
            await db.insertInto('members').values({
                communityId : joinRequest.community_id,
                user_Id: joinRequest.user_id,
                approved_by : userId,
                role : 'member',
            }).executeTakeFirst();  
            await db.deleteFrom('join_requests').where('id', '=', requestId).executeTakeFirst();
        }
        return joinRequest
    } catch (error) {
        console.error('Error updating join request:', error);
        throw new Error('Failed to update join request');
    }
}