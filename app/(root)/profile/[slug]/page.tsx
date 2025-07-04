
import Image from "next/image"
import Link from "next/link"
import {
  Bell,
  Calendar,
  LinkIcon,
  MapPin,
  MoreHorizontal,
  Share2,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Container from "@/components/ui/container"
import UserStats from "./components/stats"
import { getUserById } from "@/app/actions/users/get"
import UserAvatar from "@/components/ui/user-avatar"
import FollowButton from "@/components/ui/followButton"
import { getPostsByUser } from "@/app/actions/posts/get"
import PostList from "@/components/posts/post-list"

interface PageProps {
  params : {
    slug : string;
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const {slug} = await params;
  const user =await getUserById(slug)
  const {posts} = await getPostsByUser(user.id)
  return (
    <div className="min-h-screen bg-background mx-2">
    <Container>
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full ">
        <Image
          src={user.coverImage ?? "/placeholder.svg"}
          alt={`${user.name}'s cover`}
          fill
          className="object-cover rounded-[10px]"
          priority
        />
      </div>

      {/* Profile Header */}
      <div className="container relative -mt-20 px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <UserAvatar url={user.image} className="w-full h-full"  />
            </Avatar>
            <div className="mt-4 md:mt-0 md:mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>

              </div>
            </div>
          </div>
          <div className="flex mt-4 md:mt-0 gap-2">
            {/* <Button variant="outline" size="sm" onClick={handleMessage}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button> */}
            <FollowButton profileUserId={user.id}  />
          </div>
        </div>

        {/* Bio and Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <p>{user.bio}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.website.replace(/(^\w+:|^)\/\//, "")}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {user.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Posts, Media, Likes */}
            {/* <Tabs defaultValue="posts" >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="posts"> */}
                <div className="text-center p-2 bg-accent">
                Posts <span className="ml-1 text-xs text-muted-foreground">({user.postsCount})</span>

                </div>
                {/* </TabsTrigger> */}
                {/* <TabsTrigger value="likes">Likes</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger> */}
              {/* </TabsList> */}

              {/* Replace the PostCard usage in the posts TabsContent with AnimePostCard */}
        
                <PostList posts={posts} className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
           <UserStats followers={user.followerCount!} following={user.followingCount!} likes={user.likesCount!} posts={user.postsCount!} />

            {/* Badges */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg">Badges</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {user.badges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`rounded-full p-2 bg-muted ${badge.color}`}>
                        <badge.icon className="h-4 w-4" />
                      </div>
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Communities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Communities</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {user.joinedCommunities?.map((community) => (
                    <div key={community.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={community.image!} alt={community.name} />
                          <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{community.name}</p>
                          <p className="text-xs text-muted-foreground">{community.role}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Link href={`/community/${community.handle}`}>Visit</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              {/* <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Communities
                </Button>
              </CardFooter> */}
            </Card>

            {/* Edit Profile Button (only shown if it's the user's own profile) */}
            {/* Edit Profile and Settings Buttons */}
        
          </div>
        </div>
      </div>

  

    </Container>
    </div>
  )
}


