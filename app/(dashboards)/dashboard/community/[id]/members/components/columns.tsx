"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { MembersResult } from "@/app/actions/members/get"
import UserAvatar from "@/components/ui/user-avatar"
import { MemberRoleDropdown } from "@/components/ui/member-role-dropdown copy"

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
    cell : ({row}) => <UserAvatar url={row.original.image} className="size-12" />
  },
  {
    accessorKey: "role",
    header: "Role",
    cell : ({row}) => <MemberRoleDropdown memberId={row.original.id} communityId={row.original.communityId}  currentRole={row.original.role} />
  },
  {
    accessorKey: "joined_a",
    header: "joined at",
    cell : ({row}) => <p>{row.original.joined_at?.toLocaleDateString()}</p>
  },
  {
    accessorKey: "approverName",
    header: "approver Name",
    cell : ({row}) => <p>{row.original.approverName ?? 'public'}</p>
  },
 
  {
    id : "actions", 
    cell : ({row}) => <CellAction data={row.original} />
}
]
