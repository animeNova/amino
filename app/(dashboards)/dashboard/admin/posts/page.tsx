import {  Globe, Plus,Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { columns } from "./components/columns"
import SearchComponent from "../../../../../components/search"
import PaginationButtons from "@/components/ui/pagination-buttons"
import { getUsers } from "@/app/actions/users/get"
import { getPosts } from "@/app/actions/posts/get"

interface PageProps {
  searchParams: {
    search: string;
    page: string;
  };
}
export default async function UsersPage({
  searchParams,
}: PageProps
) {
  const { page,search } =await searchParams;
  const pageParam = page ? parseInt(page) : 1;
  const searchParam = search ?? "";
  const {posts,totalPages,totalCount} =await getPosts({
    search : searchParam,
    offset : pageParam,
  });
  
  return (


        <div className="flex-1">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <h1 className="text-lg font-semibold">Posts Management</h1>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
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
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCount}</div>
                  <p className="text-xs text-muted-foreground">+124 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,431</div>
                  <p className="text-xs text-muted-foreground">85.4% of total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68.7%</div>
                  <p className="text-xs text-muted-foreground">+2.3% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card>
                <div className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <SearchComponent paramName="search" defaultValue={search} />
                  </div>

                </div>
              </Card>

              <Card>
                  <div>
                  <DataTable 
                    columns={columns} 
                    data={posts} 
                  />

                  </div>
                <div className="flex items-center justify-between p-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{posts.length}</strong> of <strong>{totalCount}</strong>{" "}
                    Posts
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <PaginationButtons currentPage={pageParam ?? 0} totalPages={totalPages} />

        </div>
  )
}


