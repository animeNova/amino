// File: utils/permissions.ts

import { db } from "@/db";

/**
 * Permission levels in the system
 */
export enum Role {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}

/**
 * Check if a user is the author of a comment
 */
export async function isCommentAuthor(userId: string, commentId: string): Promise<boolean> {
  const comment = await db
    .selectFrom('post_comments')
    .where('id', '=', commentId)
    .where('user_id', '=', userId)
    .select('id')
    .executeTakeFirst();
    
  return !!comment;
}

/**
 * Check if a user is the author of a post
 */
export async function isPostAuthor(userId: string, postId: string): Promise<boolean> {
  const post = await db
    .selectFrom('posts')
    .where('id', '=', postId)
    .where('user_id', '=', userId)
    .select('id')
    .executeTakeFirst();
    
  return !!post;
}

/**
 * Check if a user is a moderator or admin of a community
 */
export async function isCommunityModerator(userId: string, communityId: string): Promise<boolean> {
  const member = await db
    .selectFrom('members')
    .where('user_id', '=', userId)
    .where('communityId', '=', communityId)
    .where('role', 'in', ['moderator', 'admin'])
    .where('status', '=', 'accepted')
    .select('id')
    .executeTakeFirst();
    
  return !!member;
}

/**
 * Check if the user is a system admin
 */
export async function isSystemAdmin(userId: string): Promise<boolean> {
  const user = await db
    .selectFrom('user')
    .where('id', '=', userId)
    .where('role', 'in', ['admin', 'superadmin'])
    .select('id')
    .executeTakeFirst();
    
  return !!user;
}

/**
 * Get community ID for a post (used for permission checks)
 */
export async function getPostCommunityId(postId: string): Promise<string | null> {
  const post = await db
    .selectFrom('posts')
    .where('id', '=', postId)
    .select('community_id')
    .executeTakeFirst();
    
  return post?.community_id || null;
}

/**
 * Get community ID for a comment (used for permission checks)
 */
export async function getCommentCommunityId(commentId: string): Promise<string | null> {
  const comment = await db
    .selectFrom('post_comments as pc')
    .innerJoin('posts as p', 'pc.post_id', 'p.id')
    .where('pc.id', '=', commentId)
    .select('p.community_id')
    .executeTakeFirst();
    
  return comment?.community_id || null;
}

/**
 * Check if a user can edit a comment
 * - A user can edit their own comments
 */
export async function canEditComment(userId: string, commentId: string): Promise<boolean> {
  // Only comment authors can edit their comments
  return isCommentAuthor(userId, commentId);
}

/**
 * Check if a user can delete a comment
 * - A user can delete their own comments
 * - Post authors can delete any comments on their posts
 * - Community moderators can delete any comments in their community
 * - System admins can delete any comments
 */
export async function canDeleteComment(userId: string, commentId: string): Promise<boolean> {
  // First, check if the user is the comment author (simplest case)
  const isAuthor = await isCommentAuthor(userId, commentId);
  if (isAuthor) return true;
  
  // Check if user is a system admin
  const isAdmin = await isSystemAdmin(userId);
  if (isAdmin) return true;
  
  // Get the comment details to check post and community permissions
  const comment = await db
    .selectFrom('post_comments')
    .where('id', '=', commentId)
    .select('post_id')
    .executeTakeFirst();
    
  if (!comment) return false;
  
  // Check if user is the post author
  const isPostOwner = await isPostAuthor(userId, comment.post_id);
  if (isPostOwner) return true;
  
  // Check if user is a community moderator
  const communityId = await getPostCommunityId(comment.post_id);
  if (communityId) {
    const isModerator = await isCommunityModerator(userId, communityId);
    if (isModerator) return true;
  }
  
  return false;
}

/**
 * Check if a user can create a comment
 * - Any authenticated user can comment on public posts
 * - For private communities, the user must be a member
 */
export async function canCreateComment(userId: string, postId: string): Promise<boolean> {
  // Get the post's community
  const communityId = await getPostCommunityId(postId);
  if (!communityId) return false;
  
  // Get the community visibility
  const community = await db
    .selectFrom('community')
    .where('id', '=', communityId)
    .select(['visibility'])
    .executeTakeFirst();
    
  if (!community) return false;
  
  // Public communities allow anyone to comment
  if (community.visibility === 'public') return true;
  
  // For private or request_only communities, check membership
  const membership = await db
    .selectFrom('members')
    .where('user_id', '=', userId)
    .where('communityId', '=', communityId)
    .where('status', '=', 'accepted')
    .select('id')
    .executeTakeFirst();
    
  return !!membership;
}

/**
 * Get permissions for a user on a specific comment
 * - Useful for sending to the frontend to control UI elements
 */
export async function getCommentPermissions(userId: string | null, commentId: string) {
  if (!userId) {
    return {
      canEdit: false,
      canDelete: false,
    };
  }
  
  const [canEdit, canDelete] = await Promise.all([
    canEditComment(userId, commentId),
    canDeleteComment(userId, commentId)
  ]);
  
  return {
    canEdit,
    canDelete
  };
}