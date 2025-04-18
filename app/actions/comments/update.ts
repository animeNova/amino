'use server';

import { db } from "@/db";
import { canEditComment } from "@/utils/permissions";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";
import { updateCommentSchema } from "@/schemas/schema";





export const updateCommentAction =async (commentId : string,data : z.infer<typeof updateCommentSchema>) => {
    try {
        const userId = await getUserId();

        const hasPermission = await canEditComment(userId,commentId);
        if (!hasPermission) {
            throw new Error("You don't have permission to update a comment.");
        }
        const parsedData = updateCommentSchema.parse(data);
        const comment = await db.updateTable('comments').set({
            content : parsedData.content
        }).where('id' , '=' , commentId).executeTakeFirst();
        return comment
    } catch (error) {
        console.error('Error updating comment:', error);
        throw new Error('Failed to update comment');
    }


}