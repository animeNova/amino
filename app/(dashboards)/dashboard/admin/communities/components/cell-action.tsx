"use client";

import { DropdownMenu ,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {Copy, Edit, MoreHorizontal, Trash} from 'lucide-react'
import {useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { CommunityResult } from "@/app/actions/community/get";
import { deleteCommunity } from "@/app/actions/community/delete";

interface CellActionProps {
    data : CommunityResult;
}
export const CellAction : React.FC<CellActionProps> = ({data}) => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const [open, setOpen] = useState<boolean>(false)
    const {toast} = useToast();
    const router = useRouter()
    
    const onCopy = () => {
        navigator.clipboard.writeText(data?.id)
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
            await deleteCommunity(data.id);
            toast({
            title: "Success",
            description: "Community updated successfully",
            });
            setOpen(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update Community");
            toast({
            title: "Error",
            description: "Failed to update Community",
            variant: "destructive",
            });
        }
        });
    }
    if (error) {
        return <div className="flex-1 flex items-center justify-center"><p>Error loading Community: {error}</p></div>;
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
                <DropdownMenuItem onClick={() => {
                    router.push(`communities/update/${data.id}`)
                }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Update
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
          title="Delete Community"
          isDeleting={isPending}
          description="Are you sure you want to delete this community?"
        />
        </>
    )
}