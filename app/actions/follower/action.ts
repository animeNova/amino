'use server';

import { db } from "@/db";
import { getUserId } from "../helpers/get-userId";
import { revalidatePath } from "next/cache";

// Helper types for server action responses
type ActionSuccessResponse<TData> = { success: true; data: TData; message?: string };
type ActionErrorResponse = { success: false; error: string; message?: string }; // Added optional message to error
type ActionResult<TData> = ActionSuccessResponse<TData> | ActionErrorResponse;

/**
 * Allows the current authenticated user to follow another user.
 * @param userIdToFollow The ID of the user to follow.
 * @returns An object indicating success or failure.
 */
export async function followUser(userIdToFollow: string): Promise<ActionResult<undefined> | ActionErrorResponse> {
  try {
    const currentUserId = await getUserId();

    if (currentUserId === userIdToFollow) {
      return { success: false, error: "You cannot follow yourself." };
    }

    // Check if the follow relationship already exists
    const existingFollow = await db
      .selectFrom('followers')
      .where('follower_id', '=', currentUserId)
      .where('following_id', '=', userIdToFollow)
      .select('id')
      .executeTakeFirst();

    if (existingFollow) {
      return { success: false, error: "You are already following this user." };
    }

    await db
      .insertInto('followers')
      .values({
        follower_id: currentUserId,
        following_id: userIdToFollow,
      })
      .execute();

    revalidatePath(`/profile/${userIdToFollow}`);
    revalidatePath(`/profile/${currentUserId}`);
    // Explicitly return undefined for data when not applicable for success
    return { success: true, data: undefined, message: "Successfully followed user." };

  } catch (error) {
    console.error('Error following user:', error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to follow user." };
  }
}

/**
 * Allows the current authenticated user to unfollow another user.
 * @param userIdToUnfollow The ID of the user to unfollow.
 * @returns An object indicating success or failure.
 */
export async function unfollowUser(userIdToUnfollow: string): Promise<ActionResult<undefined> | ActionErrorResponse> {
  try {
    const currentUserId = await getUserId();

    if (currentUserId === userIdToUnfollow) {
      return { success: false, error: "You cannot unfollow yourself." };
    }

    const result = await db
      .deleteFrom('followers')
      .where('follower_id', '=', currentUserId)
      .where('following_id', '=', userIdToUnfollow)
      .executeTakeFirst();

    if (Number(result.numDeletedRows) === 0) { // Kysely's numDeletedRows is bigint
        return { success: false, error: "You are not following this user." };
    }

    revalidatePath(`/profile/${userIdToUnfollow}`);
    revalidatePath(`/profile/${currentUserId}`);
    return { success: true, data: undefined, message: "Successfully unfollowed user." };

  } catch (error) {
    console.error('Error unfollowing user:', error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to unfollow user." };
  }
}

/**
 * Gets a list of users who are following the specified userId.
 * @param userId The ID of the user whose followers are to be fetched.
 * @returns A list of follower users or an error object.
 */
export async function getFollowers(userId: string) {
  try {
    const followers = await db
      .selectFrom('followers')
      .innerJoin('user', 'user.id', 'followers.follower_id')
      .where('followers.following_id', '=', userId)
      .select(['user.id', 'user.name', 'user.image']) // Added user.username
      .orderBy('followers.created_at', 'desc')
      .execute();
    return { success: true, data: followers };
  } catch (error) {
    console.error('Error fetching followers:', error);
    return { success: false, error: "Failed to fetch followers." };
  }
}

/**
 * Gets a list of users whom the specified userId is following.
 * @param userId The ID of the user whose following list is to be fetched.
 * @returns A list of users being followed or an error object.
 */
export async function getFollowing(userId: string) {
  try {
    const following = await db
      .selectFrom('followers')
      .innerJoin('user', 'user.id', 'followers.following_id')
      .where('followers.follower_id', '=', userId)
      .select(['user.id', 'user.name','user.image']) // Added user.username
      .orderBy('followers.created_at', 'desc')
      .execute();
    return { success: true, data: following };
  } catch (error) {
    console.error('Error fetching following list:', error);
    return { success: false, error: "Failed to fetch following list." };
  }
}

/**
 * Checks if the current authenticated user is following a specific user.
 * @param userIdToCheck The ID of the user to check if being followed by the current user.
 * @returns An object indicating if the user is being followed or an error object.
 */
export async function isFollowing(userIdToCheck: string): Promise<ActionResult<boolean>> {
  try {
    const currentUserId = await getUserId(); // This should throw if user is not authenticated

    // This specific check might be redundant if getUserId throws on no user,
    // but kept for safety if getUserId's behavior changes (e.g., to getUserIdSafe)
    if (!currentUserId) {
        // This case should ideally not be hit if getUserId throws for unauthenticated users.
        // If getUserId can return null/undefined, this path is valid.
        return { success: true, data: false, message: "User not authenticated." };
    }

    if (currentUserId === userIdToCheck) {
      return { success: true, data: false, message: "Cannot check follow status for oneself." };
    }

    const followStatus = await db
      .selectFrom('followers')
      .where('follower_id', '=', currentUserId)
      .where('following_id', '=', userIdToCheck)
      .select('id')
      .executeTakeFirst();

    return { success: true, data: !!followStatus };
  } catch (error) {
    // This catch block will handle errors from getUserId (e.g., user not found/authenticated)
    // or DB errors.
    console.error('Error checking follow status:', error);
    // Ensure the error response matches ActionErrorResponse
    return { success: false, error: "Failed to check follow status." };
  }
}