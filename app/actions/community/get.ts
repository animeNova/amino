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
  genre_id: string | null;
  memberCount: number | string | bigint;
  created_at: Date | null;
}

export interface GetCommunitiesResult {
  communities: CommunityResult[];
  totalCount: number;
  hasMore: boolean;
}

export interface GetCommunityByHandlerResult extends Community {
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
    const genreId = options.genreId ?? null;
    const search = options.search ?? null;
    
    try {
      // Create base query with filters
      let countQuery = db.selectFrom('community');
      let baseQuery = db.selectFrom('community')
        .leftJoin('genre', 'genre.id', 'community.genre_id')
        .leftJoin('user', 'community.created_by', 'user.id')
        .select([
          'community.id as id',
          'community.name as name',
          'community.description',
          'community.image',
          'community.language',
          'community.handle',
          'community.banner',
          'community.created_at',
          eb => eb.case()
            .when(eb.ref('user.name'), 'is not', null)
            .then(eb.ref('user.name'))
            .else('Unknown User')
            .end()
            .as('created_by'),
          'genre.name as genre_name',
          'genre.id as genre_id',
          // Use a subquery to count members instead of a join
          eb => eb.selectFrom('members')
            .whereRef('members.communityId', '=', 'community.id')
            .select(eb => eb.fn.count('id').as('count'))
            .as('memberCount')
        ])
        .where('community.id', 'is not', null)  // Ensure no null IDs
        .where('community.name', 'is not', null)  // Ensure no null names
        .where('community.created_by', 'is not', null)  // Specify the table name to avoid ambiguity
      
      // Check if search term is provided and filter accordingly
      if (search) {
        baseQuery = baseQuery.where(eb => 
            eb.or([
                eb('community.name' , 'ilike' , `%${search}%`),
                eb('community.description' , 'ilike' , `%${search}%`),
            ])
        );
      }

      if(genreId){
        baseQuery = baseQuery.where('genre.id', '=', genreId);
      }
      
      const countResult = await countQuery
        .select(eb => eb.fn.count<number>('id').as('count'))
        .executeTakeFirst();
      
        const totalCount = Number(countResult?.count ?? 0);
      
      // Apply pagination to the main query
      const communities = await baseQuery
        .limit(limit)
        .offset(offset)
        .execute();
      const totalPages = Math.ceil(communities.length / limit); // Calculate total pages

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
  

export async function getCommunityById(id: string): Promise<Community> {
    try {
      const community = await db
        .selectFrom('community')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();
      if(!community){
        throw new Error('Community not found');
      }
      return community;
    } catch (error) {
      console.error(`Error fetching community ${id}:`, error);
      throw new Error('Failed to fetch community');
    }
}

export async function getCommunityByHandle(handle: string): Promise<GetCommunityByHandlerResult> {
  try {
    const community = await db
      .selectFrom('community')
      .where('handle', '=', handle)
      .selectAll()
      .executeTakeFirst();

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
    // Ensure your Community type definition can accommodate this 'members' property.
    return {
      ...community,
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