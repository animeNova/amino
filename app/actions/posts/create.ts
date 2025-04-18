'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { createPostSchema } from "@/schemas/schema";
import { canCreatePost } from "@/utils/permissions";
import { headers } from "next/headers";
import { z } from "zod";




export const CreatePostAction =async (communityId : string,data : z.infer<typeof createPostSchema>) => {
    try {
        const user = await auth.api.getSession({
            headers : await headers()
        })
        const hasPermission = await canCreatePost(user?.user.id as string,communityId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a Post.");
        }
        const community = await db
            .selectFrom('community')
            .where('id', '=', communityId)
            .select('visibility')
            .executeTakeFirstOrThrow();
        const parsedData = createPostSchema.parse(data);
        const post = await db.insertInto('posts').values({
            ...parsedData,
            user_id: user?.user.id as string,
            community_id: communityId,
            status: community.visibility === 'public' ? 'accepted' : 'pending',
        }).executeTakeFirst();
        return post
    } catch (error) {
        console.error('Error creating Post:', error);
        throw new Error('Failed to create Post');
    }
}