"use server";

import { db } from "@/db";
import { getUserId } from "../helpers/get-userId";

export const createCommentLike = async (
  commentId: string,
) => {
    try {
        const userId = await getUserId();
        const like = await db.selectFrom('comments_likes')
          .where('comment_id', '=', commentId)
          .where('user_id', '=', userId)
          .select('user_id')
          .executeTakeFirst();
          if(like){
            return db.deleteFrom('comments_likes')
              .where('comment_id', '=', commentId)
              .where('user_id', '=', userId)
              .execute();
          }
        else{
            return await db.insertInto('comments_likes')
                .values({
                    comment_id: commentId,
                    user_id: userId,
                })
                .execute();
        }
       
    } catch (error) {
        console.error('Error create like:', error);
        throw new Error('Failed to create like');
    }

}