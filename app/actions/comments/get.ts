import { db } from "@/db";
import { sql } from "kysely";

interface CommentWithUser {
  id: string;
  content: string;
  user_id: string;
  userName: string;
  userImage: string | undefined;
  created_at: Date;
  updated_at: Date;
  is_edited: boolean;
  is_deleted: boolean;
  reply_count: number;
  depth: number;
  parent_id: string | null;
  path: string[];
}

interface NestedComment extends CommentWithUser {
  replies: NestedComment[];
}
interface GetCommentsOptions {
  includeDeleted?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Fetch nested comments for a post
 */
export async function getNestedComments(
  postId: string,
  options?: GetCommentsOptions
): Promise<{ comments: NestedComment[]; totalCount: number }> {
  const { includeDeleted = false, limit = 100, offset = 0 } = options || {};

  // First, get all comments for this post
  let query = db
    .selectFrom('comments as c')
    .innerJoin('user as u', 'c.user_id', 'u.id')
    .where('c.post_id', '=', postId);

  // Filter out deleted comments if needed
  if (!includeDeleted) {
    query = query.where('c.is_deleted', '=', false);
  }

  // Execute the query
  const commentsData = await query
    .select([
      'c.id',
      'c.content',
      'c.user_id',
      'u.name as userName',
      'u.image as userImage',
      'c.created_at',
      'c.updated_at',
      'c.is_edited',
      'c.is_deleted',
      'c.reply_count',
      'c.depth',
      'c.parent_id',
      'c.path'
    ])
    .orderBy('c.created_at', 'asc')
    .orderBy('c.position', 'asc',)
    .orderBy('c.depth', 'asc')
    .execute();

  // Get total count
  const countResult = await db
    .selectFrom('comments')
    .where('post_id', '=', postId)
    .select(eb => eb.fn.count<number>('id').as('count'))
    .executeTakeFirst();

  const totalCount = Number(countResult?.count || 0);

  // Build the nested comments structure
  const commentMap = new Map<string, NestedComment>();
  const rootComments: NestedComment[] = [];

  // First pass: Create all comment objects and store in map
  commentsData.forEach(comment => {
    const commentObj: NestedComment = {
      ...comment,
      replies: []
    };
    
    commentMap.set(comment.id, commentObj);
  });

  // Second pass: Build the tree structure
  commentsData.forEach(comment => {
    const commentObj = commentMap.get(comment.id)!;
    
    if (comment.parent_id === null) {
      // This is a root comment
      rootComments.push(commentObj);
    } else {
      // This is a reply
      const parentComment = commentMap.get(comment.parent_id);
      if (parentComment) {
        parentComment.replies.push(commentObj);
      }
    }
  });

  // Apply pagination to the root comments
  const paginatedRootComments = rootComments.slice(offset, offset + limit);

  return {
    comments: paginatedRootComments,
    totalCount
  };
}

/**
 * Get a single comment thread (a comment and all its replies)
 */
export async function getCommentThread(commentId: string): Promise<NestedComment | null> {
  // First get the root comment
  const rootComment = await db
    .selectFrom('comments as c')
    .innerJoin('user as u', 'c.user_id', 'u.id')
    .where('c.id', '=', commentId)
    .select([
      'c.id',
      'c.content',
      'c.user_id',
      'u.name as userName',
      'u.image as userImage',
      'c.created_at',
      'c.updated_at',
      'c.is_edited',
      'c.is_deleted',
      'c.reply_count',
      'c.depth',
      'c.parent_id',
      'c.path',
      'c.post_id'
    ])
    .executeTakeFirst();

  if (!rootComment) {
    return null;
  }

  // Get all replies
  const replies = await db
    .selectFrom('comments as c')
    .innerJoin('user as u', 'c.user_id', 'u.id')
    .where('c.post_id', '=', rootComment.post_id)
    .where(eb => 
      sql`${eb.ref('c.path')} @> ${JSON.stringify([commentId])}`
    )
    .select([
      'c.id',
      'c.content',
      'c.user_id',
      'u.name as userName',
      'u.image as userImage',
      'c.created_at',
      'c.updated_at',
      'c.is_edited',
      'c.is_deleted',
      'c.reply_count',
      'c.depth',
      'c.parent_id',
      'c.path'
    ])
    .orderBy('c.created_at', 'asc')
    .execute();

  // Build the nested comment structure
  const commentMap = new Map<string, NestedComment>();
  
  // Root comment
  const rootCommentObj: NestedComment = {
    ...rootComment,
    replies: []
  };
  
  commentMap.set(rootComment.id, rootCommentObj);

  // Process all replies
  replies.forEach(reply => {
    commentMap.set(reply.id, { ...reply, replies: [] });
  });

  // Build the tree
  replies.forEach(reply => {
    if (reply.parent_id) {
      const parent = commentMap.get(reply.parent_id);
      const child = commentMap.get(reply.id);
      
      if (parent && child) {
        parent.replies.push(child);
      }
    }
  });

  return rootCommentObj;
}