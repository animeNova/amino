'use server';

import { db } from "@/db";
import { getUserId } from "../helpers/get-userId";

export const getCommentLikes = async (commentId: string) => {
    try {
        const likes = await db
        .selectFrom('comments_likes')
        .where('comment_id', '=', commentId)
        .select(eb => eb.fn.count<number>('comment_id').as('count'))
        .execute();
    
        return likes;
    } catch (error) {
        console.error('Error fetching comment likes:', error);
        throw new Error('Failed to fetch comment likes');
    }
}

export const getUserCommentLikes = async (commentId: string) => {
    try {
        const userId = await getUserId();
        const like = await db
        .selectFrom('comments_likes')
        .where('comment_id', '=', commentId)
        .where('user_id', '=', userId)
        .selectAll()
        .executeTakeFirst();
        return like;
    } catch (error) {
        console.error('Error fetching user comment likes:', error);
        throw new Error('Failed to fetch user comment likes');
    }
}