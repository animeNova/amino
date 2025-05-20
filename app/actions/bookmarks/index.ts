"use server"

import { db } from "@/db";
import { getUserIdSafe } from "../helpers/get-userId";
import { Bookmark, NewBookmark } from "@/db/types";

/**
 * Add a bookmark for a post
 * @param postId The ID of the post to bookmark
 * @returns The created bookmark or null if user is not authenticated
 */
export async function addBookmark(postId: string): Promise<Bookmark | null> {
  const userId = await getUserIdSafe();
  
  if (!userId) {
    return null;
  }
  
  // Check if bookmark already exists
  const existingBookmark = await db
    .selectFrom('bookmarks')
    .where('user_id', '=', userId)
    .where('post_id', '=', postId)
    .selectAll()
    .executeTakeFirst();
    
  if (existingBookmark) {
    return existingBookmark;
  }
  
  // Create new bookmark
  const newBookmark: NewBookmark = {
    user_id: userId,
    post_id: postId
  };
  
  return db
    .insertInto('bookmarks')
    .values(newBookmark)
    .returningAll()
    .executeTakeFirst();
}

/**
 * Remove a bookmark for a post
 * @param postId The ID of the post to remove bookmark from
 * @returns True if bookmark was removed, false otherwise
 */
export async function removeBookmark(postId: string): Promise<boolean> {
  const userId = await getUserIdSafe();
  
  if (!userId) {
    return false;
  }
  
  const result = await db
    .deleteFrom('bookmarks')
    .where('user_id', '=', userId)
    .where('post_id', '=', postId)
    .executeTakeFirst();
    
  return !!result.numDeletedRows;
}

/**
 * Check if a post is bookmarked by the current user
 * @param postId The ID of the post to check
 * @returns True if post is bookmarked, false otherwise
 */
export async function isBookmarked(postId: string): Promise<boolean> {
  const userId = await getUserIdSafe();
  
  if (!userId) {
    return false;
  }
  
  const bookmark = await db
    .selectFrom('bookmarks')
    .where('user_id', '=', userId)
    .where('post_id', '=', postId)
    .executeTakeFirst();
    
  return !!bookmark;
}

/**
 * Get all bookmarks for the current user
 * @param options Pagination options
 * @returns List of bookmarked posts with post details
 */
export async function getUserBookmarks(options: { limit?: number; offset?: number } = {}) {
  const userId = await getUserIdSafe();
  
  if (!userId) {
    return {
      bookmarks: [],
      totalCount: 0,
      hasMore: false
    };
  }
  
  const limit = options.limit ?? 10;
  const offset = options.offset ?? 0;
  
  // Get count of total bookmarks
  const countResult = await db
    .selectFrom('bookmarks')
    .where('user_id', '=', userId)
    .select(({ fn }) => [fn.count('id').as('count')])
    .executeTakeFirst();
    
  const totalCount = Number(countResult?.count ?? 0);
  
  // Get bookmarked posts with details
  const bookmarks = await db
    .selectFrom('bookmarks as b')
    .innerJoin('posts as p', 'b.post_id', 'p.id')
    .innerJoin('user as u', 'p.user_id', 'u.id')
    .innerJoin('community as c', 'p.community_id', 'c.id')
    .leftJoin('post_likes as pl', (join) => 
      join.onRef('pl.post_id', '=', 'p.id')
          .on('pl.user_id', '=', userId)
    )
    .leftJoin(
      db.selectFrom('comments')
        .select(({ fn }) => [
          'post_id',
          fn.count('id').as('comment_count')
        ])
        .groupBy('post_id')
        .as('comment_counts'),
      'comment_counts.post_id', 'p.id'
    )
    .leftJoin('members as m', (join) => 
      join.onRef('m.communityId', '=', 'c.id')
          .on('m.user_Id', '=', userId)
    )
    .leftJoin('user_levels as ul', (join) =>
      join.on('ul.user_id', '=', 'u.id')
    )
    .where('b.user_id', '=', userId)
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
      'c.id as community_id', // Alias to avoid conflict if needed elsewhere
      'c.name as community_name',
      'c.image as community_image',
      'c.handle as communityHandle',

      // member role of the post author
      'm.role as memberRole',

      // User level fields of the post author
      'ul.level as userLevel',

      // user fields of the post author
      'u.id as user_id', // Alias to avoid conflict
      'u.name as user_name',
      'u.image as user_image',

      // Like status (for the current logged-in user) and total like count
      eb => eb.selectFrom('post_likes as pl_isLiked')
          .whereRef('pl_isLiked.post_id', '=', 'p.id')
          .where('pl_isLiked.user_id', '=', userId) // Use userId instead of currentUserId
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
  ])
    .groupBy([
      'b.id',
      'p.id',
      'c.id',
      'u.id',
      'ul.level',
      'pl.post_id',
      'comment_counts.comment_count',
      'm.role'
    ])
    .orderBy('b.created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .execute();
    
  return {
    bookmarks,
    totalCount,
    hasMore: offset + bookmarks.length < totalCount
  };
}