'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { updatePostSchema } from "@/schemas/schema";
import { canEditPost } from "@/utils/permissions";
import { headers } from "next/headers";
import { z } from "zod";

export async function UpdatePostAction(postId: string, data: z.infer<typeof updatePostSchema>) {
    try {
        const user = await auth.api.getSession({
            headers: await headers()
        });
        
        const hasPermission = await canEditPost(user?.user.id as string, postId);
        if (!hasPermission) {
            return {
                success: false,
                message: "You don't have permission to update this post."
            };
        }

        const parsedData = updatePostSchema.parse(data);
        const result = await db.updateTable('posts')
            .set({
                ...parsedData,
            })
            .where(eb => eb.and([
                eb('id', '=', postId),
                eb('user_id', '=', user?.user.id as string)
              ]))
            .execute();
            
        // Check if any rows were updated - fix the TypeScript error
        // The result is an array, so we need to check if it has any elements
        const updated = result && result.length > 0;
        
        if (!updated) {
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
        console.error('Error updating Post:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update post'
        };
    }
}