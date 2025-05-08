'use server';

import { db } from "@/db";
import { canChangeMemberRole } from "@/utils/permissions";
import { getUserId } from "../helpers/get-userId";

export type MemberRole = 'member' | 'moderator' | 'admin';

interface UpdateMemberRoleParams {
  memberId: string;
  communityId: string;
  newRole: MemberRole;
}

export const updateMemberRole = async ({ memberId, communityId, newRole }: UpdateMemberRoleParams) => {
  try {
    const userId = await getUserId();
    
    // Check if the user has permission to change roles
    const hasPermission = await canChangeMemberRole(userId, communityId);
    if (!hasPermission) {
      throw new Error("You don't have permission to change member roles in this community");
    }
    
    // Verify the member exists in this community
    const memberExists = await db
      .selectFrom('members')
      .where('id', '=', memberId)
      .where('communityId', '=', communityId)
      .select('id')
      .executeTakeFirst();
      
    if (!memberExists) {
      throw new Error("Member not found in this community");
    }
    
    // Don't allow changing your own role (to prevent removing your own admin privileges)
    // Check if the user is trying to change their own role
    const memberRecord = await db
      .selectFrom('members')
      .where('id', '=', memberId)
      .select(['user_Id'])
      .executeTakeFirst();
      
    // Get the user's system role to check if they're an admin/owner
    const userSystemRole = await db
      .selectFrom('user')
      .where('id', '=', userId)
      .select(['role'])
      .executeTakeFirst();
    
    // Only prevent role changes if it's the user's own role AND they're not a system admin/owner
    if (memberRecord?.user_Id === userId && 
        !['admin', 'owner'].includes(userSystemRole?.role ?? '')) {
      throw new Error("You cannot change your own role");
    }
    
    // Update the member's role
    const updatedMember = await db
      .updateTable('members')
      .set({
        role: newRole
      })
      .where('id', '=', memberId)
      .where('communityId', '=', communityId)
      .returningAll()
      .executeTakeFirst();
      
    return updatedMember;
  } catch (error) {
    console.error('Error updating member role:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update member role');
  }
}