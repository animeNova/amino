'use client';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useSession } from '@/lib/auth/client';
import { toast } from '@/hooks/use-toast';
import { CreateLikeAction } from '@/app/actions/likes/create';
import { useRouter } from 'next/navigation';

interface LikeProps {
  postId: string;
  likes: number;
  isLiked: boolean;
}

const LikeButton: React.FC<LikeProps> = ({ postId, likes: initialLikes, isLiked: initialIsLiked }) => {
    const { data } = useSession();
    const router = useRouter();
    const [liked, setLiked] = useState<boolean>(initialIsLiked);
    const [localLikes, setLocalLikes] = useState<number>(initialLikes);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async () => {
        if (!data?.session) {
            return toast({
                description: "You must be logged in to like a post",
                variant: "destructive"
            });
        }

        try {
            setIsLoading(true);
            // Optimistic update
            setLiked(!liked);
            setLocalLikes(prev => liked ? prev - 1 : prev + 1);
            
            const response = await CreateLikeAction(postId);
            
            if (!response.success) {
                // Revert optimistic update if failed
                setLiked(liked);
                setLocalLikes(initialLikes || 0);
                throw new Error(response.error || 'Failed to process like');
            }
            
            router.refresh();
        } catch (error) {
            console.error('Error liking post:', error);
            toast({
                description: error instanceof Error ? error.message : "Failed to process like",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Button
                variant="ghost"
                size="sm"
                disabled={isLoading}
                className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    liked ? "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30" : "",
                )}
                onClick={handleLike}
            >
                <Heart
                    className={cn(
                        "h-5 w-5 transition-colors",
                        liked ? "fill-red-500 text-red-500" : "text-muted-foreground",
                    )}
                />
                <span className={cn(
                    "font-medium",
                    liked ? "text-red-500" : "text-muted-foreground"
                )}>
                    {localLikes}
                </span>
            </Button>
        </div>
    )
}

export default LikeButton
