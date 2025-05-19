"use client";

import { DropdownMenu ,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {Copy, Edit, MoreHorizontal, Trash, User} from 'lucide-react'
import {useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { deleteCommunity } from "@/app/actions/community/delete";
import { MembersResult } from "@/app/actions/members/get";
import { MemberDetailsDialog } from "./member-details-dialog";

interface CellActionProps {
    data : MembersResult;
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
    
    // const handleDelete = () => {
    //     setError(null);
    //     startTransition(async () => {
    //     try {
    //         await deleteCommunity(data.id);
    //         toast({
    //         title: "Success",
    //         description: "Community updated successfully",
    //         });
    //         setOpen(false)
    //     } catch (err) {
    //         setError(err instanceof Error ? err.message : "Failed to update Community");
    //         toast({
    //         title: "Error",
    //         description: "Failed to update Community",
    //         variant: "destructive",
    //         });
    //     }
    //     });
    // }
    // if (error) {
    //     return <div className="flex-1 flex items-center justify-center"><p>Error loading Community: {error}</p></div>;
    // }
   
    return (
        <div>
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
                <DropdownMenuItem onClick={() => setOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
        <MemberDetailsDialog open={open} onOpenChange={setOpen} onAction={() => {}} member={{
           id: 12345,
           name: "Alex Johnson",
           username: "alexj42",
           email: "alex.johnson@example.com",
           avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
           role: "moderator",
           status: "active",
           joinDate: "March 15, 2023",
           activityLevel: 87,
           community: "Tech Enthusiasts",
           bio: "Software developer with a passion for AI and machine learning. I love contributing to open-source projects and helping new members.",
           location: "Seattle, WA",
           posts: 142,
           comments: 378,
           followers: 256,
           following: 124,
           recentActivity: [
             {
               type: "post",
               content: "Shared a new article about the latest developments in quantum computing",
               date: "2 hours ago"
             },
             {
               type: "comment",
               content: "Replied to a discussion about best practices for React component architecture",
               date: "5 hours ago"
             },
             {
               type: "moderation",
               content: "Approved 5 new posts in the frontend development channel",
               date: "Yesterday"
             },
             {
               type: "like",
               content: "Liked a tutorial on building serverless applications with AWS Lambda",
               date: "2 days ago"
             },
             {
               type: "comment",
               content: "Provided feedback on a member's first contribution to the community",
               date: "3 days ago"
             }
           ]

        }}/>
        </div>
    )
}