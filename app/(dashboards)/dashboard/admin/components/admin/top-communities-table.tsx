"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function TopCommunitiesTable() {
  return (
    <div className="space-y-4">
      {topCommunities.map((community) => (
        <div key={community.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={community.avatar} />
              <AvatarFallback>{community.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{community.name}</div>
              <div className="text-xs text-muted-foreground">{community.members.toLocaleString()} members</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block w-32">
              <div className="text-xs text-muted-foreground mb-1">Engagement</div>
              <Progress value={community.engagement} className="h-1.5" />
            </div>
            <Badge
              variant={community.status === "healthy" ? "outline" : "secondary"}
              className={
                community.status === "healthy" ? "text-green-500 border-green-500" : "text-yellow-500 border-yellow-500"
              }
            >
              {community.status}
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

const topCommunities = [
  {
    id: 1,
    name: "Photography Club",
    avatar: "/placeholder.svg?text=PC",
    members: 15243,
    engagement: 87,
    status: "healthy",
  },
  {
    id: 2,
    name: "Foodies United",
    avatar: "/placeholder.svg?text=FU",
    members: 12876,
    engagement: 82,
    status: "healthy",
  },
  {
    id: 3,
    name: "Tech Innovators",
    avatar: "/placeholder.svg?text=TI",
    members: 10543,
    engagement: 75,
    status: "warning",
  },
  {
    id: 4,
    name: "Book Lovers",
    avatar: "/placeholder.svg?text=BL",
    members: 9876,
    engagement: 79,
    status: "healthy",
  },
  {
    id: 5,
    name: "Fitness Enthusiasts",
    avatar: "/placeholder.svg?text=FE",
    members: 8765,
    engagement: 68,
    status: "warning",
  },
]
