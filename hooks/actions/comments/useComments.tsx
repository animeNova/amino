'use client';

import { createComment } from '@/app/actions/comments/create';
import { getNestedComments , getCommentThread} from '@/app/actions/comments/get';
import { updateCommentAction } from '@/app/actions/comments/update';
import { GetCommunitiesOptions } from '@/app/actions/community/get';
import { createCommentSchema, updateCommentSchema } from '@/schemas/schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useState } from 'react';
import { z } from 'zod';

type UseCommentsOptions = {
  initialOptions?: GetCommunitiesOptions;
  postId?: string;
  commentId ?: string;
};

export function useComments(options: UseCommentsOptions = {}) {
  const queryClient = useQueryClient();
  const { initialOptions = {}, commentId,postId } = options;
  const [filterOptions, setFilterOptions] = useState<GetCommunitiesOptions>(initialOptions);
  
  // Query to fetch posts with the current options
  const commentsQuery = useQuery({
    queryKey: ['comments', filterOptions],
    queryFn: () => getNestedComments(postId!,filterOptions),
  });

  //  Query a single post by ID
  const commentQuery = useQuery({
    queryKey: ['comment', commentId],
    queryFn:async ({ queryKey }) => {
      const [, id] = queryKey as [string, string];
      return  getCommentThread(id);
    },
    enabled: !!commentId, // Only run the query if an ID is provided
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
  });
  
  // Mutation to create a post
  const createCommentMutation = useMutation({
    mutationFn: (data : z.infer<typeof createCommentSchema>) => createComment(postId!,data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  // Mutation to update a post
  const updateCommentMutation = useMutation({
    mutationFn: ({ data, id }: { data: z.infer<typeof updateCommentSchema>; id: string }) => updateCommentAction(id, data),
    onSuccess: () => {
      // Invalidate the posts query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['comment'] });
    },
  });


  
  return {
    comments: commentsQuery.data ,
    isErrorComments: commentsQuery.isError,
    isLoadingComments: commentsQuery.isLoading,
    commentQuery : commentQuery.data || null,
    isCommentError: commentQuery.isError,
    isCommentLoading: commentQuery.isLoading,
    createComment: createCommentMutation.mutate,
    isCreating: createCommentMutation.isPending,
    updateComment: updateCommentMutation.mutate,
    isUpdating: updateCommentMutation.isPending,
    options,
    setFilterOptions,
    refetchComments: commentsQuery.refetch,
    refetchComment: commentQuery.refetch,
  };
}
