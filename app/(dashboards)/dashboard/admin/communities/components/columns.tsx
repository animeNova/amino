"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { CommunityResult} from "@/app/actions/community/get"
import Image from "next/image"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<CommunityResult>[] = [

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "handle",
    header: "Handle",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "language",
    header: "Language",
  },
  {
    accessorKey: "created_by",
    header: "created By", 
  },
  {
    accessorKey: "genre_name",
    header: "genre name",
  },
  {
    accessorKey: "memberCount",
    header: "member Count",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell : ({row}) => <Image width={1000} height={1000} src={row.original.image} alt="image" className="w-10 h-10 rounded-full" />
  },
  {
    accessorKey: "created_at",
    header: "created At",
    cell : ({row}) => <p>{row.original.created_at?.toLocaleDateString()}</p>
  },
 
  {
    id : "actions", 
    cell : ({row}) => <CellAction data={row.original} />
}
]
