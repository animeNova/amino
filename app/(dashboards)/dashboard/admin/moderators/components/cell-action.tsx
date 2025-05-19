"use client";

import { DropdownMenu ,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {Copy, MoreHorizontal, Trash} from 'lucide-react'
import {useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { ModeratorResult } from "@/app/actions/members/get";
import { deleteMember } from "@/app/actions/members/delete";

interface CellActionProps {
    data : ModeratorResult;
}
export const CellAction : React.FC<CellActionProps> = ({data}) => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState<boolean>(false)
    const {toast} = useToast();
    const router = useRouter()
    
    const onCopy = () => {
        navigator.clipboard.writeText(data?.memberId)
        toast({
            title : "Id Copied!",
            description : "You can now paste it anywhere!",
            variant : "default"
        })
    }
    
    const handleDelete = () => {
            setError(null);
            startTransition(async () => {
            try {
                await deleteMember(data.memberId, data.communityId);
                toast({
                title: "Success",
                description: "Member removed successfully",
                });
                setOpen(false)
                router.refresh();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to remove member");
                toast({
                title: "Error",
                description: "Failed to remove member",
                variant: "destructive",
                });
            }
            });
    }
    if (error) {
        return <div className="flex-1 flex items-center justify-center"><p>Error loading Member: {error}</p></div>;
    }
   
    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={onCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Id
                </DropdownMenuItem>
                <DropdownMenuItem  className="bg-destructive rounded-[2px]" onClick={() => setOpen(true)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <DeleteConfirmationModal
          open={open}
          onOpenChange={setOpen}
          onConfirm={handleDelete}
          title="Delete Member"
          isDeleting={isPending}
          description="Are you sure you want to delete this Member?"
        />
        </>
    )
}