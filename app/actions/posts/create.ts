'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { postSchema } from "@/schemas/schema";
import { canCreatePost } from "@/utils/permissions";
import { headers } from "next/headers";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";
import { revalidatePath } from "next/cache";

export async function CreatePostAction(communityHandler: string, data: z.infer<typeof postSchema>) {
    try {
        const community = await db
            .selectFrom('community')
            .where('handle', '=', communityHandler)
            .select('id')
            .executeTakeFirstOrThrow();
        
        const userId = await getUserId();
        
        const hasPermission = await canCreatePost(userId, community.id);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a Post.");
        }
    
        const parsedData = postSchema.parse(data);
        
        // Insert the post and get the ID
        const result = await db.insertInto('posts').values({
            title: parsedData.title,
            content: parsedData.content,
            image: parsedData.image,
            tags: parsedData.tags || [],
            status: 'accepted',
            user_id: userId,
            community_id: community.id, 
        }).returning('id').executeTakeFirst();
        
        // Revalidate the community page to show the new post
        revalidatePath(`/community/${communityHandler}`);
        
        // Return a plain object with just the ID
        return { success: true, postId: result?.id };
    } catch (error) {
        console.error('Error creating Post:', error);
        throw new Error('Failed to create Post');
    }
}