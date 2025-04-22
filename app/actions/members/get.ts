'use server';
import { db } from '@/db';

export interface GetMembersOptions {
    limit?: number;
    offset?: number;
    search?: string;
}
export interface MembersResult {
    id: string;
    role: "member" | "moderator" | "admin";
    joined_at: Date;
    name: string | null;
    image: string | null | undefined;
    approverName: string | null;
}
export interface GetMembersResult {
    members: MembersResult[];
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
}
export async function getCommunityMembers(communityId: string,options: GetMembersOptions = {}) : Promise<GetMembersResult> {
    const page = Math.max(options.offset ?? 1, 1);
    const limit = options.limit ?? 10;
    const offset = (page - 1) * limit;
    const search = options.search ?? null;
    
    try {
        let countQuery = db.selectFrom('members').where('communityId', '=', communityId);
        let query = db.selectFrom('members')
        .leftJoin('user', 'user.id', 'members.user_Id')
        .leftJoin('user as approver', 'approver.id', 'members.approved_by')
        .select([
            'members.id',
            'user.name',
            'user.image',
            'members.role',
            'members.joined_at',
            'approver.name as approverName',
        ]);
        
        // Apply search filter to both queries
        if (search) {
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
        const members = await query.execute();
        const totalPages = Math.ceil(members.length / limit); // Calculate total pages

        return {
            members,
            totalCount,
            hasMore: offset + members.length < totalCount,
            totalPages
        };
    } catch (error) {
        console.error('Error fetching members:', error);
        throw new Error('Failed to fetch members');
    }
}