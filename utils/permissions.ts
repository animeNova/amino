'use server';
import { hasUserRequestedToJoin } from "@/app/actions/join-requests/get";
import { db } from "@/db";

/**
 * Permission levels in the system
 */

/**
 * Check if a user is the author of a post
 */
export async function isPostAuthor(userId: string, postId: string): Promise<boolean> {
  const post = await db
    .selectFrom('posts')
    .where('id', '=', postId)
    .where('user_id', '=', userId)
    .select('id')
    .executeTakeFirst();
    
  return !!post;
}
/**
 * Check if a user can create Posts
 * - Any authenticated user can create posts in public communities
 * - For private communities, the user must be a member
*/
export async function canCreatePost(userId: string, communityId: string): Promise<boolean> {
  // Get the community visibility
  const community = await db
    .selectFrom('community')
    .where('id', '=', communityId)
    .select('community.id')
    .executeTakeFirst();
    
  if (!community) return false;
  const membership = await db
  .selectFrom('members')
  .where('user_Id', '=', userId)
  .where('communityId', '=', communityId)
  .select('id')
  .executeTakeFirst();

  return !!membership;
}
export async function canEditPost(userId: string,postId : string): Promise<boolean> {
    // First, check if the user is the comment author (simplest case)
    const isAuthor = await isPostAuthor(userId, postId);
    if (isAuthor) return true;
    return false;
}
export async function getPostPermissions(userId: string, postId: string) {
  const isAuthor = await isPostAuthor(userId, postId);
  if (!isAuthor) {
    return {
      canEdit: false,
      canDelete: false,
    };
  }
  
  const [canEdit, canDelete] = await Promise.all([
    canEditPost(userId, postId),
    canDeletePost(userId, postId)
  ]);
  
  return {
    canEdit,
    canDelete
  };
}
export async function canDeletePost(userId: string,postId : string): Promise<boolean> {
    // First, check if the user is the comment author (simplest case)
    const isAuthor = await isPostAuthor(userId, postId);
    if (isAuthor) return true;
    
    // Check if user is a system admin
    const isAdmin = await isSystemAdmin(userId);
    if (isAdmin) return true;
    
    // Get the comment details to check post and community permissions
    const post = await db
      .selectFrom('posts')
      .where('id', '=', postId)
      .select('id')
      .executeTakeFirst();
      
    if (!post) return false;
    
    // Check if user is a community moderator
    const communityId = await getPostCommunityId(post.id);
    if (communityId) {
      const isModerator = await isCommunityModerator(userId, communityId);
      if (isModerator) return true;
    }
    return false;
}

/**
 * Check if a user is the author of a comment
 */
export async function isCommentAuthor(userId: string, commentId: string): Promise<boolean> {
  const comment = await db
    .selectFrom('comments')
    .where('id', '=', commentId)
    .where('user_id', '=', userId)
    .select('id')
    .executeTakeFirst();
    
  return !!comment;
}




/**
 * Check if a user is a moderator or admin of a community
 */
export async function isCommunityModerator(userId: string, communityId: string): Promise<boolean> {
  const isAdmin = await isSystemAdmin(userId);
  if (isAdmin) return true;
  const member = await db
    .selectFrom('members')
    .where('user_Id', '=', userId)
    .where('communityId', '=', communityId)
    .where('role', 'in', ['moderator', 'admin'])
    .select('id')
    .executeTakeFirst();
    
  return !!member;
}

/**
 * Check if a user is a member of a community
 */
export async function isCommunityMember(userId: string, communityId: string): Promise<boolean> {
  const member = await db
    .selectFrom('members')
    .where('user_Id', '=', userId)
    .where('communityId', '=', communityId)
    .select('id')
    .executeTakeFirst();
    
  return !!member;
}

/**
 * Check if the user is a system admin
 */
export async function isSystemAdmin(userId: string): Promise<boolean> {
  const user = await db
    .selectFrom('user')
    .where('id', '=', userId)
    .where('role', 'in', ['admin', 'owner'])
    .select('id')
    .executeTakeFirst();
    
  return !!user;
}

/**
 * Get community ID for a post (used for permission checks)
 */
