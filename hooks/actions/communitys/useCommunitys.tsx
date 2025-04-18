'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommunitys ,getCommunityById, GetCommunitiesOptions } from '@/app/actions/community/get';
import { CreateCommunityAction} from '@/app/actions/community/create';
import { UpdateCommunityAction } from '@/app/actions/community/update';
import { useState } from 'react';
import { z } from 'zod';
import { communitySchema } from '@/schemas/schema';

type UseCommunityOptions = {
  initialOptions?: GetCommunitiesOptions;
  communityId?: string;
};

export function useCommunitys(options: UseCommunityOptions = {}) {
  const queryClient = useQueryClient();
  const { initialOptions = {}, communityId: id } = options;
  const [filterOptions, setFilterOptions] = useState<GetCommunitiesOptions>(initialOptions);
  
  // Query to fetch posts with the current options
  const communityssQuery = useQuery({
    queryKey: ['communitys', filterOptions],
    queryFn: () => getCommunitys(filterOptions),
    // Add this to ensure data is never undefined
    initialData: { communities: [], totalCount: 0, hasMore: false },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0 // Consider data stale immediately
  });

  //  Query a single post by ID
  const communityQuery = useQuery({
    queryKey: ['community', id],
    queryFn:async ({ queryKey }) => {
      const [, id] = queryKey as [string, string];
      return  getCommunityById(id);
    },
    enabled: !!id, // Only run the query if an ID is provided
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  });
  
  // Mutation to create a post
  const createCommunityMutation = useMutation({
    mutationFn:async (data: z.infer<typeof communitySchema> ) => await CreateCommunityAction(data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['communitys'] });
    },
  });

  // Mutation to update a post
  const updateCommunityMutation = useMutation({
    mutationFn: ( data : z.infer<typeof communitySchema>) => UpdateCommunityAction(data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['communitys'] });
    },
  });


  
  return {
    result: communityssQuery.data,
    isLoading: communityssQuery.isLoading,
    communityQuery : communityQuery.data || null,
    createCommunity: createCommunityMutation.mutate,
    isCreating: createCommunityMutation.isPending,
    updateCommunity: updateCommunityMutation.mutate,
    isUpdating: updateCommunityMutation.isPending,
    options,
    setFilterOptions,
    refetchCommunitys: communityssQuery.refetch,
    refetchCommunity: communityQuery.refetch,
  };
}
