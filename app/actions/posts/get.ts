'use server';

import { db } from "@/db";

export interface GetPostsOptions {
    limit?: number;
    offset?: number;
    search?: string;
    tag ?: string;
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
    try {
        let baseQuery = db
        .selectFrom('posts as p')
        .where('p.status', '=', 'accepted')
        .where('community_id', '=', communityId)
        .innerJoin('community', 'p.community_id', 'community.id')
        .innerJoin('user', 'p.user_id', 'user.id')
        .leftJoin('user_levels as ul', 'user.id', 'ul.user_id')
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
          .select(eb => eb.fn.count<number>('pl.user_id').as('count'))
          .as('likeCount')
        ]);

        if(search){
          baseQuery = baseQuery.where('p.title', 'like', `%${search}%`)
        }
        if(tag){
          baseQuery = baseQuery.where('p.tags', '@>', [tag])
        }
       // Create count query based on the same conditions
       const countResult = await baseQuery
       .select(eb => eb.fn.count<number>('id').as('count'))
       .executeTakeFirst();
       
      const totalCount = Number(countResult?.count ?? 0);
      
      // Apply pagination to the main query
      const posts = await baseQuery
        .limit(limit)
        .offset(offset)
        .selectAll()
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
export const getPostsByUser = async (userId : string,options: GetPostsOptions = {}) : Promise<GetPostsResult> => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    try {
        let countQuery = db.selectFrom('posts');
        let query = db
        .selectFrom('posts as p')
        .where('user_id', '=', userId)
        .innerJoin('community', 'p.community_id', 'community.id')
        .innerJoin('user', 'p.user_id', 'user.id')
        .leftJoin('user_levels as ul', 'user.id', 'ul.user_id')
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
          .select(eb => eb.fn.count<number>('pl.user_id').as('count'))
          .as('likeCount')
        ]);
        const countResult = await countQuery
        .select(eb => eb.fn.count<number>('id').as('count'))
        .executeTakeFirst();
      
      const totalCount = Number(countResult?.count ?? 0);
      query = query
      .limit(limit)
      .offset(offset);
    
    // Execute the main query
    const posts = await query.selectAll().execute();
    return {
        posts,
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
      const post = await db
        .selectFrom('posts as p')
        .where('id', '=', id)
        .innerJoin('community', 'p.community_id', 'community.id')
        .innerJoin('user', 'p.user_id', 'user.id')
        .leftJoin('user_levels as ul', 'user.id', 'ul.user_id')
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
          .select(eb => eb.fn.count<number>('pl.user_id').as('count'))
          .as('likeCount')
        ])
        .executeTakeFirst();
      
      return post || null;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw new Error('Failed to fetch post');
    }
}
  