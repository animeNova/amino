'use server';
import { db } from "@/db";
import { getUserIdSafe } from "../helpers/get-userId";

export interface GetCommunitiesOptions {
    limit?: number;
    offset?: number;
    search ?: string;
}

export interface JoinedCommunityInfo {
    id: string;
    name: string;
    handle: string;
    image: string | null;
    role: 'member' | 'moderator' | 'admin'; // Role in that specific community
}

export interface User {
    bio?: string;
    id: string;
    name: string;
    image?: string | null;
    createdAt: Date;
    coverImage?: string | null;
    location?: string;
    website?: string;
    followerCount?: number;
    followingCount?: number;
    postsCount?: number;
    likesCount?: number;
    joinedCommunities?: JoinedCommunityInfo[]; // Add this
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

export async function getUserById(id: string): Promise<User> {
    try {
        const userPromise = db
            .selectFrom('user')
            .where('user.id', '=', id)
            .select([
              'user.bio',
              'user.id',
              'user.name',
              'user.image',
              'user.createdAt',
              'user.coverImage',
              'user.location',
              'user.website',
              (eb) => eb.selectFrom('followers as f_followers')
                .whereRef('f_followers.following_id', '=', 'user.id')
                .select(eb => eb.fn.count<number>('f_followers.follower_id').as('count'))
                .as('followerCount'),
              (eb) => eb.selectFrom('followers as f_following')
                .whereRef('f_following.follower_id', '=', 'user.id')
                .select(eb => eb.fn.count<number>('f_following.following_id').as('count'))
                .as('followingCount'),
              (eb) => eb.selectFrom('posts as p')
                .whereRef('p.user_id', '=', 'user.id')
                .where('p.status', '=', 'accepted') // Only count accepted posts
                .select(eb => eb.fn.count<number>('p.id').as('count'))
                .as('postsCount'),
              (eb) => eb.selectFrom('post_likes as pl')
                .innerJoin('posts as p_likes', 'p_likes.id', 'pl.post_id')
                .whereRef('p_likes.user_id', '=', 'user.id') // Likes received on user's posts
                .select(eb => eb.fn.count<number>('pl.user_id').as('count'))
                .as('likesCount'),
            ])
            .executeTakeFirst();

        const joinedCommunitiesPromise = db
            .selectFrom('members as m')
            .innerJoin('community as c', 'c.id', 'm.communityId')
            .where('m.user_Id', '=', id)
            .select(['c.id', 'c.name', 'c.handle', 'c.image', 'm.role'])
            .orderBy('m.joined_at', 'desc') // Optionally order by join date
            .execute();

        const [userResult, joinedCommunitiesResult] = await Promise.all([
            userPromise,
            joinedCommunitiesPromise
        ]);

        if (!userResult) {
            throw new Error(`User with ID ${id} not found.`);
        }

        return {
            ...userResult,
            followerCount: Number(userResult.followerCount ?? 0),
            followingCount: Number(userResult.followingCount ?? 0),
            postsCount : Number(userResult.postsCount ?? 0),
            likesCount : Number(userResult.likesCount ?? 0),
            joinedCommunities: joinedCommunitiesResult.map(jc => ({
                id: jc.id,
                name: jc.name,
                handle: jc.handle,
                image: jc.image,
                role: jc.role // Cast role
            })),
        };
    } catch (error) {
        console.error(`Error fetching user by ID ${id}:`, error);
        // Re-throw the error or handle it as appropriate for your application
        // If you throw, the calling code will need to catch it.
        // If you want to return null for not found, change Promise<User> to Promise<User | null>
        if (error instanceof Error && error.message.includes('not found')) {
            throw error; // Re-throw specific "not found" error
        }
        throw new Error(`Failed to fetch user with ID ${id}.`);
    }
}

export async function isUserNew() : Promise<boolean> {
  const currentUser = await getUserIdSafe();
  if(!currentUser) return false;
  const user = await db.selectFrom('user').where('user.id','=',currentUser).select(['user.is_new']).executeTakeFirst();
  if(!user?.is_new) return false;
  return true;
}
  