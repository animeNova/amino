'use client';

import { CreateGenreAction, createGenreSchema } from '@/app/actions/genre/create';
import { getGenreById, getGenres, GetGenresOptions } from '@/app/actions/genre/get';
import { UpdateGenreAction, updateGenreSchema } from '@/app/actions/genre/update';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useState } from 'react';
import { z } from 'zod';

type UseGenresOptions = {
  initialOptions?: GetGenresOptions;
  communityId?: string;
};

export function useCommunitys(options: UseGenresOptions = {}) {
  const queryClient = useQueryClient();
  const { initialOptions = {}, communityId: id } = options;
  const [filterOptions, setFilterOptions] = useState<GetGenresOptions>(initialOptions);
  
  // Query to fetch posts with the current options
  const genresQuery = useQuery({
    queryKey: ['genres', filterOptions],
    queryFn: () => getGenres(filterOptions),
  });

  //  Query a single post by ID
  const genreQuery = useQuery({
    queryKey: ['genre', id],
    queryFn:async ({ queryKey }) => {
      const [, id] = queryKey as [string, string];
      return  getGenreById(id);
    },
    enabled: !!id, // Only run the query if an ID is provided
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  });
  
  // Mutation to create a post
  const createGenreMutation = useMutation({
    mutationFn: (data: z.infer<typeof createGenreSchema> ) => CreateGenreAction(data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['communitys'] });
    },
  });

  // Mutation to update a post
  const updateGenreMutation = useMutation({
    mutationFn: ({ data, id }: { data: z.infer<typeof updateGenreSchema>; id: string }) => UpdateGenreAction(id, data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['communitys'] });
    },
  });


  
  return {
    genres: genresQuery.data || [],
    genreQuery : genreQuery.data || null,
    createGenre: createGenreMutation.mutate,
    isCreating: createGenreMutation.isPending,
    updateGenre: updateGenreMutation.mutate,
    isUpdating: updateGenreMutation.isPending,
    options,
    setFilterOptions,
    refetchGenres: genresQuery.refetch,
    refetchGenre: genreQuery.refetch,
  };
}
