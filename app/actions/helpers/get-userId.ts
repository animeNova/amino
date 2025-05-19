'use server';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getUserId = async (): Promise<string> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        if (session && session.user && typeof session.user.id === 'string') {
            return session.user.id;
        }
        
        // Throw an error when user is not authenticated
        throw new Error("User not authenticated.");
    } catch (error) {
        // Handle any unexpected errors from auth.api.getSession
        console.error("Error getting user session:", error);
        throw new Error("Failed to get user ID");
    }
}

// Add a non-throwing version that returns null for unauthenticated users
export const getUserIdSafe = async (): Promise<string | null> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        if (session && session.user && typeof session.user.id === 'string') {
            return session.user.id;
        }
        
        return null;
    } catch (error) {
        console.error("Error getting user session:", error);
        return null;
    }
}
