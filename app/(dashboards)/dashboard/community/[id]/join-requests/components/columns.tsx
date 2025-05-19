"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { MembersResult } from "@/app/actions/members/get"
import UserAvatar from "@/components/ui/user-avatar"
import { JoinRequestResult } from "@/app/actions/join-requests/get"
import ActionButtons from "./action-buttons"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<JoinRequestResult>[] = [

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
    accessorKey: "status",
    header: "Status"
  },
  {
    accessorKey: "requested_at",
    header: "requested At",
    cell : ({row}) => <p>{row.original.requested_at.toLocaleDateString()}</p>
  },
  {
    id : "action buttons", 
    cell : ({row}) => {
      return (
        <>
        {row.original.status === 'pending' && (
             <div className="flex gap-2">
             <ActionButtons type="accepted" id={row.original.id} />
             <ActionButtons type="reject" id={row.original.id} />
           </div>
        )}
     
        </>
      )
  },
  },
  {
    id : "actions", 
    cell : ({row}) => <CellAction data={row.original} />
  }
]
