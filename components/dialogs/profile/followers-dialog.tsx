"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, UserCheck, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface User {
  username: string
  name: string
  avatar: string
}

interface FollowersDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "followers" | "following"
}

export function FollowersDialog({ user, open, onOpenChange, defaultTab = "followers" }: FollowersDialogProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [followState, setFollowState] = useState<Record<number, boolean>>({})
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleFollow = (userId: number) => {
    setFollowState((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))

    const isFollowing = followState[userId]
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing
        ? `You have unfollowed ${getFollowerById(userId)?.name}`
        : `You are now following ${getFollowerById(userId)?.name}`,
      variant: "default",
    })
  }

  const getFollowerById = (id: number) => {
    return [...followers, ...following].find((f) => f.id === id)
  }

  const filteredFollowers = followers.filter(
    (follower) =>
      follower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      follower.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredFollowing = following.filter(
    (follow) =>
      follow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      follow.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{user.name}'s Network</DialogTitle>
        </DialogHeader>

        <div className="mb-4 mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search people..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "followers" | "following")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">
              Followers{" "}
              <Badge variant="secondary" className="ml-2">
                {followers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="following">
              Following{" "}
              <Badge variant="secondary" className="ml-2">
                {following.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" className="flex-1 overflow-auto mt-4">
            {filteredFollowers.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No followers found matching your search.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFollowers.map((follower) => (
                  <div key={follower.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={follower.avatar} alt={follower.name} />
                        <AvatarFallback>{follower.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/profile/${follower.username}`}
                          className="font-medium hover:underline"
                          onClick={() => onOpenChange(false)}
                        >
                          {follower.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">@{follower.username}</p>
                      </div>
                    </div>
                    <Button
                      variant={followState[follower.id] ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleFollow(follower.id)}
                    >
                      {followState[follower.id] ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="following" className="flex-1 overflow-auto mt-4">
            {filteredFollowing.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No following found matching your search.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFollowing.map((follow) => (
                  <div key={follow.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={follow.avatar} alt={follow.name} />
                        <AvatarFallback>{follow.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/profile/${follow.username}`}
                          className="font-medium hover:underline"
                          onClick={() => onOpenChange(false)}
                        >
                          {follow.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">@{follow.username}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleFollow(follow.id)}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Following
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Mock data for followers
const followers = [
  {
    id: 1,
    name: "Maria Garcia",
    username: "mariagarcia",
    avatar: "/placeholder.svg?text=MG",
  },
  {
    id: 2,
    name: "Tom Wilson",
    username: "tomwilson",
    avatar: "/placeholder.svg?text=TW",
  },
  {
    id: 3,
    name: "Emma Thompson",
    username: "emmathompson",
    avatar: "/placeholder.svg?text=ET",
  },
  {
    id: 4,
    name: "David Lee",
    username: "davidlee",
    avatar: "/placeholder.svg?text=DL",
  },
  {
    id: 5,
    name: "Sarah Chen",
    username: "sarahchen",
    avatar: "/placeholder.svg?text=SC",
  },
]

// Mock data for following
const following = [
  {
    id: 6,
    name: "Jamie Oliver",
    username: "jamieoliver",
    avatar: "/placeholder.svg?text=JO",
  },
  {
    id: 7,
    name: "Gordon Ramsay",
    username: "gordonramsay",
    avatar: "/placeholder.svg?text=GR",
  },
  {
    id: 8,
    name: "Elon Musk",
    username: "elonmusk",
    avatar: "/placeholder.svg?text=EM",
  },
  {
    id: 9,
    name: "Bill Gates",
    username: "billgates",
    avatar: "/placeholder.svg?text=BG",
  },
  {
    id: 10,
    name: "Mark Zuckerberg",
    username: "markzuckerberg",
    avatar: "/placeholder.svg?text=MZ",
  },
]

