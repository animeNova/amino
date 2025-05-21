"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import Image from "next/image"
import { User } from "@/db/types"
import { useSession } from "@/lib/auth/client"
import { UserRoleDropdown } from "@/components/ui/user-role-dropdown"
import UserAvatar from "@/components/ui/user-avatar"
import { GetPostsResult, PostQuery } from "@/app/actions/posts/get"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<PostQuery>[] = [

  {
    accessorKey: "post_title",
    header: "Title",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell : ({row}) => <UserAvatar url={row.original.post_image} />
  },
  {
    accessorKey: "community_name",
    header: "Community Name",
  },
  {
    accessorKey: "Community Image",
    header: "Image",
    cell : ({row}) => <UserAvatar url={row.original.community_image} />
  },
  {
    accessorKey: "likeCount",
    header: "Likes",
  },
  {
    accessorKey: "commentCount",
    header: "Comments",
  },
 
  {
    accessorKey: "created_at",
    header: "Created At",
    cell : ({row}) => <p>{row.original.post_created_at?.toLocaleDateString()}</p>
  },
 
  {
    id : "actions", 
    cell : ({row}) => <CellAction data={row.original} />
}
]
