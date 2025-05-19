import { db } from "@/db";
import { CommunityResult } from "../community/get";


/**
 * Creates a reusable base query for fetching community data
 * @param queryBuilder The database query builder instance
 * @returns A configured query builder with common community fields selected
 */
export function createCommunityBaseQuery(queryBuilder = db)  {
  return queryBuilder.selectFrom('community')
    .leftJoin('genre', 'genre.id', 'community.genre_id')
    .leftJoin('user', 'community.created_by', 'user.id')
    .select([
      'community.id as id',
      'community.name as name',
      'community.description',
      'community.image',
      'community.language',
      'community.handle',
      'community.banner',
      'community.visibility',
      'community.created_at',
      eb => eb.case()
        .when(eb.ref('user.name'), 'is not', null)
        .then(eb.ref('user.name'))
        .else('Unknown User')
        .end()
        .as('created_by'),
      'genre.name as genre_name',
      'genre.id as genre_id',
      // Use a subquery to count members instead of a join
      eb => eb.selectFrom('members')
      .whereRef('members.communityId', '=', 'community.id')
      .select(eb => eb.fn.count('id').as('count'))
      .as('memberCount'),
    ])
    .where('community.id', 'is not', null)  // Ensure no null IDs
    .where('community.name', 'is not', null)  // Ensure no null names
    .where('community.created_by', 'is not', null);  // Specify the table name to avoid ambiguity
}



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

    return result?.id ?? null;
  } catch (error) {
    console.error("Error fetching community ID by handle:", error);
    // Instead of throwing a generic error, we return null
    // This allows the caller to handle the case gracefully
    return null;
  }
}