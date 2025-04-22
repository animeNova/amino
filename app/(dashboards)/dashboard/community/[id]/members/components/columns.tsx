"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { MembersResult } from "@/app/actions/members/get"
import UserAvatar from "@/components/ui/user-avatar"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<MembersResult>[] = [

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell : ({row}) => <UserAvatar url={row.original.image} />
  },
  {
    accessorKey: "joined_a",
    header: "joined at",
    cell : ({row}) => <p>{row.original.joined_at?.toLocaleDateString()}</p>
  },
  {
    accessorKey: "approverName",
    header: "approver Name",
    cell : ({row}) => <p>{row.original.joined_at?.toLocaleDateString()}</p>
  },
 
  {
    id : "actions", 
    cell : ({row}) => <CellAction data={row.original} />
}
]
