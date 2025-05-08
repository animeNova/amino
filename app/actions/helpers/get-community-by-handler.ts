import { db } from "@/db";

/**
 * Retrieves a community ID by its handle
 * @param handle The community handle to search for
 * @returns The community ID or null if not found
 */
export async function getCommunityByHandler(handle: string): Promise<string | null> {
  if (!handle) {
    return null;
  }
  
  try {
    const result = await db
      .selectFrom("community")
      .where("handle", "=", handle)
      .select(["id"])
      .executeTakeFirst();

    return result?.id || null;
  } catch (error) {
    console.error("Error fetching community ID by handle:", error);
    // Instead of throwing a generic error, we return null
    // This allows the caller to handle the case gracefully
    return null;
  }
}