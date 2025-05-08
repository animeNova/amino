'use server';

import { db } from "@/db";
import { getUserId } from "../helpers/get-userId";

export const GetLikeByPostId =async (postId : string) => {
    try {
        const userId = await getUserId();
        const like = await db
            .selectFrom('post_likes')
            .where('post_id', '=', postId)
            .where('user_id', '=', userId)
            .selectAll()
            .executeTakeFirstOrThrow();
        return !!like;
    } catch (error) {
        console.error('Error fetching like:', error);
        throw new Error('Failed to fetch like');
    }
}
