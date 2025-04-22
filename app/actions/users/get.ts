'use server';
import { db } from "@/db";
import { User } from "@/db/types";

export interface GetCommunitiesOptions {
    limit?: number;
    offset?: number;
    search ?: string;
}

export interface GetCommunitiesResult {
    users: User[];
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
}

export async function getUsers(options: GetCommunitiesOptions = {}) : Promise<GetCommunitiesResult>  {
    const page = Math.max(options.offset ?? 1, 1);
    const limit = options.limit ?? 10;
    const offset = (page - 1) * limit;
    const search = options.search ?? null;
    
    try {
      // Create base query with filters
      let countQuery = db.selectFrom('user');
      let baseQuery = db.selectFrom('user')
      .where('user.role','!=','owner')

      
      // Check if search term is provided and filter accordingly
      if (search) {
        baseQuery = baseQuery.where(eb => 
            eb.or([
                eb('user.name' , 'ilike' , `%${search}%`),
                eb('user.email' , 'ilike' , `%${search}%`),
            ])
        );
      }
      
      const countResult = await countQuery
        .select(eb => eb.fn.count<number>('id').as('count'))
        .executeTakeFirst();
      
        const totalCount = Number(countResult?.count ?? 0);
      
      // Apply pagination to the main query
      const users = await baseQuery
        .limit(limit)
        .offset(offset)
        .selectAll()
        .execute();
      const totalPages = Math.ceil(users.length / limit); // Calculate total pages

      return {
        users,
        totalCount,
        hasMore: offset + users.length < totalCount,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw error;
    }
}
  