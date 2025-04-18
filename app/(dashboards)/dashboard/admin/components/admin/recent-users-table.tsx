"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function RecentUsersTable() {
  return (
    <div className="space-y-4">
      {recentUsers.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">Joined {user.joinedDate}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant={user.status === "active" ? "default" : "outline"}
              className={user.status === "active" ? "bg-green-500" : "text-muted-foreground"}
            >
              {user.status}
            </Badge>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

const recentUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?text=AJ",
    joinedDate: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    avatar: "/placeholder.svg?text=MR",
    joinedDate: "5 hours ago",
    status: "active",
  },
  {
    id: 3,
    name: "David Kim",
    avatar: "/placeholder.svg?text=DK",
    joinedDate: "8 hours ago",
    status: "pending",
  },
  {
    id: 4,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?text=SC",
    joinedDate: "1 day ago",
    status: "active",
  },
  {
    id: 5,
    name: "James Wilson",
    avatar: "/placeholder.svg?text=JW",
    joinedDate: "1 day ago",
    status: "pending",
  },
]
