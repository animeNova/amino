'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { isSystemAdmin } from "@/utils/premissons";
import { headers } from "next/headers";

export const deleteGenre = async (genreId: string) => {
    try {
        const user = await auth.api.getSession({
            headers : await headers()
        })
        const hasPermission = await isSystemAdmin(user?.user.id as string);
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