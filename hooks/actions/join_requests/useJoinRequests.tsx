'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useState } from 'react';
import { getJoinRequestById, getJoinRequests, GetJoinRequestsOptions , getJoinRequestByUserId} from '@/app/actions/join-requests/get';
import { CreateJoinRequest } from '@/app/actions/join-requests/create';
import { UpdateJoinRequest, updateJoinRequestSchema } from '@/app/actions/join-requests/update';

type UseJoinRequestsOptions = {
  initialOptions?: GetJoinRequestsOptions;
  communityId ?:string;
  JoinRequestId ?:string;
};

export function useJoinRequests(options: UseJoinRequestsOptions = {}) {
  const queryClient = useQueryClient();
  const { initialOptions = {} ,communityId,JoinRequestId } = options;
  const [filterOptions, setFilterOptions] = useState<GetJoinRequestsOptions>(initialOptions);

    // Query to fetch join requests with the current options
    const joinRequestsQuery = useQuery({
        queryKey: ['join-requests', options],
        queryFn: () => getJoinRequests(communityId!,initialOptions),
        enabled : !!communityId,
    });
    // Query to fetch a single join request by ID
    const requestByIdQuery = useQuery({
      queryKey: ['join-request', JoinRequestId],
      queryFn: () => getJoinRequestById(JoinRequestId!),
      enabled: !!JoinRequestId, // Only run if an ID is provided
    });

    // Query to fetch user join requests
    const userJoinRequestsQuery = useQuery({
      queryKey: ['user-join-requests'],
      queryFn: () => getJoinRequestByUserId(),
    });


  // Mutation to create a join request
  const createJoinRequestMutation = useMutation({
    mutationFn: () => CreateJoinRequest(communityId!),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['join-requests'] });
    },
  });

  // Mutation to update a join request
  // admin or moderator can update join request status 
  const updateJoinRequestMutation = useMutation({
    mutationFn: ({ data, id }: { data: z.infer<typeof updateJoinRequestSchema>; id: string }) => UpdateJoinRequest(id, data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['join-request'] });
    },
  });


  
  return {
       requests: joinRequestsQuery.data,
       isLoadingRequests: joinRequestsQuery.isLoading,
       isErrorRequests: joinRequestsQuery.isError,

       requestById: requestByIdQuery.data,
       isLoadingRequest: requestByIdQuery.isLoading,
       isErrorRequest: requestByIdQuery.isError,
       userJoinRequests: userJoinRequestsQuery.data,
       isLoadingUserJoinRequests: userJoinRequestsQuery.isLoading,
       isErrorUserJoinRequests: userJoinRequestsQuery.isError,

       filterOptions,
       setFilterOptions,
       // Helper properties and methods
       
       
       // Mutation properties and methods
       createJoinRequest: createJoinRequestMutation.mutate,
       isCreating: createJoinRequestMutation.isPending,
       createError: createJoinRequestMutation.error,
       createResult: createJoinRequestMutation.data,

       updateJoinRequest: updateJoinRequestMutation.mutate,
       isUpdating: updateJoinRequestMutation.isPending,
       updateError: updateJoinRequestMutation.error,
       updateResult: updateJoinRequestMutation.data,

  };
}
