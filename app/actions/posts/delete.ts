'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { canDeletePost } from "@/utils/permissions";
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
        const result = await db.deleteFrom('posts').where('id', '=', postId).executeTakeFirst();
        if (!result) {
            return {
                success: false,
                message: "You don't have permission to Delete this post."
            };
        }
              // Check if any rows were updated - fix the TypeScript error
        // The result is an array, so we need to check if it has any elements
        const deleted = result && result.numDeletedRows > 0;
        
        if (!deleted) {
            return {
                success: false,
                message: "Post not found or could not be updated."
            };
        }
        
        return {
            success: true,
            message: "Post updated successfully"
            // Don't include the raw database result
        };
    } catch (error) {
        console.error('Error deleting post:', error);
        throw new Error('Failed to delete post');
    }
  
}