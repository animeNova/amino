'use client';
import { Bell, MoreHorizontal, Users, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import CommunityJoin from "./community-join"
import ShareDialog from "../ui/share-dialog"
import useCreatePostDialogStore from "@/store/useCreatePostDialog";
import { useEffect, useState } from "react";

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

export function CommunityInfo({ community, isMember, canManage}: CommunityInfoProps) {
  const {open} = useCreatePostDialogStore();
  const [communityUrl, setCommunityUrl] = useState("");
  
  useEffect(() => {
    // Get the URL using client-side window object
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/community/${community.id}`;
    setCommunityUrl(url);
  }, [community.id]);
  
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
        <div className="flex gap-2 items-center justify-center">
          {
            isMember ? (
              <Button onClick={() => open()} className="rounded-[10px]">Create Post</Button>
            ) : (
              <CommunityJoin communityId={community.id} size="sm"/>
            )
          }
          {/* {
            canManage && (
              <Link href={`/dashboard/community/${community.id}`}>
              <Button variant="outline" size={'sm'}>
                <SquareChartGantt className="h-6 w-4" />
              </Button>
              </Link>
            )
          } */}
            <Button variant="outline" size={'sm'}>
            <Bell className="h-6 w-4" />
          </Button>
          <ShareDialog postUrl={communityUrl} postTitle="Share This Community" />
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

