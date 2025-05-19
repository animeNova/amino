'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/permissions";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";
import { communitySchema } from "@/schemas/schema";
import { revalidatePath } from "next/cache";

export async function UpdateCommunityAction(data: z.infer<typeof communitySchema>) {
    try {
        const userId = await getUserId();
        const hasPermission = await isSystemAdmin(userId);
        if (!hasPermission) {
            throw new Error("You don't have permission to update a community.");
        }
        
        const parsedData = communitySchema.parse(data);
        const { id, ...rest } = parsedData;
        
        if (!id) {
            throw new Error("Community ID is required");
        }
        
        await db.updateTable('community')
            .where('community.id', '=', id)
            .set({
                ...rest,
            })
            .execute();
        
        revalidatePath('/dashboard/admin/communities');
        
        // Return a plain serializable object
        return { success: true, message: "Community updated successfully" };
    } catch (error) {
        console.error('Error updating community:', error);
        // Rethrow the error with a clean message
        throw new Error(error instanceof Error ? error.message : "Failed to update community");
    }
}