"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ModeratorResult } from "@/app/actions/members/get"
import UserAvatar from "@/components/ui/user-avatar"
import { MemberRoleDropdown } from "@/components/ui/member-role-dropdown copy"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<ModeratorResult>[] = [

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "communityName",
    header: "community Name",
  },
  {
    accessorKey: "image",
    header: "User Image",
    cell : ({row}) => <UserAvatar url={row.original.image} key={row.original.image} />
  },
  {
    accessorKey: "communityImage",
    header: "community Image",
    cell : ({row}) => <UserAvatar url={row.original.communityImage} key={row.original.communityImage} />
  },
  {
    accessorKey: "role", // Changed from "communityImage" to "role"
    header: "Role", // Updated header to match the content
    cell : ({row}) =>  <MemberRoleDropdown currentRole={row.original.role} communityId={row.original.communityId} memberId={row.original.memberId} />

  },
  {
    accessorKey: "joined_at", // Changed from "created_at" to match your data model
    header: "Joined At",
    cell : ({row}) => <p>{row.original.joined_at.toLocaleDateString()}</p>
  },
 
  {
    id : "actions", 
    cell : ({row}) => <CellAction data={row.original} />
  }
]
