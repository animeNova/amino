'use server';

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { isSystemAdmin } from "@/utils/premissons";
import { headers } from "next/headers";

export const deleteCommunity = async (communityId: string) => {
    try {
        const user = await auth.api.getSession({
            headers : await headers()
        })
        const hasPermission = await isSystemAdmin(user?.user.id as string);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const deletedCommunity = await db.deleteFrom('community').where('id', '=', communityId).executeTakeFirst();
        if (!deletedCommunity) {
            throw new Error("Community not found or already deleted.");
        }
        return deletedCommunity;
    } catch (error) {
        console.error('Error deleting communitie:', error);
        throw new Error('Failed to delete communitie');
    }
  
}