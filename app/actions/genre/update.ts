'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/permissions";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";
import { genreSchema } from "@/schemas/schema";





export const UpdateGenreAction =async (data : z.infer<typeof genreSchema>) => {
    try {
        const userId = await getUserId();
        const hasPermission = await isSystemAdmin(userId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const parsedData = genreSchema.parse(data);
        const { id,...rest } = parsedData;
        const genre = await db.updateTable('genre').where('genre.id','=',id!).set({
            ...rest,
            created_by: userId,
        }).returningAll().executeTakeFirst();

        return genre
    } catch (error) {
        console.error('Error updating genre:', error);
        throw new Error('Failed to update genre');
    }


}