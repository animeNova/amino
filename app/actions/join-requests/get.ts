'use server';

import { db } from "@/db";
import {canGetJoinRequests} from '@/utils/permissions'
import { getUserId } from "../helpers/get-userId";
export interface GetJoinRequestsOptions {
    limit?: number;
    offset?: number;
    search ?: string;
}
export interface JoinRequestResult {
    id: string;
    status: "pending" | "accepted" | "rejected";
    requested_at: Date;
    name: string | null;
    image: string | null | undefined;
}

export interface GetJoinRequestsResult {
    join_requests: JoinRequestResult[];
    totalCount: number;
    hasMore: boolean;
    totalPages : number;
}


export const getJoinRequests = async (communityId: string, options: GetJoinRequestsOptions = {}): Promise<GetJoinRequestsResult> => {
    const page = Math.max(options.offset ?? 1, 1);
    const limit = options.limit ?? 10;
    const offset = (page - 1) * limit;
    const search = options.search ?? null;
    try {
        const userId = await getUserId();
        const hasPermission = await canGetJoinRequests(userId, communityId);
        if (!hasPermission) {
            throw new Error('You do not have permission to get join requests');
        }
        let countQuery = db.selectFrom('join_requests').where('community_id', '=', communityId);
        let query = db.selectFrom('join_requests').where('community_id', '=', communityId)
        .leftJoin('user', 'join_requests.user_id', 'user.id')
        .select([
            'join_requests.id',
            'join_requests.status',
            'user.name as name' ,
            'user.image as image',
            'join_requests.requested_at'
        ])

        if(search){
            query = query.where('user.name', 'ilike', `%${search}%`);
         }
        const countResult = await countQuery
        .select(eb => eb.fn.count<number>('id').as('count'))
        .executeTakeFirst();
      
      const totalCount = Number(countResult?.count ?? 0);
      query = query
      .limit(limit)
      .offset(offset);
    
    // Execute the main query
    const joinRequests = await query.execute();
    const totalPages = Math.ceil(joinRequests.length / limit); // Calculate total pages

    return {
        join_requests: joinRequests,
        totalCount,
        hasMore: offset + joinRequests.length < totalCount,
        totalPages
      };
    } catch (error) {
        console.error('Error fetching join requests:', error);
        throw new Error('Failed to fetch join requests');
    }
}

export const getJoinRequestById = async (requestId: string) : Promise<JoinRequestResult | null> => {
    try {
        const joinRequest = await db
            .selectFrom('join_requests')
            .where('id', '=', requestId)
            .leftJoin('user', 'join_requests.user_id', 'user.id')
            .select([
                'join_requests.id',
                'join_requests.status',
                'user.name as name' ,
                'user.image as image',
                'join_requests.requested_at'
            ])
            .executeTakeFirstOrThrow();
        return joinRequest;
    } catch (error) {
        console.error('Error fetching join request:', error);
        throw new Error('Failed to fetch join request');
    }
}

/**
 * Check if the current user has already sent a join request to a specific community
 * @param communityId The ID of the community to check
 * @returns Boolean indicating if a pending request exists
 */
export const hasUserRequestedToJoin = async (communityId: string): Promise<boolean> => {
    try {
        const userId = await getUserId();
        
        if (!userId) {
            return false;
        }
        
        const joinRequest = await db
            .selectFrom('join_requests')
            .where('user_id', '=', userId)
            .where('community_id', '=', communityId)
            .where('status', '=', 'pending')
            .select('id')
            .executeTakeFirst();
            
        return !!joinRequest;
    } catch (error) {
        console.error('Error checking join request status:', error);
        return false; // Return false on error to prevent blocking UI
    }
}

export const getJoinRequestByUserId = async (): Promise<JoinRequestResult[] | null>   => {
    try {
        const userId = await getUserId();

        const joinRequest = await db
            .selectFrom('join_requests')
            .where('user_id', '=', userId)
            .where('status', '=', 'pending')
            .leftJoin('user', 'join_requests.user_id', 'user.id')
            .select([
                'join_requests.id',
                'join_requests.status',
                'user.name as name' ,
                'user.image as image',
                'join_requests.requested_at'
            ])
            .selectAll()
            .execute();
        return joinRequest || null;
    } catch (error) {
        console.error('Error fetching join request:', error);
        throw new Error('Failed to fetch join request');
    }
}