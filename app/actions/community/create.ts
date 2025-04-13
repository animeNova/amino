'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/premissons";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";


export const createCommunitySchema = z.object({
    name: z.string().min(1).max(50),  
    handle : z.string().min(1).max(50),
    description: z.string().max(200),
    image : z.string().url(),
    banner : z.string().url(),
    language : z.string().min(1).max(50),
    visibility : z.enum(['public', 'private']).default('public'),
    genre_id : z.string().nonempty()
  })


export const CreateCommunityAction =async (data : z.infer<typeof createCommunitySchema>) => {
    try {
        const userId = await getUserId();

        const hasPermission = await isSystemAdmin(userId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const parsedData = createCommunitySchema.parse(data);
        const community = await db.insertInto('community').values({
            ...parsedData,
            created_by: userId,
        }).executeTakeFirst();
        return community
    } catch (error) {
        console.error('Error create communitie:', error);
        throw new Error('Failed to create communitie');
    }


}