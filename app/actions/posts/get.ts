'use server';

import { db } from "@/db";
import { getUserIdSafe } from "../helpers/get-userId";

export interface GetPostsOptions {
    limit?: number;
    offset?: number;
    search?: string;
    tag ?: string;
    orderBy ?: 'desc' | 'asc';
}

export interface PostQuery {
  post_id:string;
  post_title:string;
  post_content:string;
  post_image:string;
  post_tags:string[];
  post_user_id:string;
  post_community_id:string;
  post_status: 'accepted' | 'pending' | 'rejected';
  post_created_at : Date;
  community_name : string;
  community_image: string;
  communityHandle : string;
  userLevel : number | null;
  user_name : string;
  user_image : string | undefined;
  likeCount : number | null;
  isLiked: string | null;  // Type for the post_id returned from the subquery, null if not liked
  commentCount : number | null;
  memberRole : 'member' | 'admin' | 'moderator' | null;
}

export interface GetPostsResult {
    posts: PostQuery[];
    totalCount: number;
    hasMore: boolean;
}

export const getPostsByCommunity = async (communityId : string,options: GetPostsOptions = {}) : Promise<GetPostsResult> => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    const search = options.search ?? null;
    const tag = options.tag ?? null;
    const orderBy = options.orderBy?? 'desc';
    const userId = await getUserIdSafe();
    try {
        // First, get distinct post IDs with pagination
        const postIds = await db
            .selectFrom('posts as p')
            .where('p.status', '=', 'accepted')
            .where('p.community_id', '=', communityId)
            .select('p.id')
            .orderBy('p.created_at', orderBy || 'desc')
            .limit(limit)
            .offset(offset)
            .execute();

        // If no posts found, return early
        if (postIds.length === 0) {
            return {
                posts: [],
                totalCount: 0,
                hasMore: false
            };
        }

        // Then get the full post data for these IDs
        let baseQuery = db
            .selectFrom('posts as p')
            .where('p.status', '=', 'accepted')
            .where('p.id', 'in', postIds.map(p => p.id))
            .innerJoin('community', 'p.community_id', 'community.id')
            .innerJoin('user', 'p.user_id', 'user.id')
            .leftJoin('user_levels as ul', 'user.id', 'ul.user_id')
            .leftJoin('members', join => 
                join.onRef('user.id', '=', 'members.user_Id')
                    .onRef('p.community_id', '=', 'members.communityId')
            )
            .select([
        // post fields
        'p.id as post_id',
        'p.title as post_title',
        'p.content as post_content',
        'p.image as post_image',
        'p.tags as post_tags',
        'p.user_id as post_user_id',
        'p.community_id as post_community_id',
        'p.status as post_status',
        'p.created_at as post_created_at',

        // member role
        'members.role as memberRole',

        // community fields
        'community.id as community_id',
        'community.name as community_name',
        'community.image as community_image',
        'community.handle as communityHandle',

        // User level fields
        'ul.level as userLevel',

        // user fields
        'user.id as user_id',
        'user.name as user_name',
        'user.image as user_image',
        eb => eb.selectFrom('post_likes as pl')
        .whereRef('pl.post_id', '=', 'p.id')
        .where('pl.user_id', '=', userId)  // userId from getUserId()
        .select('pl.post_id')
        .limit(1)
        .as('isLiked'),
        eb => eb.selectFrom('post_likes as pl')
        .whereRef('pl.post_id', '=', 'p.id')
        .select(eb => eb.fn.count<number>('pl.user_id').as('count'))
        .as('likeCount'),
        eb => eb.selectFrom('comments as c')
        .whereRef('c.post_id', '=', 'p.id')
        .select(eb => eb.fn.count<number>('c.id').as('count'))
        .as('commentCount')
        ])

        if(search){
          baseQuery = baseQuery.where('p.title', 'like', `%${search}%`)
        }
        if(tag){
          baseQuery = baseQuery.where('p.tags', '@>', [tag])
        }
        if(orderBy){
          baseQuery = baseQuery.orderBy('p.created_at', orderBy);
        }
        // Create a separate count query
        const countQuery = db
          .selectFrom('posts as p')
          .where('p.status', '=', 'accepted')
          .where('p.community_id', '=', communityId);
          
        if(search){
          countQuery.where('p.title', 'like', `%${search}%`);
        }
        
        if(tag){
          countQuery.where('p.tags', '@>', [tag]);
        }
        
        const countResult = await countQuery
          .select(eb => eb.fn.count<number>('p.id').as('count'))
          .executeTakeFirst();
       
        const totalCount = Number(countResult?.count ?? 0);
      
        // Apply pagination to the main query
        const posts = await baseQuery
          .limit(limit)
          .offset(offset)
          .execute();
          
        return {
            posts : posts,
            totalCount,
            hasMore: offset + posts.length < totalCount
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error('Failed to fetch posts');
    }
}

