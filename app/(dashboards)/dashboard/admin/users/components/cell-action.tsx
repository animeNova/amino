"use client";

import { DropdownMenu ,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {Copy, Edit, MoreHorizontal, Trash} from 'lucide-react'
import {useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { User } from "@/db/types";
import { admin, useSession } from "@/lib/auth/client";
import { Select , SelectTrigger , SelectValue , SelectContent , SelectGroup , SelectLabel , SelectItem } from "@/components/ui/select";

interface CellActionProps {
    data : User;
}
export const CellAction : React.FC<CellActionProps> = ({data}) => {
    const {data : user} = useSession();
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
          const deleteUser =  await admin.removeUser({
                userId: data.id,
            });
            if(deleteUser.data?.success){
                toast({
                    title: "Success",
                    description: "User Deleted successfully",
                    });
                setOpen(false)
                router.refresh()
            }
            else {
                toast({
                    title: "Info",
                    description: deleteUser.error?.message,
                });
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete user");
            toast({
            title: "Error",
            description: "Failed to delete user",
            variant: "destructive",
            });
        }
        });
    }

    if (error) {
        return <div className="flex-1 flex items-center justify-center"><p>Error deleting User: {error}</p></div>;
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
                {
                    user?.user.role === 'owner' && (
                    <DropdownMenuItem  className="bg-destructive rounded-[2px]" onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                    )
                }
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