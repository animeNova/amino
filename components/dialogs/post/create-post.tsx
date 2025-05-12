"use client"
import type React from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import PostForm from "../../forms/post-form"
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { CreatePostAction } from "@/app/actions/posts/create";
import useCreatePostDialogStore from "@/store/useCreatePostDialog";

export function CreatePostDialog() {
  const {isOpen,close} = useCreatePostDialogStore()

  const params = useParams();
  const communityHandler = params.slug as string;
  const router = useRouter()
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  if(error){
    toast({title:"error", description:error});
  }
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col overflow-y-scroll">
        <DialogTitle>Create Post</DialogTitle>
        <PostForm 
        onSubmit={(data) => {
                setError(null);
                startTransition(async () => {
                  try {
                    await CreatePostAction(communityHandler,data)
                    toast({title:"success" , description:"Post created successfully"});
                    router.refresh();
                    close();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to create Post");
                    toast({title:"error" , description:"Failed to create Post"});                  }
                });
              }}
              isEditMode={false}
              isLoading={isPending} 

               />
      </DialogContent>
    </Dialog>
  )
}
