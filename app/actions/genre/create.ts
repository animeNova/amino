'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/premissons";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";


export const createGenreSchema = z.object({
    name: z.string().min(1).max(50), 
    description: z.string().min(1).max(50), 
  })


export const CreateGenreAction =async (data : z.infer<typeof createGenreSchema>) => {
    try {
        const userId = await getUserId();
        
        const hasPermission = await isSystemAdmin(userId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const parsedData = createGenreSchema.parse(data);
        const community = await db.insertInto('genre').values({
            name : parsedData.name,
            description : parsedData.description,
            created_by: userId,
        }).returningAll().executeTakeFirst();

        return community
    } catch (error) {
        console.error('Error create genre:', error);
        throw new Error('Failed to create genre');
    }


}