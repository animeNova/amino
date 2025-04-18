"use client";

import { DropdownMenu ,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {Copy, Edit, MoreHorizontal, Trash} from 'lucide-react'
import {useRouter } from "next/navigation";
import { useState } from "react";
import { GenreResult } from "@/app/actions/genre/get";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { useGenres } from "@/hooks/actions/genres/useGenres";

interface CellActionProps {
    data : GenreResult;
}
export const CellAction : React.FC<CellActionProps> = ({data}) => {
    const {deleteGenre, isDeleting} = useGenres()
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
        try {
            deleteGenre(data.id);
            toast({
                title: "Genre deleted",
                description: "The genre has been successfully deleted.",
                variant: "default"
            });
            setOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete the genre. Please try again.",
                variant: "destructive"
            });
            (`Exception while doing something: ${error}`);
        }
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
                    router.push(`genres/update/${data.id}`)
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
          title="Delete Genre"
          isDeleting={isDeleting}
          description="Are you sure you want to delete this genre?"
        />
        </>
    )
}