"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { GenreResult } from "@/app/actions/genre/get"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<GenreResult>[] = [

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "created_by",
    header: "Created By",
  },
  {
    accessorKey: "created_at",
    header: "created At",
    cell : ({row}) => <p>{row.original.created_at.toLocaleDateString()}</p>

  },
 
  {
    id : "actions", 
    cell : ({row}) => <CellAction data={row.original} />
}
]
