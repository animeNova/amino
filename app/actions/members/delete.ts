'use server';

import { db } from '@/db';
import { revalidatePath } from 'next/cache';
import { canDeleteMember } from '@/utils/permissions';
import { getUserIdSafe } from '../helpers/get-userId';

/**
 * Deletes a member from a community
 * 
 * @param memberId The ID of the member to delete
 * @param communityId The ID of the community
 * @returns Object indicating success or failure
 */
export async function deleteMember(memberId: string, communityId: string) {
    try {
        // Get the current user's ID for permission checking
        const currentUserId = await getUserIdSafe();
        
        if (!currentUserId) {
            return { success: false, error: 'Unauthorized' };
        }
        
        // Check if the member exists
        const memberToDelete = await db
            .selectFrom('members')
            .where('id', '=', memberId)
            .where('communityId', '=', communityId)
            .select(['user_Id'])
            .executeTakeFirst();
            
        if (!memberToDelete) {
            return { success: false, error: 'Member not found' };
        }
        
        // Check if the current user has permission to delete this member
        const hasPermission = await canDeleteMember(currentUserId, memberId, communityId);
        
        if (!hasPermission) {
            return { success: false, error: 'You do not have permission to remove this member' };
        }
        
        // All checks passed, delete the member
        await db
            .deleteFrom('members')
            .where('id', '=', memberId)
            .execute();
            
        // Revalidate the community page to reflect the changes
        revalidatePath(`/communities/${communityId}`);
        revalidatePath(`/dashboard/admin/moderators`);
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting member:', error);
        return { success: false, error: 'Failed to delete member' };
    }
}