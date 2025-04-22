'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/permissions";
import { getUserId } from "../helpers/get-userId";
import { revalidatePath } from "next/cache";

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
        // Revalidate the genres list page to refresh data
        revalidatePath('/dashboard/admin/genres');
        return true;
    } catch (error) {
        console.error('Error deleting genre:', error);
        throw new Error('Failed to delete genre');
    }
  
}