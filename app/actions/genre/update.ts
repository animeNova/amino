'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/premissons";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";


export const updateGenreSchema = z.object({
    name: z.string().min(1).max(50), 
    description: z.string().min(1).max(50), 
  })


export const UpdateGenreAction =async (id : string,data : z.infer<typeof updateGenreSchema>) => {
    try {
        const userId = await getUserId();
        const hasPermission = await isSystemAdmin(userId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const parsedData = updateGenreSchema.parse(data);
        const genre = await db.updateTable('genre').where('genre.id','=',id).set({
            name : parsedData.name,
            description : parsedData.description,
            created_by: userId,
        }).returningAll().executeTakeFirst();

        return genre
    } catch (error) {
        console.error('Error updating genre:', error);
        throw new Error('Failed to update genre');
    }


}