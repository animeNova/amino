'use server';

import { db } from "@/db";
import { Genre } from "@/db/types";

export interface GetGenresOptions {
    limit?: number;
    offset?: number;
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
}

export const getGenres = async (options: GetGenresOptions = {}): Promise<GetGenresResult> => {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
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
        
        const countResult = await countQuery
        .select(eb => eb.fn.count<number>('id').as('count'))
        .executeTakeFirst();
      
        const totalCount = Number(countResult?.count ?? 0);
        query = query
        .limit(limit)
        .offset(offset);
    
        // Execute the main query
        const genres = await query.execute();
        
        return {
            genres,
            totalCount,
            hasMore: offset + genres.length < totalCount,
        };
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw new Error('Failed to fetch genres');
    }
}

export const getGenreById = async (id: string): Promise<Genre | null | undefined> => {
    try {
        const genre = await db
            .selectFrom('genre')
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();
        return genre;
    } catch (error) {
        console.error('Error fetching genre by ID:', error);
        throw new Error('Failed to fetch genre by ID');
    }
}