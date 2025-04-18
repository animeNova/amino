"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[] ,
  currentPage: number;
  hasNextPage:boolean;
  totalPages:number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  currentPage,
  hasNextPage,
  totalPages
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const router = useRouter()
  const path = usePathname()
  const searchParams = useSearchParams()
  const nextPage =currentPage+1; 
  const prevPage =currentPage-1; 
  const getNextPage =  useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  return (
    <>
    <ScrollArea className="h-[calc(80vh-220px)] rounded-md border md:h-[calc(80dvh-200px)]">
    <Table className="relative">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table?.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
  <div className="flex items-center justify-end space-x-2 py-4">
    <div className="space-x-2">
        {currentPage !== 1 && (
                <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    router.push(`${path}?` + getNextPage('page' , prevPage.toString())) 
                 }}
                disabled={currentPage == 1|| data.length == 0}
              >
                Previous
              </Button>
        ) }
    {
      hasNextPage && (
        <Button
        variant="outline"
        size="sm"
        onClick={() => {
           router.push(`${path}?` + getNextPage('page' , nextPage.toString())) 
        }}
        disabled={totalPages == currentPage || data.length == 0}
        
      >
        Next
      </Button>
      )
    }

    </div>
  </div>
  </>
  )
}