export async function getPostById(id: string) {
    try {
      const userId = await getUserIdSafe();
      
      const post = await db
      .selectFrom('posts as p')
      .where('p.status', '=', 'accepted')
      .innerJoin('community', 'p.community_id', 'community.id')
      .innerJoin('user', 'p.user_id', 'user.id')
      .leftJoin('user_levels as ul', 'user.id', 'ul.user_id')
      .leftJoin('members', join => 
        join.onRef('user.id', '=', 'members.user_Id')
            .onRef('p.community_id', '=', 'members.communityId')
      )
      .select([
      // post fields
      'p.id as post_id',
      'p.title as post_title',
      'p.content as post_content',
      'p.image as post_image',
      'p.tags as post_tags',
      'p.user_id as post_user_id',
      'p.community_id as post_community_id',
      'p.status as post_status',
      'p.created_at as post_created_at',

      // member role
      'members.role as memberRole',

      // community fields
      'community.id as community_id',
      'community.name as community_name',
      'community.image as community_image',
      'community.handle as communityHandle',

      // User level fields
      'ul.level as userLevel',

      // user fields
      'user.id as user_id',
      'user.name as user_name',
      'user.image as user_image',
      eb => eb.selectFrom('post_likes as pl')
      .whereRef('pl.post_id', '=', 'p.id')
      .where('pl.user_id', '=', userId)  // userId from getUserId()
      .select('pl.post_id')
      .limit(1)
      .as('isLiked'),
      eb => eb.selectFrom('post_likes as pl')
      .whereRef('pl.post_id', '=', 'p.id')
      .select(eb => eb.fn.count<number>('pl.user_id').as('count'))
      .as('likeCount'),
      // Add comment count
      eb => eb.selectFrom('comments as c')
      .whereRef('c.post_id', '=', 'p.id')
      .select(eb => eb.fn.count<number>('c.id').as('count'))
      .as('commentCount')
    ]).executeTakeFirst();
      
      return post || null;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw new Error('Failed to fetch post');
    }
}



export const getPostsByUser = async (targetUserId: string, options: GetPostsOptions = {}): Promise<GetPostsResult> => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    const search = options.search ?? null;
    const tag = options.tag ?? null;
    const orderBy = options.orderBy ?? 'desc';
    const currentUserId = await getUserIdSafe(); // For checking 'isLiked' status

    try {
        let baseQuery = db
            .selectFrom('posts as p')
            .where('p.status', '=', 'accepted')
            .where('p.user_id', '=', targetUserId) // Filter by the target user's ID
            .innerJoin('community', 'p.community_id', 'community.id')
            .innerJoin('user', 'p.user_id', 'user.id') // This join is on the post author (targetUserId)
            .leftJoin('user_levels as ul', 'user.id', 'ul.user_id')
            .leftJoin('members', join =>
              join.onRef('user.id', '=', 'members.user_Id') // Member role of the post author in the post's community
                  .onRef('p.community_id', '=', 'members.communityId')
            )
            .select([
                // post fields
                'p.id as post_id',
                'p.title as post_title',
                'p.content as post_content',
                'p.image as post_image',
                'p.tags as post_tags',
                'p.user_id as post_user_id',
                'p.community_id as post_community_id',
                'p.status as post_status',
                'p.created_at as post_created_at',

                // community fields
                'community.id as community_id', // Alias to avoid conflict if needed elsewhere
                'community.name as community_name',
                'community.image as community_image',
                'community.handle as communityHandle',

                // member role of the post author
                'members.role as memberRole',

                // User level fields of the post author
                'ul.level as userLevel',

                // user fields of the post author
                'user.id as user_id', // Alias to avoid conflict
                'user.name as user_name',
                'user.image as user_image',

                // Like status (for the current logged-in user) and total like count
                eb => eb.selectFrom('post_likes as pl_isLiked')
                    .whereRef('pl_isLiked.post_id', '=', 'p.id')
                    .where('pl_isLiked.user_id', '=', currentUserId) // Use current logged-in user's ID
                    .select('pl_isLiked.post_id') // Select any column to check existence
                    .limit(1)
                    .as('isLiked'),
                eb => eb.selectFrom('post_likes as pl_count')
                    .whereRef('pl_count.post_id', '=', 'p.id')
                    .select(eb => eb.fn.count<number>('pl_count.user_id').as('count'))
                    .as('likeCount'),

                // Comment count
                eb => eb.selectFrom('comments as c')
                    .whereRef('c.post_id', '=', 'p.id')
                    .select(eb => eb.fn.count<number>('c.id').as('count'))
                    .as('commentCount')
            ]);

        if (search) {
            baseQuery = baseQuery.where('p.title', 'like', `%${search}%`);
        }
        if (tag) {
            // Assuming 'tags' is an array column. Use appropriate operator for your DB.
            // For PostgreSQL array:
            baseQuery = baseQuery.where('p.tags', '@>', [tag]);
            // For other DBs, you might need `like` on a stringified version or a separate tags table.
        }
        if (orderBy) {
            baseQuery = baseQuery.orderBy('p.created_at', orderBy);
        }

        // Create a separate count query
        let countQuery = db
            .selectFrom('posts as p')
            .where('p.status', '=', 'accepted')
            .where('p.user_id', '=', targetUserId); // Filter by the target user's ID

        if (search) {
            countQuery = countQuery.where('p.title', 'like', `%${search}%`);
        }
        if (tag) {
            countQuery = countQuery.where('p.tags', '@>', [tag]);
        }

        const countResult = await countQuery
            .select(eb => eb.fn.count<number>('p.id').as('count'))
            .executeTakeFirst();

        const totalCount = Number(countResult?.count ?? 0);

        // Apply pagination to the main query
        const posts = await baseQuery
            .limit(limit)
            .offset(offset)
            .execute();

        return {
            posts,
            totalCount,
            hasMore: offset + posts.length < totalCount
        };
    } catch (error) {
        console.error(`Error fetching posts for user ${targetUserId}:`, error);
        throw new Error('Failed to fetch user posts');
    }
}





  