export async function getPostCommunityId(postId: string): Promise<string | null> {
  const post = await db
    .selectFrom('posts')
    .where('id', '=', postId)
    .select('community_id')
    .executeTakeFirst();
    
  return post?.community_id ?? null;
}

/**
 * Get community ID for a comment (used for permission checks)
 */
export async function getCommentCommunityId(commentId: string): Promise<string | null> {
  const comment = await db
    .selectFrom('comments as pc')
    .innerJoin('posts as p', 'pc.post_id', 'p.id')
    .where('pc.id', '=', commentId)
    .select('p.community_id')
    .executeTakeFirst();
    
  return comment?.community_id ?? null;
}

/**
 * Check if a user can edit a comment
 * - A user can edit their own comments
 */
export async function canEditComment(userId: string, commentId: string): Promise<boolean> {
  // Only comment authors can edit their comments
  return isCommentAuthor(userId, commentId);
}

/**
 * Check if a user can delete a comment
 * - A user can delete their own comments
 * - Post authors can delete any comments on their posts
 * - Community moderators can delete any comments in their community
 * - System admins can delete any comments
 */
export async function canDeleteComment(userId: string, commentId: string): Promise<boolean> {
  // First, check if the user is the comment author (simplest case)
  const isAuthor = await isCommentAuthor(userId, commentId);
  if (isAuthor) return true;
  
  // Check if user is a system admin
  const isAdmin = await isSystemAdmin(userId);
  if (isAdmin) return true;
  
  // Get the comment details to check post and community permissions
  const comment = await db
    .selectFrom('comments')
    .where('id', '=', commentId)
    .select('post_id')
    .executeTakeFirst();
    
  if (!comment) return false;
  
  // Check if user is the post author
  const isPostOwner = await isPostAuthor(userId, comment.post_id);
  if (isPostOwner) return true;
  
  // Check if user is a community moderator
  const communityId = await getPostCommunityId(comment.post_id);
  if (communityId) {
    const isModerator = await isCommunityModerator(userId, communityId);
    if (isModerator) return true;
  }
  
  return false;
}

/**
 * Check if a user can create a comment
 * - Any authenticated user can comment on public posts
 * - For private communities, the user must be a member
 */
export async function canCreateComment(userId: string, postId: string): Promise<boolean> {
  // Get the post's community
  const communityId = await getPostCommunityId(postId);
  if (!communityId) return false;
  


  // For private or request_only communities, check membership
  const membership = await db
    .selectFrom('members')
    .where('user_Id', '=', userId)
    .where('communityId', '=', communityId)
    .select('id')
    .executeTakeFirst();
    
  return !!membership;
}

/**
 * Get permissions for a user on a specific comment
 * - Useful for sending to the frontend to control UI elements
 */
export async function getCommentPermissions(userId: string | null, commentId: string) {
  if (!userId) {
    return {
      canEdit: false,
      canDelete: false,
    };
  }
  
  const [canEdit, canDelete] = await Promise.all([
    canEditComment(userId, commentId),
    canDeleteComment(userId, commentId)
  ]);
  
  return {
    canEdit,
    canDelete
  };
}

/**
 * Get permissions for a user to Request Join a community
 */
export async function canRequestJoin(userId: string, communityId: string): Promise<boolean> {
  // Check if the user is already a member
  const isMember = await isCommunityMember(userId, communityId);
  if (isMember) return false;

  // Check if the user has already sent a request
  const existingRequest = await hasUserRequestedToJoin(communityId);
  if (existingRequest) return false;
  return true;
}

/**
 * update Join Request status
 * - Only community admins or moderators can update join request status
 */
export async function canUpdateJoinRequestStatus(userId: string, requestId: string): Promise<boolean> {
  // Check if the user is a community moderator or admin
  const request = await db
    .selectFrom('join_requests')
    .where('id', '=', requestId)
    .select(['community_id'])
    .executeTakeFirst();
    
  if (!request) return false;
  const isAdmin = await isSystemAdmin(userId);
  if (isAdmin) return true;
  const isModerator = await isCommunityModerator(userId, request.community_id);
  if (isModerator) return true;
  
  return false;
}

