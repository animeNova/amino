'use server';

import { db } from "@/db";
import { Genre } from "@/db/types";

export interface GetGenresOptions {
    limit?: number;
    offset?: number;
    search?: string;
}

export interface GenreResult {
    id: string;
    name : string;
    description : string;
    created_at : Date;
    created_by : string | null;
}

export interface GetGenresResult {
    genres: GenreResult[];
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
}

export const getGenres = async (options: GetGenresOptions = {}): Promise<GetGenresResult> => {
    // Ensure page is at least 1, then calculate offset
    const page = Math.max(options.offset ?? 1, 1);
    const limit = options.limit ?? 10;
    const offset = (page - 1) * limit;
    const search = options.search ?? null;
    
    try {
        let countQuery = db.selectFrom('genre');
        let query = db.selectFrom('genre')
        .leftJoin('user', 'user.id', 'genre.created_by')
        .select([
            'genre.id',
            'genre.name',
            'genre.description',
            'genre.created_at',
            'user.name as created_by'
        ]);
        
        // Apply search filter to both queries
        if (search) {
            query = query.where('genre.name', 'ilike', `%${search}%`);
        }
        
        const countResult = await countQuery
        .select(eb => eb.fn.count<number>('id').as('count'))
        .executeTakeFirst();
      
        const totalCount = Number(countResult?.count ?? 0);
        query = query
        .limit(limit)
        .offset(offset);
    
        // Execute the main query
        const genres = await query.execute();
        const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

        return {
            genres,
            totalCount,
            hasMore: offset + genres.length < totalCount,
            totalPages
        };
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw new Error('Failed to fetch genres');
    }
}

export const getGenreById = async (id: string): Promise<Genre> => {
    try {
        const genre = await db
            .selectFrom('genre')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();
        if (!genre) {
            throw new Error('Genre not found');
        }
        return genre;
    } catch (error) {
        console.error('Error fetching genre by ID:', error);
        throw new Error('Failed to fetch genre by ID');
    }
}