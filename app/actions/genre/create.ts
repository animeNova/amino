'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { isSystemAdmin } from "@/utils/premissons";
import { headers } from "next/headers";
import { z } from "zod";


const createGenreSchema = z.object({
    name: z.string().min(1).max(50), 
    description: z.string().min(1).max(50), 
  })


export const CreateGenreAction =async (data : z.infer<typeof createGenreSchema>) => {
    try {
        const user = await auth.api.getSession({
            headers : await headers()
        })
        const hasPermission = await isSystemAdmin(user?.user.id as string);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const parsedData = createGenreSchema.parse(data);
        const community = await db.insertInto('genre').values({
            name : parsedData.name,
            description : parsedData.description,
            created_by: user?.user.id as string,
        }).returningAll().executeTakeFirst();

        return community
    } catch (error) {
        console.error('Error create genre:', error);
        throw new Error('Failed to create genre');
    }


}