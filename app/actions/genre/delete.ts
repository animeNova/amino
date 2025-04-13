'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/premissons";
import { getUserId } from "../helpers/get-userId";

export const deleteGenre = async (genreId: string) => {
    try {
        const userId = await getUserId();
       
        const hasPermission = await isSystemAdmin(userId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const deletedGenre = await db.deleteFrom('genre').where('id', '=', genreId).executeTakeFirst();
        if (!deletedGenre) {
            throw new Error("Genre not found or already deleted.");
        }
        return deletedGenre;
    } catch (error) {
        console.error('Error deleting genre:', error);
        throw new Error('Failed to delete genre');
    }
  
}