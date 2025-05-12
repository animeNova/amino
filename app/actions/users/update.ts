'use server';

import { db } from "@/db";
import { updateUserSchema } from "@/schemas/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

/**
 * Updates a user's profile information
 * @param userId The ID of the user to update
 * @param data The user data to update
 * @returns Object containing success status and message or error
 */
export async function updateUser(userId: string, data: unknown) {
  try {
    // Validate the input data against our schema
    const validatedData = updateUserSchema.parse(data);
    
    // Update the user in the database
    await db
      .updateTable('user')
      .set({
        name: validatedData.name,
        image: validatedData.image,
        coverImage: validatedData.coverImage,
        bio: validatedData.bio,
        location: validatedData.location,
        website: validatedData.website,
        is_new:false
      })
      .where('id', '=', userId)
      .execute();
    
    // Revalidate the user's profile page to reflect changes
    revalidatePath(`/profile/${userId}`);
    
    return { 
      success: true, 
      message: "Profile updated successfully" 
    };
  } catch (error) {
    console.error("Error updating user:", error);
    
    if (error.name === 'ZodError') {
      return { 
        success: false, 
        error: "Invalid data provided",
        validationErrors: error.errors 
      };
    }
    
    return { 
      success: false, 
      error: "Failed to update profile" 
    };
  }
}

/**
 * Updates the current authenticated user's profile
 * @param data The user data to update
 * @returns Object containing success status and message or error
 */
export async function updateCurrentUser(data: unknown) {
  try {
    const session = await auth.api.getSession({
        headers : await headers()
    });
    
    if (!session || !session.user?.id) {
      return { 
        success: false, 
        error: "You must be logged in to update your profile" 
      };
    }
    
    return updateUser(session.user.id, data);
  } catch (error) {
    console.error("Error updating current user:", error);
    return { 
      success: false, 
      error: "Failed to update profile" 
    };
  }
}

