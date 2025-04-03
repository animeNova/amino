"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, ChevronDown, Check, Filter, Eye, Edit, Trash2, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PostsPage() {
  const [selectedPosts, setSelectedPosts] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [communityFilter, setCommunityFilter] = useState<string>("all")

  // Filter posts based on search query and filters
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesCommunity = communityFilter === "all" || post.community === communityFilter

    return matchesSearch && matchesStatus && matchesCommunity
  })

  const togglePostSelection = (postId: number) => {
    setSelectedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const toggleAllPosts = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map((post) => post.id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>
      case "flagged":
        return <Badge variant="destructive">Flagged</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Pending
          </Badge>
        )
      case "removed":
        return <Badge variant="secondary">Removed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Posts Management</h1>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <div className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="removed">Removed</SelectItem>
                </SelectContent>
              </Select>
    
            </div>
            <div className="flex items-center gap-2">
              {selectedPosts.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Check className="mr-2 h-4 w-4" /> Approve Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <AlertTriangle className="mr-2 h-4 w-4" /> Flag Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                    </DropdownMenuItem>
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                      onCheckedChange={toggleAllPosts}
                      aria-label="Select all posts"
                    />
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>Post</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>Date</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>Engagement</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id} className={post.status === "flagged" ? "bg-red-950/10" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPosts.includes(post.id)}
                          onCheckedChange={() => togglePostSelection(post.id)}
                          aria-label={`Select post ${post.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium truncate max-w-[300px]">{post.content}</span>
                          {post.image && <span className="text-xs text-muted-foreground">Has image</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{post.author.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{post.community}</TableCell>
                      <TableCell>{getStatusBadge(post.status)}</TableCell>
                      <TableCell>{post.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{post.likes}</span>
                            <span className="text-xs text-muted-foreground">likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{post.comments}</span>
                            <span className="text-xs text-muted-foreground">comments</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {post.status === "flagged" && (
                              <DropdownMenuItem>
                                <Check className="mr-2 h-4 w-4" /> Approve
                              </DropdownMenuItem>
                            )}
                            {post.status !== "flagged" && (
                              <DropdownMenuItem>
                                <AlertTriangle className="mr-2 h-4 w-4" /> Flag
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredPosts.length}</strong> of <strong>{posts.length}</strong> posts
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

const posts = [
  {
    id: 1,
    content: "Just captured this amazing sunset at the beach! What do you think about the composition?",
    image: true,
    author: {
      name: "Alex Kim",
      avatar: "/placeholder.svg?text=AK",
    },
    community: "Photography Club",
    status: "published",
    date: "2 hours ago",
    likes: 124,
    comments: 23,
    reports: 0,
  },
  {
    id: 2,
    content: "Looking for recommendations on a good entry-level DSLR camera. Any suggestions?",
    image: false,
    author: {
      name: "Maria Garcia",
      avatar: "/placeholder.svg?text=MG",
    },
    community: "Photography Club",
    status: "published",
    date: "4 hours ago",
    likes: 45,
    comments: 56,
    reports: 0,
  },
  {
    id: 3,
    content: "Check out this street photography series I've been working on!",
    image: true,
    author: {
      name: "Tom Wilson",
      avatar: "/placeholder.svg?text=TW",
    },
    community: "Photography Club",
    status: "flagged",
    date: "6 hours ago",
    likes: 232,
    comments: 34,
    reports: 3,
  },
  {
    id: 4,
    content: "Just upgraded my lens collection! Can't wait to test these out.",
    image: true,
    author: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?text=ET",
    },
    community: "Photography Club",
    status: "published",
    date: "8 hours ago",
    likes: 178,
    comments: 45,
    reports: 0,
  },
  {
    id: 5,
    content: "Anyone interested in joining a photography workshop this weekend?",
    image: false,
    author: {
      name: "David Lee",
      avatar: "/placeholder.svg?text=DL",
    },
    community: "Photography Club",
    status: "published",
    date: "12 hours ago",
    likes: 89,
    comments: 67,
    reports: 0,
  },
  {
    id: 6,
    content: "My grandmother's secret pasta recipe that's been in our family for generations!",
    image: true,
    author: {
      name: "Jamie Oliver",
      avatar: "/placeholder.svg?text=JO",
    },
    community: "Foodies United",
    status: "published",
    date: "1 day ago",
    likes: 342,
    comments: 78,
    reports: 0,
  },
  {
    id: 7,
    content: "This restaurant is terrible! The food was cold and the service was awful. AVOID AT ALL COSTS!!!",
    image: false,
    author: {
      name: "Gordon Ramsay",
      avatar: "/placeholder.svg?text=GR",
    },
    community: "Foodies United",
    status: "flagged",
    date: "1 day ago",
    likes: 56,
    comments: 89,
    reports: 12,
  },
  {
    id: 8,
    content: "Check out my new AI project that can generate realistic images from text descriptions!",
    image: true,
    author: {
      name: "Elon Musk",
      avatar: "/placeholder.svg?text=EM",
    },
    community: "Tech Innovators",
    status: "pending",
    date: "2 days ago",
    likes: 0,
    comments: 0,
    reports: 0,
  },
  {
    id: 9,
    content: "I've just released a new open-source library for React developers. Check it out!",
    image: false,
    author: {
      name: "Mark Zuckerberg",
      avatar: "/placeholder.svg?text=MZ",
    },
    community: "Tech Innovators",
    status: "published",
    date: "3 days ago",
    likes: 423,
    comments: 87,
    reports: 0,
  },
  {
    id: 10,
    content: "This post contains inappropriate content that violates community guidelines.",
    image: false,
    author: {
      name: "Suspicious User",
      avatar: "/placeholder.svg?text=SU",
    },
    community: "Tech Innovators",
    status: "removed",
    date: "4 days ago",
    likes: 5,
    comments: 3,
    reports: 8,
  },
]

