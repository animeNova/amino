'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/permissions";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";
import { genreSchema } from "@/schemas/schema";
import { revalidatePath } from "next/cache";


export const CreateGenreAction =async (data : z.infer<typeof genreSchema>) => {
    try {
        const userId = await getUserId();
        
        const hasPermission = await isSystemAdmin(userId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const parsedData = genreSchema.parse(data);
        const community = await db.insertInto('genre').values({
            name : parsedData.name,
            description : parsedData.description,
            created_by: userId,
        }).returningAll().executeTakeFirst();
         // Revalidate the genres list page to refresh data
         revalidatePath('/dashboard/admin/genres');
        return community
    } catch (error) {
        console.error('Error create genre:', error);
        throw new Error('Failed to create genre');
    }


}