'use server';

import { db } from "@/db";
import { Community } from "@/db/types";

export interface GetCommunitiesOptions {
    limit?: number;
    offset?: number;
    genreId ?: string;
    search ?: string;
}

export interface GetCommunitiesResult {
    communities: Community[];
    totalCount: number;
    hasMore: boolean;
}

export const getCommunitys = async (options: GetCommunitiesOptions = {}) => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    const genreId = options.genreId ?? null;
    const search = options.search ?? null;
    
    try {
      // Create base query with filters
      let baseQuery = db.selectFrom('community');
      
      // Check if genreId is provided and filter accordingly
      if (genreId) {
        baseQuery = baseQuery.where('genre_id', '=', genreId);
      }
      
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
        .select(eb => eb.fn.count<number>('id').as('count'))
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
  };

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
  