import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatRooms } from "@/components/community/chat-rooms"
import { CommunityInfo } from "@/components/community/community-info"
import { CommunityRules } from "@/components/community/community-rules"
import { PinnedPosts } from "@/components/community/pinned-posts"
import AnimePostCard from "@/components/posts/postCard"
import Container from "@/components/ui/container"
import { isCommunityMember, isCommunityModerator } from "@/utils/permissions"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getPostsByCommunity } from "@/app/actions/posts/get"
import PostList from "../posts/post-list"
interface CommunityPageProps {
    community: {
        id: string;
        name: string;
        handle: string;
        description: string;
        language: string;
        visibility: "public" | "private";
        image: string;
        banner: string;
        created_by: string;
        genre_id: string;
        created_at: Date;
        updated_at: Date;
    };
}
export default async function CommunityPage({community} :Readonly<CommunityPageProps>) {
    const user = await auth.api.getSession({
        headers :await headers()
    })
    const isMember = await isCommunityMember(user?.user.id!,community.id)
    const canManage = await isCommunityModerator(user?.user.id!,community.id)
    const {posts} = await getPostsByCommunity(community.id)
  return (
    <div className="min-h-screen bg-background">
     <Container>
     <div className="relative h-48 w-full">
        <Image src={community.banner} alt="Community cover" fill className="object-cover" />
      </div>
      <div className="container relative grid grid-cols-1 gap-6 pb-8 pt-5 md:grid-cols-12">
        {/* Left Sidebar - Community Info */}
        <div className="md:col-span-3 space-y-6">
          <CommunityInfo community={{
            id : community.id,
            avatar : community.image,
            name : community.name,
            handle : community.handle,
            description : community.description,
            memberCount : "12.3k",
            staff: [
                {
                  name: "Sarah Chen",
                  role: "Admin",
                  avatar: "/placeholder.svg?text=SC",
                },
                {
                  name: "Mike Johnson",
                  role: "Moderator",
                  avatar: "/placeholder.svg?text=MJ",
                },
                {
                  name: "Lisa Park",
                  role: "Moderator",
                  avatar: "/placeholder.svg?text=LP",
                },
            ],
          }} 
          isMember={isMember}
          canManage={canManage}
          />
          <CommunityRules rules={communityRules} />
        </div>

        {/* Middle Section - Posts */}
        <div className="md:col-span-6 space-y-6">
          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <PostList posts={posts} />
        </ScrollArea>
        </div>

        {/* Right Sidebar - Chat Rooms */}
        <div className="md:col-span-3 space-y-6">
          <ChatRooms rooms={chatRooms} />
          <PinnedPosts posts={pinnedPosts} />
        </div>
      </div>
      </Container>
    </div>
  )
}

const communityData = {
  name: "Photography Club",
  handle: "photographyclub",
  description: "A community for photography enthusiasts to share their work, get feedback, and learn from each other.",
  memberCount: "15.2k",
  avatar: "/placeholder.svg?text=PC",
  staff: [
    {
      name: "Sarah Chen",
      role: "Admin",
      avatar: "/placeholder.svg?text=SC",
    },
    {
      name: "Mike Johnson",
      role: "Moderator",
      avatar: "/placeholder.svg?text=MJ",
    },
    {
      name: "Lisa Park",
      role: "Moderator",
      avatar: "/placeholder.svg?text=LP",
    },
  ],
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

const posts = [
  {
    id: 1,
    author: {
      name: "Alex Kim",
      avatar: "/placeholder.svg?text=AK",
    },
    timestamp: "2 hours ago",
    content: "Just captured this amazing sunset at the beach! What do you think about the composition?",
    image: "/placeholder.svg?height=400&width=600",
    likes: 124,
    comments: 23,
    shares: 5,
  },
  {
    id: 2,
    author: {
      name: "Maria Garcia",
      avatar: "/placeholder.svg?text=MG",
    },
    timestamp: "4 hours ago",
    content: "Looking for recommendations on a good entry-level DSLR camera. Any suggestions?",
    likes: 45,
    comments: 56,
    shares: 2,
  },
  {
    id: 3,
    author: {
      name: "Tom Wilson",
      avatar: "/placeholder.svg?text=TW",
    },
    timestamp: "6 hours ago",
    content: "Check out this street photography series I've been working on!",
    image: "/placeholder.svg?height=400&width=600",
    likes: 232,
    comments: 34,
    shares: 12,
  },
  {
    id: 4,
    author: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?text=ET",
    },
    timestamp: "8 hours ago",
    content: "Just upgraded my lens collection! Can't wait to test these out.",
    image: "/placeholder.svg?height=400&width=600",
    likes: 178,
    comments: 45,
    shares: 8,
  },
  {
    id: 5,
    author: {
      name: "David Lee",
      avatar: "/placeholder.svg?text=DL",
    },
    timestamp: "12 hours ago",
    content: "Anyone interested in joining a photography workshop this weekend?",
    likes: 89,
    comments: 67,
    shares: 3,
  },
]

const chatRooms = [
  {
    name: "General Discussion",
    members: "1.2k",
    iconBg: "bg-primary/10",
  },
  {
    name: "Photo Critique",
    members: "856",
    iconBg: "bg-primary/10",
  },
  {
    name: "Equipment Talk",
    members: "643",
    iconBg: "bg-primary/10",
  },
  {
    name: "Beginners Corner",
    members: "432",
    iconBg: "bg-primary/10",
  },
]

const pinnedPosts = [
  {
    title: "Community Guidelines",
    timestamp: "Pinned by moderators",
  },
  {
    title: "Monthly Photo Challenge",
    timestamp: "Pinned by moderators",
  },
  {
    title: "Photography Resources",
    timestamp: "Pinned by moderators",
  },
]

