'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetLikeByPostId } from '@/app/actions/likes/get';
import { CreateLikeAction } from '@/app/actions/likes/create';

type UseLikesOptions = {
  PostId: string;
}

export function useUserLikes(options: UseLikesOptions) {
  const queryClient = useQueryClient();
  const { PostId } = options;

  // Query to fetch likes with the current userId
  const likeQuery = useQuery({
    queryKey: ['likes', PostId],
    queryFn: () => GetLikeByPostId(PostId),
  });

    

  // Mutation to create a like
  const createLikeMutation = useMutation({
    mutationFn: () => CreateLikeAction(PostId),
    onSuccess: () => {
      // Invalidate the likes query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['likes'] });
    },
  });



  return {
       // List-related properties and methods
       like: likeQuery.data || null,
       isLoadingPosts: likeQuery.isLoading,
       isErrorPosts: likeQuery.isError,
       refetchLike: likeQuery.refetch,
 
       // Mutation properties and methods
       createLike: createLikeMutation.mutate,
       isCreating: createLikeMutation.isPending,
       createError: createLikeMutation.error,
       createResult: createLikeMutation.data,
  };
}
