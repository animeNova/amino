"use client"

import { useState } from "react"
import { ChevronDown, Filter, Globe, Plus, Search, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useGenres } from "@/hooks/actions/genres/useGenres"
import { DataTable } from "@/components/data-table"
import { columns } from "./components/columns"
import CreativeLoadingScreen from "@/components/ui/loading"
import { useRouter } from "next/navigation"

export default function GenresPage() {
  const {results , isLoading } = useGenres()
  const [selectedGenres, setselectedGenres] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  if (isLoading) {
    return <CreativeLoadingScreen  />
  }
  return (


        <div className="flex-1">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <h1 className="text-lg font-semibold">Genre Management</h1>
              <div className="ml-auto flex items-center space-x-4">
                <Button onClick={() => router.push('genres/create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Genre
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Genres</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Genres</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{results?.genres.length}</div>
                  <p className="text-xs text-muted-foreground">+124 from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <div className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search communities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-80 pl-8"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedGenres.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Feature Communities</DropdownMenuItem>
                          <DropdownMenuItem>Export Data</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Archive Communities</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              <Card>
                  <div>
                  <DataTable columns={columns} data={results?.genres!} currentPage={0} hasNextPage={results?.hasMore!} totalPages={results?.totalCount!} />
                  </div>
              </Card>
            </div>
          </div>
        </div>
  )
}