export async function canCancelJoinRequest(userId: string, requestId: string): Promise<boolean> {
  // Check if the user is the author of the request
  const request = await db
   .selectFrom('join_requests')
   .where('id', '=', requestId)
   .where('user_id', '=', userId)
   .where('status', '=', 'pending')
   .select('id')
   .executeTakeFirst();

  return!!request;
}

export async function canGetJoinRequests(userId: string, communityId: string): Promise<boolean> {
  // Check if the user is a community moderator or admin
  const isAdmin = await isSystemAdmin(userId);
  if (isAdmin) return true; 
  const isModerator = await isCommunityModerator(userId, communityId);
  if (isModerator) return true
  return false;
}

/**
 * Check if a user can change another member's role in a community
 * - Only community admins or system admins can change member roles
 * - Moderators cannot change roles
 * @param userId The ID of the user attempting to change the role
 * @param communityId The ID of the community
 * @returns Boolean indicating if the user has permission to change roles
 */
export async function canChangeMemberRole(userId: string, communityId: string): Promise<boolean> {
  // System admins can always change roles
  const isSystemAdminUser = await isSystemAdmin(userId);
  if (isSystemAdminUser) return true;
  
  // Check if the user is specifically a community admin (not just a moderator)
  const member = await db
    .selectFrom('members')
    .where('user_Id', '=', userId)
    .where('communityId', '=', communityId)
    .where('role', '=', 'admin')
    .select('id')
    .executeTakeFirst();
    
  return !!member;
}


/**
 * Check if a user can delete a member from a community
 * - System admins can delete any member except other admins
 * - Community admins can delete moderators and regular members, but not other admins
 * - Moderators can only delete regular members
 * - Regular members cannot delete anyone
 * - Any user can delete themselves (leave a community)
 * 
 * @param currentUserId The ID of the user attempting to delete the member
 * @param memberId The ID of the member to be deleted
 * @param communityId The ID of the community
 * @returns Boolean indicating if the user has permission to delete the member
 */
export async function canDeleteMember(currentUserId: string, memberId: string, communityId: string): Promise<boolean> {
  // Users can always remove themselves (leave a community)
  const memberToDelete = await db
    .selectFrom('members')
    .where('id', '=', memberId)
    .where('communityId', '=', communityId)
    .select(['user_Id', 'role'])
    .executeTakeFirst();
    
  if (!memberToDelete) return false;
  
  // Self-removal is always allowed
  const isSelfRemoval = memberToDelete.user_Id === currentUserId;
  if (isSelfRemoval) return true;
  
  // Check if the current user is a system admin
  const isAdmin = await isSystemAdmin(currentUserId);
  if (isAdmin && memberToDelete.role !== 'admin') return true;
  
  // Get the current user's role in this community
  const currentUserRole = await db
    .selectFrom('members')
    .where('user_Id', '=', currentUserId)
    .where('communityId', '=', communityId)
    .select('role')
    .executeTakeFirst();
    
  if (!currentUserRole) return false;
  
  // Permission rules based on roles
  if (currentUserRole.role === 'admin') {
    // Admins can delete moderators and regular members, but not other admins
    return memberToDelete.role !== 'admin';
  } else if (currentUserRole.role === 'moderator') {
    // Moderators can only delete regular members
    return memberToDelete.role === 'member';
  }
  
  // Regular members cannot delete anyone
  return false;
}

/**
 * Chat Permissions
 */

/**
 * Check if a user can create a chat message in a community
 * - User must be a member of the community to send messages
 */
export async function canCreateChatMessage(userId: string, communityId: string): Promise<boolean> {
  // Check if the user is a member of the community
  const isMember = await isCommunityMember(userId, communityId);
  return isMember;
}

/**
 * Check if a user can read chat messages in a community
 * - User must be a member of the community to read messages
 */
export async function canReadChatMessages(userId: string, communityId: string): Promise<boolean> {
  // Check if the user is a member of the community
  const isMember = await isCommunityMember(userId, communityId);
  return isMember;
}

/**
 * Check if a user can update their own chat message
 * - User can only edit their own messages
 */
