'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetCommunitiesOptions , getCommunitys ,getCommunityById } from '@/app/actions/community/get';
import { CreateCommunityAction , createCommunitySchema} from '@/app/actions/community/create';
import { UpdateCommunityAction , updateCommunitySchema} from '@/app/actions/community/update';
import { useState } from 'react';
import { z } from 'zod';

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
  const createPostMutation = useMutation({
    mutationFn: (data: z.infer<typeof createCommunitySchema> ) => CreateCommunityAction(data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['communitys'] });
    },
  });

  // Mutation to update a post
  const updatePostMutation = useMutation({
    mutationFn: ({ data, id }: { data: z.infer<typeof updateCommunitySchema>; id: string }) => UpdateCommunityAction(id, data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['communitys'] });
    },
  });


  
  return {
    communitys: communityssQuery.data || [],
    communityQuery : communityQuery.data || null,
    createPost: createPostMutation.mutate,
    isCreating: createPostMutation.isPending,
    updatePost: updatePostMutation.mutate,
    isUpdating: updatePostMutation.isPending,
    options,
    setFilterOptions,
    refetchCommunitys: communityssQuery.refetch,
    refetchCommunity: communityQuery.refetch,
  };
}
