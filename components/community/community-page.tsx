import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatRooms } from "@/components/community/chat-rooms"
import { CommunityInfo } from "@/components/community/community-info"
import { CommunityRules } from "@/components/community/community-rules"

import Container from "@/components/ui/container"
import { isCommunityMember, isCommunityModerator } from "@/utils/permissions"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getPostsByCommunity } from "@/app/actions/posts/get"
import { getChatRoomsByCommunity } from "@/app/actions/chat-rooms/get"
import PostList from "../posts/post-list"
import { GetCommunityByHandlerResult } from "@/app/actions/community/get"
interface CommunityPageProps {
    community: GetCommunityByHandlerResult
}
export default async function CommunityPage({community} :Readonly<CommunityPageProps>) {
    const user = await auth.api.getSession({
        headers :await headers()
    })
    const isMember = await isCommunityMember(user?.user.id!,community.id)
    const canManage = await isCommunityModerator(user?.user.id!,community.id)
    const {posts} = await getPostsByCommunity(community.id)
    const {rooms} = await getChatRoomsByCommunity(community.id)
    
    return (
    <div className="min-h-screen bg-background">
     <Container>
     <div className="relative h-48 w-full">
        <Image src={community.banner} alt="Community cover" fill className="object-cover" />
      </div>
      <div className="container  relative grid grid-cols-1 gap-6 pb-8 pt-5 md:grid-cols-12">
        {/* Left Sidebar - Community Info */}
        <div className="md:col-span-3 space-y-6">
          <CommunityInfo community={{
            id : community.id,
            avatar : community.image,
            name : community.name,
            handle : community.handle,
            description : community.description,
            memberCount :Number(community.memberCount) ?? 0,
            staff: community.staff,
          }} 
          isMember={isMember}
          canManage={canManage}
          />
          <CommunityRules rules={communityRules} />
        </div>

        {/* Middle Section - Posts */}
        <div className="md:col-span-6 space-y-6 ">
        <ScrollArea className="h-[calc(100vh-5rem)] pt-3">
          <PostList posts={posts} className="grid grid-cols-1 gap-4 w-full" />
        </ScrollArea>
        </div>
                {/* Right Sidebar - Chat Rooms */}
        <div className="md:col-span-3 space-y-6">
          <ChatRooms rooms={rooms} communityId={community.id} />
        </div>
      </div>
      </Container>
    </div>
  )
}



const communityRules = [
  {
    title: "Be Respectful",
    description: "Treat all members with respect. No harassment or hate speech.",
  },
  {
    title: "Quality Content",
    description: "Share high-quality images and meaningful discussions.",
  },
  {
    title: "Credit Sources",
    description: "Always credit original photographers when sharing their work.",
  },
  {
    title: "No Spam",
    description: "Do not spam or post excessive self-promotion.",
  },
]



