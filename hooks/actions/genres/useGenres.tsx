'use client';

import { CreateGenreAction } from '@/app/actions/genre/create';
import { deleteGenre } from '@/app/actions/genre/delete';
import { getGenreById, getGenres, GetGenresOptions } from '@/app/actions/genre/get';
import { UpdateGenreAction, } from '@/app/actions/genre/update';
import { genreSchema } from '@/schemas/schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useState } from 'react';
import { z } from 'zod';

type UseGenresOptions = {
  initialOptions?: GetGenresOptions;
  genreId?: string;
};

export function useGenres(options: UseGenresOptions = {}) {
  const queryClient = useQueryClient();
  const { initialOptions = {}, genreId: id } = options;
  const [filterOptions, setFilterOptions] = useState<GetGenresOptions>(initialOptions);
  
  // Query to fetch posts with the current options
  const genresQuery = useQuery({
    queryKey: ['genres', filterOptions],
    queryFn: () => getGenres(filterOptions),
    staleTime: 0 ,// Consider data stale immediately
    refetchOnMount: true,
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
    refetchOnMount: true,

  });
  
  // Mutation to create a post
  const createGenreMutation = useMutation({
    mutationFn: (data: z.infer<typeof genreSchema> ) => CreateGenreAction(data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
  });

  // Mutation to update a post
  const updateGenreMutation = useMutation({
    mutationFn: (data : z.infer<typeof genreSchema>) => UpdateGenreAction(data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
  });

  const deleteGenreMutation = useMutation({
    mutationFn: (id : string) => deleteGenre(id),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      // Force refetch the genres list immediately
      genresQuery.refetch();
    },
  });


  
  return {
    results: genresQuery.data,
    isLoading: genresQuery.isPending,
    genreQuery : genreQuery.data || null,
    isLoadingGenre: genreQuery.isFetching,
    createGenre: createGenreMutation.mutate,
    isError : createGenreMutation.isError || updateGenreMutation.isError,
    isCreating: createGenreMutation.isPending,
    updateGenre: updateGenreMutation.mutate,
    isUpdating: updateGenreMutation.isPending,
    deleteGenre: deleteGenreMutation.mutate,
    isDeleting: deleteGenreMutation.isPending,
    options,
    setFilterOptions,
    refetchGenres: genresQuery.refetch,
    refetchGenre: genreQuery.refetch,
    error : createGenreMutation.error || updateGenreMutation.error,
    isSuccess : createGenreMutation.isSuccess || updateGenreMutation.isSuccess,
  };
}
