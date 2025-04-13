'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { canDeletePost } from "@/utils/premissons";
import { headers } from "next/headers";

export const deletePost = async (postId: string) => {
    try {
        const user = await auth.api.getSession({
            headers : await headers()
        })
        const hasPermission = await canDeletePost(user?.user.id as string,postId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const deletedCommunity = await db.deleteFrom('posts').where('id', '=', postId).executeTakeFirst();
        if (!deletedCommunity) {
            throw new Error("Post not found or already deleted.");
        }
        return deletedCommunity;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
    }
  
}