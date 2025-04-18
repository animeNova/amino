'use server';

import { db } from "@/db";
import { JoinRequest } from "@/db/types";
import {canGetJoinRequests} from '@/utils/permissions'
import { getUserId } from "../helpers/get-userId";
export interface GetJoinRequestsOptions {
    limit?: number;
    offset?: number;
}

export interface GetJoinRequestsResult {
    join_requests: JoinRequest[];
    totalCount: number;
    hasMore: boolean;
}


export const getJoinRequests = async (communityId: string, options: GetJoinRequestsOptions = {}): Promise<GetJoinRequestsResult> => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    try {
        const userId = await getUserId();
        const hasPermission = await canGetJoinRequests(userId, communityId);
        if (!hasPermission) {
            throw new Error('You do not have permission to get join requests');
        }
        let countQuery = db.selectFrom('join_requests').where('community_id', '=', communityId);
        let query = db.selectFrom('join_requests').where('community_id', '=', communityId);
        const countResult = await countQuery
        .select(eb => eb.fn.count<number>('id').as('count'))
        .executeTakeFirst();
      
      const totalCount = Number(countResult?.count ?? 0);
      query = query
      .limit(limit)
      .offset(offset);
    
    // Execute the main query
    const joinRequests = await query.selectAll().execute();
    return {
        join_requests: joinRequests,
        totalCount,
        hasMore: offset + joinRequests.length < totalCount,
        
      };
    } catch (error) {
        console.error('Error fetching join requests:', error);
        throw new Error('Failed to fetch join requests');
    }
}

export const getJoinRequestById = async (requestId: string) : Promise<JoinRequest | null> => {
    try {
        const joinRequest = await db
            .selectFrom('join_requests')
            .where('id', '=', requestId)
            .selectAll()
            .executeTakeFirstOrThrow();
        return joinRequest;
    } catch (error) {
        console.error('Error fetching join request:', error);
        throw new Error('Failed to fetch join request');
    }
}

export const getJoinRequestByUserId = async (): Promise<JoinRequest[] | null>   => {
    try {
        const userId = await getUserId();

        const joinRequest = await db
            .selectFrom('join_requests')
            .where('user_id', '=', userId)
            .where('status', '=', 'pending')
            .selectAll()
            .execute();
        return joinRequest || null;
    } catch (error) {
        console.error('Error fetching join request:', error);
        throw new Error('Failed to fetch join request');
    }
}