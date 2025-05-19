'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Button } from './button';
import { useSession } from '@/lib/auth/client';
import { followUser, unfollowUser, isFollowing } from '@/app/actions/follower/action';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import useLoginDialogStore from '@/store/useLoginDialog';

interface FollowButtonProps {
  profileUserId: string;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  profileUserId,
  className,
}) => {
  const { data: sessionData, isPending } = useSession(); // Renamed isPending to sessionStatus for clarity
  const { openLogin } = useLoginDialogStore();
  const router = useRouter();

  const [isFollowingState, setIsFollowingState] = useState(false);
  const [isLoadingInitialStatus, setIsLoadingInitialStatus] = useState(true);
  const [isTogglePending, startToggleTransition] = useTransition();

  const currentUserId = sessionData?.user?.id;

  useEffect(() => {
    if (!isPending && currentUserId && profileUserId && currentUserId !== profileUserId) {
      setIsLoadingInitialStatus(true);
      isFollowing(profileUserId)
        .then(response => {
          if (response.success) {
            setIsFollowingState(response.data);
          } else {
            toast({
              title: "Error checking follow status",
              description: response.error || "Could not determine follow status.",
              variant: "destructive",
            });
          }
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to check follow status.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoadingInitialStatus(false);
        });
    } else if (!isPending) {
      // If not authenticated or it's the user's own profile, no need to load status
      setIsLoadingInitialStatus(false);
    }
  }, [profileUserId, currentUserId, isPending]);

  if (isPending) {
    return <Button size={'lg'} disabled className={cn("w-24", className)}>Loading...</Button>;
  }

  // Don't show follow button for own profile
  if (!currentUserId || currentUserId === profileUserId) {
    return null;
  }

  const handleFollowToggle = async () => {
    if (!currentUserId) {
      openLogin(); // Open login dialog if not logged in
      return;
    }

    startToggleTransition(async () => {
      const action = isFollowingState ? unfollowUser : followUser;
      const optimisticIsFollowing = !isFollowingState;
      setIsFollowingState(optimisticIsFollowing); // Optimistic update

      try {
        const response = await action(profileUserId);
        if (!response.success) {
          setIsFollowingState(!optimisticIsFollowing); // Revert optimistic update
          toast({
            title: `Error ${isFollowingState ? 'following' : 'unfollowing'} user`, // Text should reflect the action attempted before optimistic update
            description: response.error ?? "An unexpected error occurred.",
            variant: "destructive",
          });
        } else {
          toast({
            title: `Successfully ${optimisticIsFollowing ? 'followed' : 'unfollowed'} user.`,
          });
          router.refresh(); // Refresh the page to update counts etc.
        }
      } catch (error) {
        setIsFollowingState(!optimisticIsFollowing); // Revert optimistic update
        toast({
          title: "Operation Failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const buttonText = () => {
    if (isLoadingInitialStatus) return 'Loading...';
    if (isTogglePending) return isFollowingState ? 'Following...' : 'Unfollowing...'; // Text reflects the state *after* optimistic update
    return isFollowingState ? 'Unfollow' : 'Follow';
  };

  return (
    <div>
      <Button
        size={'lg'}
        onClick={handleFollowToggle}
        disabled={isTogglePending || isLoadingInitialStatus || isPending}
        variant={isFollowingState ? 'outline' : 'default'}
        className={className}
      >
        {buttonText()}
      </Button>
    </div>
  );
};

export default FollowButton;
