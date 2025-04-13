'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { canEditPost } from "@/utils/premissons";
import { headers } from "next/headers";
import { z } from "zod";


export const updatePostSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content : z.string().min(1, { message: "Content is required" }),
    image : z.string().url(),
    tags : z.array(z.string()),
  })


export const UpdatePostAction =async (postId : string,data : z.infer<typeof updatePostSchema>) => {
    try {
        const user = await auth.api.getSession({
            headers : await headers()
        })
        const hasPermission = await canEditPost(user?.user.id as string,postId);
        if (!hasPermission) {
            throw new Error("You don't have permission to update a Post.");
        }

        const parsedData = updatePostSchema.parse(data);
        const post = await db.updateTable('posts').set({
            ...parsedData,
        }).where('user_id','=',user?.user.id as string).executeTakeFirst();
        return post
    } catch (error) {
        console.error('Error updateing Post:', error);
        throw new Error('Failed to update Post');
    }
}