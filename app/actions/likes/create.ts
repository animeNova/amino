'use server';


import { db } from "@/db";
import { getUserId } from "../helpers/get-userId";

interface LikeResponse {
  success: boolean;
  liked: boolean;
  error?: string;
}

export async function CreateLikeAction(postId: string): Promise<LikeResponse> {
    if (!postId) {
        return {
            success: false,
            liked: false,
            error: "Post ID is required"
        };
    }

    try {
        const userId = await getUserId();
        
        if (!userId) {
            return {
                success: false,
                liked: false,
                error: "User must be authenticated to like posts"
            };
        }

        // Check if post exists
        const post = await db
            .selectFrom('posts')
            .where('id', '=', postId)
            .select('id')
            .executeTakeFirst();

        if (!post) {
            return {
                success: false,
                liked: false,
                error: "Post not found"
            };
        }

        // Check if like exists
        const existingLike = await db
            .selectFrom('post_likes')
            .where('post_id', '=', postId)
            .where('user_id', '=', userId)
            .select('post_likes.user_id')
            .executeTakeFirst();

        if (existingLike) {
            // Unlike: Remove the like
            await db
                .deleteFrom('post_likes')
                .where('user_id', '=', userId)
                .where('post_id', '=', postId)
                .execute();

            return {
                success: true,
                liked: false
            };
        }

        // Like: Create new like
        await db
            .insertInto('post_likes')
            .values({
                post_id: postId,
                user_id: userId,
            })
            .execute();

        return {
            success: true,
            liked: true
        };

    } catch (error) {
        console.error('Error handling like action:', error);
        return {
            success: false,
            liked: false,
            error: error instanceof Error ? error.message : 'Failed to process like action'
        };
    }
}