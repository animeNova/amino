'use server';

import { db } from "@/db";
import { PostComments } from "@/db/types";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";
import { createCommentSchema } from "@/schemas/schema";
import { canCreateComment } from "@/utils/permissions";

// Define a standard response structure
interface CreateCommentResult {
  success: boolean;
  data?: PostComments;
  error?: string;
}

export async function createComment(
    postId: string , data : z.infer<typeof createCommentSchema>,
): Promise<CreateCommentResult> { // Updated return type
  try {
    const { content, parentId } = createCommentSchema.parse(data);
    const userId = await getUserId(); // This will throw if user is not authenticated

    const permission = await canCreateComment(userId, postId);
    if (!permission) {
      // Return a structured error instead of throwing
      return { success: false, error: 'You do not have permission to create a comment on this post.' };
    }

    const comment = await db.transaction().execute(async (trx) => {
      let depth = 0;
      let path: string[] = [];
      // If this is a reply, get the parent comment info
      if (parentId) {
        const parentComment = await trx
          .selectFrom('comments')
          .where('id', '=', parentId)
          .select(['depth', 'path'])
          .executeTakeFirst();
          
        if (!parentComment) {
          // It's good to also handle this error gracefully for the client
          throw new Error('Parent comment not found. It may have been deleted.');
        }
        
        // Set depth based on parent (parent's depth + 1)
        depth = parentComment.depth + 1;
        
        // Set path to include parent's path plus parent's id
        path = [...parentComment.path, parentId];
        
        // Increment the parent's reply count
        await trx
          .updateTable('comments')
          .set({ reply_count: eb => eb(eb.ref('reply_count'), '+', 1) })
          .where('id', '=', parentId)
          .execute();
      }
      
      // Create the new comment
      const [newComment] = await trx // Renamed to avoid conflict with outer scope 'comment'
        .insertInto('comments')
        .values({
          post_id: postId,
          user_id: userId,
          content,
          parent_id: parentId ?? null,
          depth,
          path,
          is_edited: false,
          is_deleted: false,
          reply_count: 0,
        })
        .returningAll()
        .execute();
        
      return newComment; // Return the created comment from the transaction
    });

    return { success: true, data: comment }; // Return success with the comment data

  } catch (error) {
    console.error('Error creating comment:', error);
    // Return a generic error message for other types of failures
    // If error is an instance of ZodError, you could parse it for more specific messages
    if (error instanceof z.ZodError) {
        return { success: false, error: "Invalid comment data provided." };
    }
    return { success: false, error: error instanceof Error ? error.message : "Failed to create comment due to an unexpected issue." };
  }
}