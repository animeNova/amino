"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import Image from "next/image"
import { User } from "@/db/types"
import { useSession } from "@/lib/auth/client"
import { UserRoleDropdown } from "@/components/ui/user-role-dropdown"
import UserAvatar from "@/components/ui/user-avatar"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<User>[] = [

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell : ({row}) => {
      const {data} = useSession();
      return (
        <div>
          {
            data?.user.role === 'owner' ? (
              <UserRoleDropdown currentRole={row.original.role} userId={row.original.id} />
            ) : (
              <p>{row.original.role}</p>
            )
          }
          
        </div>
      )
    }
  },
  {
    accessorKey: "image",
    header: "Image",
    cell : ({row}) => <UserAvatar url={row.original.image} />
  },
  {
    accessorKey: "created_at",
    header: "Joined At",
    cell : ({row}) => <p>{row.original.createdAt?.toLocaleDateString()}</p>
  },
 
  {
    id : "actions", 
    cell : ({row}) => <CellAction data={row.original} />
}
]
