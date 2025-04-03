'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { isSystemAdmin } from "@/utils/premissons";
import { headers } from "next/headers";
import { z } from "zod";


const updateGenreSchema = z.object({
    name: z.string().min(1).max(50), 
    description: z.string().min(1).max(50), 
  })


export const CreateGenreAction =async (id : string,data : z.infer<typeof updateGenreSchema>) => {
    try {
        const user = await auth.api.getSession({
            headers : await headers()
        })
        const hasPermission = await isSystemAdmin(user?.user.id as string);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const parsedData = updateGenreSchema.parse(data);
        const genre = await db.updateTable('genre').where('genre.id','=',id).set({
            name : parsedData.name,
            description : parsedData.description,
            created_by: user?.user.id as string,
        }).returningAll().executeTakeFirst();

        return genre
    } catch (error) {
        console.error('Error updating genre:', error);
        throw new Error('Failed to update genre');
    }


}