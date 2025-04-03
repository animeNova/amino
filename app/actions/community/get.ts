'use server';

import { db } from "@/db";
import { Community } from "@/db/types";

export interface GetCommunitiesOptions {
    limit?: number;
    offset?: number;
}

export interface GetCommunitiesResult {
    communities: Community[];
    totalCount: number;
    hasMore: boolean;
}

export const getCommunitys = async (options: GetCommunitiesOptions = {}) => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    try {
        let countQuery = db.selectFrom('community');
        let query = db.selectFrom('community');
        const countResult = await countQuery
        .select(eb => eb.fn.count<number>('id').as('count'))
        .executeTakeFirst();
      
      const totalCount = Number(countResult?.count ?? 0);
      query = query
      .limit(limit)
      .offset(offset);
    
    // Execute the main query
    const communities = await query.selectAll().execute();
    return {
        communities,
        totalCount,
        hasMore: offset + communities.length < totalCount
      };
    } catch (error) {
        console.error('Error fetching communities:', error);
        throw new Error('Failed to fetch communities');
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
  