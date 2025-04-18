"use server"
import { db } from "@/db";
import { Community } from "@/db/types";

export interface GetCommunitiesOptions {
  limit?: number;
  offset?: number;
  genreId ?: string;
  search ?: string;
}
export interface CommunityResult {
  id: string;
  name: string;
  description: string;
  image: string;
  language: string;
  handle: string;
  banner: string;
  created_by: string;
  genre_name: string | null;
  genre_id: string;
  memberCount: number | string | bigint;
  created_at: Date | null;
}

export interface GetCommunitiesResult {
  communities: CommunityResult[];
  totalCount: number;
  hasMore: boolean;
}



export async function getCommunitys(options: GetCommunitiesOptions = {})  {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    const genreId = options.genreId ?? null;
    const search = options.search ?? null;
    
    try {
      // Create base query with filters
      let baseQuery = db.selectFrom('community')
      .leftJoin('members' , 'community.id' , 'members.communityId')
      .leftJoin('genre', 'genre.id', 'community.genre_id')
      .groupBy([
        'community.id',
        'community.name',
        'community.description',
        'community.image',
        'community.language',
        'community.handle',
        'community.banner',
        'genre.name',
        'genre.id',
        'members.id'
      ])
      .select([
        'community.id as id',  // Remove possibility of null
        'community.name as name',  // Remove possibility of null
        'community.description',
        'community.image',
        'community.language',
        'community.handle',
        'community.banner',
        'community.created_by',
        'genre.name as genre_name',
        'genre.id as genre_id',
        eb => eb.fn.count('members.communityId').as('memberCount')
      ])
      .where('community.id', 'is not', null)  // Ensure no null IDs
      .where('community.name', 'is not', null)  // Ensure no null names
      .where('genre_id', '=', genreId);
      
      // Check if search term is provided and filter accordingly
      if (search) {
        baseQuery = baseQuery.where(eb => 
            eb.or([
                eb('name' , 'like' , `%${search}%`),
                eb('description' , 'like' , `%${search}%`),
            ])
        );
      }
      
      // Create count query based on the same conditions
      const countResult = await baseQuery
      .select(eb => eb.fn.count('community.id').as('count'))
      .executeTakeFirst();
      
        
      const totalCount = Number(countResult?.count ?? 0);
      
      // Apply pagination to the main query
      const communities = await baseQuery
        .limit(limit)
        .offset(offset)
        .selectAll()
        .execute();
        
      return {
        communities,
        totalCount,
        hasMore: offset + communities.length < totalCount
      };
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw error;
    }
}
  

export async function getCommunityById(id: string): Promise<Community | null> {
    try {
      const community = await db
        .selectFrom('community')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();
      
      return community || null;
    } catch (error) {
      console.error(`Error fetching community ${id}:`, error);
      throw new Error('Failed to fetch community');
    }
}
  