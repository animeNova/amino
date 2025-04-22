import { Bell, MoreHorizontal, Share2, Users, MessageCircle, SquareChartGantt } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreatePostDialog } from "./create-post";
import Link from "next/link"
interface CommunityInfoProps {
  community: {
    id : string;
    name: string
    handle: string
    description: string
    memberCount: string
    avatar: string
    staff: {
      name: string
      role: string
      avatar: string
    }[]
  },
  isMember : boolean;
  canManage : boolean;
}

export function CommunityInfo({ community , isMember , canManage}: CommunityInfoProps) {
  return (
    <Card>
      <CardHeader className="relative pb-0">
        <Avatar className="h-20 w-20 border-4 border-background absolute -top-12">
          <AvatarImage src={community.avatar} />
          <AvatarFallback>{community.name[0]}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="pt-12 space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{community.name}</h1>
          <p className="text-muted-foreground">@{community.handle}</p>
        </div>
        <p>{community.description}</p>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            {community.memberCount} members
          </div>
          <div className="flex items-center">
            <MessageCircle className="mr-1 h-4 w-4" />
            Active
          </div>
        </div>
        <div className="flex gap-2">
          {
            isMember ? (
              <CreatePostDialog />
            ) : (
              <Button className="flex-1">Join Community</Button>
            )
          }
          {
            canManage && (
              <Link href={`/dashboard/community/${community.id}`}>
              <Button variant="outline" size="icon">
                <SquareChartGantt className="h-4 w-4" />
              </Button>
              </Link>
            )
          }
            <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <Separator />
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Community Staff</h4>
          <div className="space-y-2">
            {community.staff.map((staff) => (
              <div key={staff.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={staff.avatar} />
                    <AvatarFallback>{staff.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{staff.name}</p>
                    <p className="text-sm text-muted-foreground">{staff.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

