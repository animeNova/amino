'use server';

import { db } from "@/db";
import { canDeleteComment } from "@/utils/permissions";
import { getUserId } from "../helpers/get-userId";

export const deleteComment = async (commentId: string) => {
    try {
        const userId = await getUserId();
        
        const hasPermission = await canDeleteComment(userId,commentId);
        if (!hasPermission) {
            throw new Error("You don't have permission to delete a comment.");
        }
        const deletedComment = await db.deleteFrom('comments').where('id', '=', commentId).executeTakeFirst();
        if (!deletedComment) {
            throw new Error("Community not found or already deleted.");
        }
        return deletedComment;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw new Error('Failed to delete comment');
    }
  
}