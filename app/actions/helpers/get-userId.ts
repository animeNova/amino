'use server';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getUserId = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        if (session && session.user && typeof session.user.id === 'string') {
            return session.user.id;
        }
        
        // Return a more structured error for unauthorized users
        throw new Error("User not authenticated");
    } catch (error) {
        // Provide more context in the error message
        console.error("Error getting user session:", error);
        if (error instanceof Error) {
            throw error; // Rethrow the original error with its message
        } else {
            throw new Error("Failed to get user ID: Unknown error");
        }
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

// Add a version that works in both static and dynamic contexts
export const getUserIdWithFallback = async (): Promise<{userId: string | null, isAuthenticated: boolean}> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        return {
            userId: session?.user?.id || null,
            isAuthenticated: !!session?.user
        };
    } catch (error) {
        // This likely means we're in a static context
        console.warn("Could not get user session dynamically:", error);
        return {
            userId: null,
            isAuthenticated: false
        };
    }
}
