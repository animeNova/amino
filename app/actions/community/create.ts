'use server';

import { db } from "@/db";
import { isSystemAdmin } from "@/utils/permissions";
import { z } from "zod";
import { getUserId } from "../helpers/get-userId";
import { communitySchema } from "@/schemas/schema";
import { revalidatePath } from "next/cache";

export async function CreateCommunityAction(data : z.infer<typeof communitySchema>) {
    try {
        const userId = await getUserId();

        const hasPermission = await isSystemAdmin(userId);
        if (!hasPermission) {
            throw new Error("You don't have permission to create a community.");
        }
        const parsedData = communitySchema.parse(data);
        const community = await db.insertInto('community').values({
            ...parsedData,
            created_by: userId,
        }).executeTakeFirst();
             // Revalidate the genres list page to refresh data
        revalidatePath('/dashboard/admin/communities');
        return community;
    } catch (error) {
        console.error('Error create communitie:', error);
    }
}