export async function canUpdateChatMessage(userId: string, messageId: string): Promise<boolean> {
  // Check if the user is the author of the message
  const message = await db
    .selectFrom('chat_messages')
    .where('id', '=', messageId)
    .where('user_id', '=', userId)
    .select('id')
    .executeTakeFirst();
    
  return !!message;
}

/**
 * Check if a user can delete a chat message
 * - User can delete their own messages
 * - Community moderators and admins can delete any message
 * - System admins can delete any message
 */
export async function canDeleteChatMessage(userId: string, messageId: string): Promise<boolean> {
  // First, check if the user is the message author
  const isAuthor = await db
    .selectFrom('chat_messages')
    .where('id', '=', messageId)
    .where('user_id', '=', userId)
    .select('id')
    .executeTakeFirst();
    
  if (isAuthor) return true;
  
  // Check if user is a system admin
  const isAdmin = await isSystemAdmin(userId);
  if (isAdmin) return true;
  
  // Get the message details to check community permissions
  const message = await db
    .selectFrom('chat_messages')
    .where('id', '=', messageId)
    .select('room_id')
    .executeTakeFirst();
    
  if (!message) return false;
  
  // Get the room to find the community
  const room = await db
    .selectFrom('chat_rooms')
    .where('id', '=', message.room_id)
    .select('community_id')
    .executeTakeFirst();
    
  if (!room) return false;
  
  // Check if user is a community moderator
  const isModerator = await isCommunityModerator(userId, room.community_id);
  return isModerator;
}

/**
 * Check if a user can create a chat room in a community
 * - Only community moderators, admins, and system admins can create chat rooms
 */
export async function canCreateChatRoom(userId: string, communityId: string): Promise<boolean> {
  // Check if the user is a moderator or admin of the community
  return isCommunityModerator(userId, communityId);
}

/**
 * Check if a user can update a chat room's details
 * - Only community moderators, admins, and system admins can update chat rooms
 */
export async function canUpdateChatRoom(userId: string, roomId: string): Promise<boolean> {
  // Check if user is a system admin
  const isAdmin = await isSystemAdmin(userId);
  if (isAdmin) return true;
  
  // Get the room details to check community permissions
  const room = await db
    .selectFrom('chat_rooms')
    .where('id', '=', roomId)
    .select('community_id')
    .executeTakeFirst();
    
  if (!room) return false;
  
  // Check if user is a community moderator
  return isCommunityModerator(userId, room.community_id);
}

/**
 * Check if a user can delete a chat room
 * - Only community admins and system admins can delete chat rooms
 * - Moderators cannot delete chat rooms
 */
export async function canDeleteChatRoom(userId: string, roomId: string): Promise<boolean> {
  // Check if user is a system admin
  const isAdmin = await isSystemAdmin(userId);
  if (isAdmin) return true;
  
  // Get the room details to check community permissions
  const room = await db
    .selectFrom('chat_rooms')
    .where('id', '=', roomId)
    .select('community_id')
    .executeTakeFirst();
    
  if (!room) return false;
  
  // Check if user is specifically a community admin (not just a moderator)
  const member = await db
    .selectFrom('members')
    .where('user_Id', '=', userId)
    .where('communityId', '=', room.community_id)
    .where('role', '=', 'admin')
    .select('id')
    .executeTakeFirst();
    
  return !!member;
}

/**
 * Get all chat room permissions for a user in a specific community
 */
export async function getChatRoomPermissions(userId: string, communityId: string) {
  const canCreate = await canCreateChatRoom(userId, communityId);
  return {
    canCreate
  };
}

/**
 * Get permissions for a specific chat room
 */
export async function getSpecificChatRoomPermissions(userId: string, roomId: string) {
  const [canUpdate, canDelete] = await Promise.all([
    canUpdateChatRoom(userId, roomId),
    canDeleteChatRoom(userId, roomId)
  ]);
  
  return {
    canUpdate,
    canDelete
  };
}

/**
 * Get all chat permissions for a user in a specific community
 */
export async function getChatPermissions(userId: string, communityId: string) {
  const [canCreate, canRead] = await Promise.all([
    canCreateChatMessage(userId, communityId),
    canReadChatMessages(userId, communityId)
  ]);
  
  return {
    canCreate,
    canRead
  };
}
