"use client"
import type React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import PostForm from "../../forms/post-form"
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { UpdatePostAction } from "@/app/actions/posts/update";
import { getPostById } from "@/app/actions/posts/get";
import { Loader2Icon } from "lucide-react";

// Add the interface for post data
interface PostData {
  title: string;
  image: string;
  content: string;
  tags: string[];
  id: string;
}
interface UpdatePostDialogProps {
    postId: string
    isOpen: boolean
    onClose: () => void
}

export function UpdatePostDialog({
    postId,
    isOpen,
    onClose,
}: Readonly<UpdatePostDialogProps>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [postData, setPostData] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen && postId) {
      setIsLoading(true);
      
      const fetchPostData = async () => {
        try {
          const post = await getPostById(postId);
          
          if (post) {
            setPostData({
              id: post.post_id,
              title: post.post_title,
              content: post.post_content,
              image: post.post_image,
              tags: post.post_tags || [],
            });
          } else {
            setError("Post not found");
            toast({
              title: "Error",
              description: "Post not found",
              variant: "destructive"
            });
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch post");
          toast({
            title: "Error",
            description: "Failed to fetch post data",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchPostData();
    }
  }, [isOpen, postId]);
  
  if (error) {
    toast({ title: "Error", description: error });
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col overflow-y-scroll">
        <DialogTitle>Update Post</DialogTitle>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2Icon className="animate-spin w-8 h-8" />
          </div>
        ) : postData ? (
          <PostForm 
            onSubmit={(data) => {
              setError(null);
              startTransition(async () => {
                try {
                  const response = await UpdatePostAction(postData.id, data);
                  
                  if (response.success) {
                    toast({
                      title: "Success",
                      description: response.message || "Post updated successfully"
                    });
                    router.refresh();
                    onClose();
                  } else {
                    setError(response.message || "Failed to update post");
                    toast({
                      title: "Error",
                      description: response.message || "Failed to update post",
                      variant: "destructive"
                    });
                  }
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Failed to update post");
                  toast({
                    title: "Error",
                    description: "Failed to update post",
                    variant: "destructive"
                  });
                }
              });
            }}
            isEditMode={true}
            isLoading={isPending} 
            initialData={postData}
          />
        ) : (
          <div className="flex items-center justify-center p-8">
            <p>Failed to load post data. Please try again.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
