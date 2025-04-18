'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/permissions";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";
import { communitySchema } from "@/schemas/schema";





export async function UpdateCommunityAction (data : z.infer<typeof communitySchema>)  {
    try {
        const userId = await getUserId();
        const hasPermission = await isSystemAdmin(userId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const parsedData = communitySchema.parse(data);
        const { id, ...rest } = parsedData;
        const community = await db.updateTable('community').where('community.id', '=' , id!).set({
            ...rest,
            created_by: userId,
        }).executeTakeFirst();
        return community;
    } catch (error) {
        console.error('Error updating communitie', error);

    }
}