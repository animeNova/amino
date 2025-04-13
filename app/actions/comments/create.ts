'use server';

import { db } from "@/db";
import { PostComments } from "@/db/types";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";

export const createCommentSchema = z.object({
      content : z .string().min(1, { message: "Content is required" }),
      parentId : z.string().optional(),
  })

  export async function createComment(
    postId: string , data : z.infer<typeof createCommentSchema>,
): Promise<PostComments> {
  const { content, parentId } = createCommentSchema.parse(data);
  const userId = await getUserId();
    return db.transaction().execute(async (trx) => {
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
          throw new Error('Parent comment not found');
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
      const [comment] = await trx
        .insertInto('comments')
        .values({
          post_id: postId,
          user_id: userId,
          content,
          parent_id: parentId || null,
          depth,
          path,
          is_edited: false,
          is_deleted: false,
          reply_count: 0,
        })
        .returningAll()
        .execute();
        
      return comment;
    });
  }