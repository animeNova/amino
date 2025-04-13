'use server';


import { db } from "@/db";
import { getUserId } from "../helpers/get-userId";

export const CreateLikeAction =async (postId : string) => {
    try {
        const userId = await getUserId();
        const ifLikeExists = await db
            .selectFrom('post_likes')
            .where('post_id', '=', postId)
            .where('user_id', '=', userId)
            .selectAll()
            .executeTakeFirst();
        if (ifLikeExists) {
            return db.deleteFrom('post_likes').where('user_id' , '=' , userId)
            .where('post_id' , '=' , postId)
            .executeTakeFirst();
        }
        const like = await db.insertInto('post_likes').values({
            post_id : postId,
            user_id: userId,
        }).returningAll().executeTakeFirst();
        return like
    } catch (error) {
        console.error('Error creating like:', error);
        throw new Error('Failed to create like');
    }
}