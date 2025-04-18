'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { getPostById, getPostsByCommunity, GetPostsOptions } from '../../../app/actions/posts/get';
import { CreatePostAction } from '@/app/actions/posts/create';
import { useState } from 'react';
import { UpdatePostAction } from '@/app/actions/posts/update';
import { createPostSchema, updatePostSchema } from '@/schemas/schema';

type UsePostsOptions = {
  initialOptions?: GetPostsOptions;
  PostId?: string;
  communityId ?:string;
};

export function usePosts(options: UsePostsOptions = {}) {
  const queryClient = useQueryClient();
  const { initialOptions = {} ,PostId,communityId } = options;
  const [filterOptions, setFilterOptions] = useState<GetPostsOptions>(initialOptions);

  // Query to fetch posts with the current options
  const postsQuery = useQuery({
    queryKey: ['posts', options],
    queryFn: () => getPostsByCommunity(communityId!,initialOptions),
  });
  // Query to fetch a single post by ID
    const postByIdQuery = useQuery({
      queryKey: ['post', PostId],
      queryFn: () => getPostById(PostId!),
      enabled: !!PostId, // Only run if an ID is provided
    });
    
    // Helper to prefetch a post by ID (useful for hover intents, etc.)
    const prefetchPost = (postId: string) => {
      return queryClient.prefetchQuery({
        queryKey: ['post', postId],
        queryFn: () => getPostById(postId),
      });
    };

  // Mutation to create a post
  const createPostMutation = useMutation({
    mutationFn: (data: z.infer<typeof createPostSchema> ) => CreatePostAction(communityId!,data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Mutation to update a post
  const updatePostMutation = useMutation({
    mutationFn: ({ data, id }: { data: z.infer<typeof updatePostSchema>; id: string }) => UpdatePostAction(id, data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['communitys'] });
    },
  });


  
  return {
       // List-related properties and methods
       posts: postsQuery.data,
       isLoadingPosts: postsQuery.isLoading,
       isErrorPosts: postsQuery.isError,
       postsError: postsQuery.error,
       refetchPosts: postsQuery.refetch,
       filterOptions,
       setFilterOptions,
       
       // Individual post properties and methods
       post: postByIdQuery.data || null,
       isLoadingPost: postByIdQuery.isLoading,
       isErrorPost: postByIdQuery.isError || (postByIdQuery.data && !postByIdQuery.isSuccess),
       postError: postByIdQuery.error ,
       refetchPost: postByIdQuery.refetch,
       getPostById,
       prefetchPost,
       
       // Mutation properties and methods
       createPost: createPostMutation.mutate,
       isCreating: createPostMutation.isPending,
       createError: createPostMutation.error,
       createResult: createPostMutation.data,

       updatePosr: updatePostMutation.mutate,
       isUpdating: updatePostMutation.isPending,
       updateError: updatePostMutation.error,
       updateResult: updatePostMutation.data,
  };
}
