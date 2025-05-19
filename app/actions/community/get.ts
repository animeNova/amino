"use server"
import { db } from "@/db";
import { createCommunityBaseQuery } from "../helpers/community-helper";

export interface GetCommunitiesOptions {
  limit?: number;
  offset?: number;
  genres?: string[];
  search?: string;
  activities?: ("very-active" | "active" | "moderate" | "low")[];
  sizes?: ("small" | "medium" | "large" | "xlarge")[];
}
export interface CommunityResult {
  id: string;
  name: string;
  description: string;
  image: string;
  language: string;
  handle: string;
  banner: string;
  created_by: string | null;
  genre_name: string | null;
  genre_id: string;
  visibility: "public" | "private";
  memberCount: string | number | bigint;
  created_at: Date | null;
}

export interface GetCommunitiesResult {
  communities: CommunityResult[];
  totalCount: number;
  hasMore: boolean;
}

export interface GetCommunityByHandlerResult extends CommunityResult {
  staff :{
    memberId : string,      // ID of the member record
    role : string,                // Role of the member in the community
    userId : string,   // ID of the user
    userName:string;      // Name of the user
    userImage?:string;
  }[]
}



export async function getCommunitys(options: GetCommunitiesOptions = {})  {
    const page = Math.max(options.offset ?? 1, 1);
    const limit = options.limit ?? 10;
    const offset = (page - 1) * limit;
    const genres = options.genres ?? [];
    const search = options.search ?? null;
    const activities = options.activities ?? [];
    const sizes = options.sizes ?? [];
    
    try {
      // Create base query with filters
      let countQuery = db.selectFrom('community')
        .leftJoin('genre', 'genre.id', 'community.genre_id');
      let baseQuery = createCommunityBaseQuery();
      
      // Check if search term is provided and filter accordingly
      if (search) {
        baseQuery = baseQuery.where(eb => 
            eb.or([
                eb('community.name', 'ilike', `%${search}%`),
                eb('community.description', 'ilike', `%${search}%`),
            ])
        );
        
        // Apply the same filter to count query
        countQuery = countQuery.where(eb => 
            eb.or([
                eb('community.name', 'ilike', `%${search}%`),
                eb('community.description', 'ilike', `%${search}%`),
            ])
        );
      }

      if(genres && genres.length > 0){
        baseQuery = baseQuery.where(eb => 
          eb('genre.name', 'in', genres)
        );
        
        // Apply the same filter to count query
        countQuery = countQuery.where(eb => 
          eb('genre.name', 'in', genres)
        );
      }
      
      // Apply activity level filters - using a subquery for post count if needed
      if (activities && activities.length > 0) {
        baseQuery = baseQuery.where(eb => {
          const conditions: any[] = [];
          
          // Assuming you have a posts table with a communityId column
          // You may need to adjust this based on your actual schema
          if (activities.includes('very-active')) {
            conditions.push(eb.exists(
              eb.selectFrom('posts')
                .select('posts.community_id')
                .where('posts.community_id', '=', eb.ref('community.id'))
                .groupBy('posts.community_id')
                .having(eb => eb.fn.count('posts.id'), '>=', 100)
            ));
          }
          
          if (activities.includes('active')) {
            conditions.push(eb.exists(
              eb.selectFrom('posts')
                .select('posts.community_id')
                .where('posts.community_id', '=', eb.ref('community.id'))
                .groupBy('posts.community_id')
                .having(eb => 
                  eb.and([
                    eb(eb.fn.count('posts.id'), '>=', 50),
                    eb(eb.fn.count('posts.id'), '<', 100)
                  ])
                )
            ));
          }
          
          if (activities.includes('moderate')) {
            conditions.push(eb.exists(
              eb.selectFrom('posts')
                .select('posts.community_id')
                .where('posts.community_id', '=', eb.ref('community.id'))
                .groupBy('posts.community_id')
                .having(eb => 
                  eb.and([
                    eb(eb.fn.count('posts.community_id'), '>=', 10),
                    eb(eb.fn.count('posts.community_id'), '<', 50)
                  ])
                )
            ));
          }
          
          if (activities.includes('low')) {
            conditions.push(eb.exists(
              eb.selectFrom('posts')
                .select('posts.community_id')
                .where('posts.community_id', '=', eb.ref('community.id'))
                .groupBy('posts.community_id')
                .having(eb => eb.fn.count('posts.community_id'), '<', 10)
            ));
          }
          
          return conditions.length > 0 ? eb.or(conditions) : eb.val(true);
        });
        
        // Apply similar logic to count query
        // (Simplified for brevity - you should implement the same logic as above)
      }
      
      // Apply size filters - using the correct column name
      // if (sizes && sizes.length > 0) {
      //   baseQuery = baseQuery.where(eb => {
      //     const conditions = [];
          
      //     if (sizes.includes('small')) {
      //       conditions.push(eb('community.memberCount', '<', 1000));
      //     }
          
      //     if (sizes.includes('medium')) {
      //       conditions.push(
      //         eb.and([
      //           eb('community.memberCount', '>=', 1000),
      //           eb('community.memberCount', '<', 10000)
      //         ])
      //       );
      //     }
          
      //     if (sizes.includes('large')) {
      //       conditions.push(
      //         eb.and([
      //           eb('community.memberCount', '>=', 10000),
      //           eb('community.memberCount', '<', 100000)
      //         ])
      //       );
      //     }
          
      //     if (sizes.includes('xlarge')) {
      //       conditions.push(eb('community.memberCount', '>=', 100000));
      //     }
          
      //     return conditions.length > 0 ? eb.or(conditions) : undefined;
      //   });
     
        
      //   // Apply similar logic to count query
      //   // (Simplified for brevity - you should implement the same logic as above)
      // }
      
      const countResult = await countQuery
        .select(eb => eb.fn.count<number>('community.id').as('count'))
        .executeTakeFirst();
      
      const totalCount = Number(countResult?.count ?? 0);
      
      // Apply pagination to the main query
      const communities = await baseQuery
        .limit(limit)
        .offset(offset)
        .execute();
        
      // Calculate total pages based on total count, not just current page results
      const totalPages = Math.ceil(totalCount / limit);

      return {
        communities,
        totalCount,
        hasMore: offset + communities.length < totalCount,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw error;
    }
}
  



export async function getCommunityByHandle(handle: string): Promise<GetCommunityByHandlerResult> {
  try {
    const community =await createCommunityBaseQuery().where('handle' , '=' , handle).executeTakeFirst()

    if (!community) {
      throw new Error('Community not found');
    }

    // Fetch admin and moderator members for this community
    const members = await db
      .selectFrom('members')
      .innerJoin('user', 'members.user_Id', 'user.id')
      .where('members.communityId', '=', community.id)
      .where((eb) => eb.or([ // Filter for admin or moderator roles
        eb('members.role', '=', 'admin'),
        eb('members.role', '=', 'moderator')
      ]))
      .select([
        'members.id as memberId',      // ID of the member record
        'members.role',                // Role of the member in the community
        'members.user_Id as userId',   // ID of the user
        'user.name as userName',       // Name of the user
        'user.image as userImage'      // Image of the user
      ])
      .execute();

    // Add the fetched members to the community object
    return {
      ...(community as CommunityResult),
      staff: members
    };

  } catch (error) {
    console.error(`Error fetching community ${handle} with members:`, error);
    if (error instanceof Error && error.message === 'Community not found') {
        throw error; // Re-throw specific known errors
    }
    // Provide a more specific error message if fetching members fails or another error occurs
    throw new Error(`Failed to fetch community by handle '${handle}' with its admin/moderator members.`);
  }
}

export async function getCommunityById(id: string): Promise<CommunityResult> {
    try {
      const community = createCommunityBaseQuery()
        .where('community.id', '=', id);  // Add this line to filter by ID
      
      const communityResult = await community.executeTakeFirst();
      
      
      return communityResult as CommunityResult || null;
    } catch (error) {
      console.error(`Error fetching community ${id}:`, error);
      throw new Error('Failed to fetch community');
    }
}
