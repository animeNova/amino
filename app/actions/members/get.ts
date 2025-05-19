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
    communityId : string;
}
export interface GetMembersResult {
    members: MembersResult[];
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
}
export interface ModeratorResult {
    memberId: string;
    role: "moderator" | "admin";
    userId : string;
    joined_at: Date;
    name: string | null;
    image: string | null | undefined;
    communityId: string;
    communityName: string;
    communityImage: string | null;
}

export interface GetModeratorsResult {
    moderators: ModeratorResult[];
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
        .where('communityId', '=', communityId)
        .leftJoin('user', 'user.id', 'members.user_Id')
        .leftJoin('user as approver', 'approver.id', 'members.approved_by')
        .select([
            'members.id',
            'user.name',
            'user.image',
            'members.role',
            'members.joined_at',
            'approver.name as approverName',
            'members.communityId'
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
        const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

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




export async function getAllModerators(options: GetMembersOptions = {}): Promise<GetModeratorsResult> {
    const page = Math.max(options.offset ?? 1, 1);
    const limit = options.limit ?? 10;
    const offset = (page - 1) * limit;
    const search = options.search ?? null;
    
    try {
        // Count query for moderators and admins across all communities
        let countQuery = db.selectFrom('members')
            .where('role', 'in', ['moderator', 'admin']);
            
        // Main query to get moderators with user and community info
        let query = db.selectFrom('members')
            .where('members.role', 'in', ['moderator', 'admin'])
            .leftJoin('user', 'user.id', 'members.user_Id')
            .leftJoin('community', 'community.id', 'members.communityId')
            .select([
                'members.id as memberId',
                'user.id as userId',
                'user.name',
                'user.image',
                'members.role',
                'members.joined_at',
                'members.communityId',
                'community.name as communityName',
                'community.image as communityImage'
            ]);
        
        // Apply search filter to both queries if provided
        if (search) {
            query = query.where(eb => 
                eb.or([
                    eb('user.name', 'ilike', `%${search}%`),
                    eb('community.name', 'ilike', `%${search}%`)
                ])
            );
        }
        
        // Get total count
        const countResult = await countQuery
            .select(eb => eb.fn.count<number>('id').as('count'))
            .executeTakeFirst();
      
        const totalCount = Number(countResult?.count ?? 0);
        
        // Apply pagination
        query = query
            .orderBy('community.name')
            .orderBy('user.name')
            .limit(limit)
            .offset(offset);
    
        // Execute the main query
        const moderators = await query.execute() as ModeratorResult[];
        const totalPages = Math.ceil(totalCount / limit);

        return {
            moderators ,
            totalCount,
            hasMore: offset + moderators.length < totalCount,
            totalPages
        };
    } catch (error) {
        console.error('Error fetching moderators:', error);
        throw new Error('Failed to fetch moderators');
    }
}