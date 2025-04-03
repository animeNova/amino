'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { isSystemAdmin } from "@/utils/premissons";
import { headers } from "next/headers";
import { z } from "zod";


const updateCommunitySchema = z.object({
    name: z.string().min(1).max(50),  
    handle : z.string().min(1).max(50),
    description: z.string().max(200),
    image : z.string().url(),
    backgroundImage : z.string().url(),
    language : z.string().min(1).max(50),
    visibility : z.enum(['public', 'private','request_only']).default('public'),
    genre_id : z.string().nonempty()
  })


export const UpdateCommunityAction =async (id : string,data : z.infer<typeof updateCommunitySchema>) => {
    try {
        const user = await auth.api.getSession({
            headers : await headers()
        })
        const hasPermission = await isSystemAdmin(user?.user.id as string);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const parsedData = updateCommunitySchema.parse(data);
        const community = await db.updateTable('community').where('community.id', '=' , id).set({
            ...parsedData,
            created_by: user?.user.id as string,
        }).executeTakeFirst();
        return community
    } catch (error) {
        console.error('Error updating communitie', error);
        throw new Error('Failed to updating communitie');
    }


}