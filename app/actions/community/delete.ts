'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/premissons";
import { getUserId } from "../helpers/get-userId";

export const deleteCommunity = async (communityId: string) => {
    try {
        const userId = await getUserId();
        
        const hasPermission = await isSystemAdmin(userId);
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