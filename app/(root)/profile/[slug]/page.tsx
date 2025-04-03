"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Bell,
  Calendar,
  Edit,
  Flag,
  Heart,
  ImageIcon,
  LinkIcon,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Shield,
  Star,
  User,
  Users,
  Settings,
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
import { useToast } from "@/hooks/use-toast"

import Container from "@/components/ui/container"
import { FollowersDialog } from "@/components/dialogs/profile/followers-dialog"
import { ProfileSettingsDialog } from "@/components/dialogs/profile/profile-settings-dialog"
import AnimePostCard from "@/components/ui/posts/post"
// Replace the import for PostCard

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { toast } = useToast()
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false)
  const [activeFollowTab, setActiveFollowTab] = useState<"followers" | "following">("followers")
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  // In a real app, we would fetch the user data based on the username
  // For this example, we'll use mock data
  const user = {
    id: 1,
    username: params.username || "alexkim",
    name: "Alex Kim",
    bio: "Passionate photographer specializing in landscape and wildlife photography. Based in San Francisco, exploring the world one click at a time.",
    avatar: "https://thumbs.dreamstime.com/b/anime-boy-aesthetic-image-wallpaper-cute-cartoon-anime-wallpaper-342273503.jpg",
    coverImage: "https://thumbs.dreamstime.com/b/anime-boy-aesthetic-image-wallpaper-cute-cartoon-anime-wallpaper-342273503.jpg",
    location: "San Francisco, CA",
    website: "https://alexkim.photo",
    joinDate: "January 2023",
    isVerified: true,
    role: "member",
    stats: {
      posts: 127,
      followers: 1243,
      following: 356,
      likes: 4582,
    },
    badges: [
      { name: "Top Contributor", icon: Star, color: "text-yellow-500" },
      { name: "Photography Expert", icon: ImageIcon, color: "text-blue-500" },
      { name: "1 Year Member", icon: Calendar, color: "text-green-500" },
    ],
    communities: [
      { name: "Photography Club", role: "Member", avatar: "/placeholder.svg?text=PC" },
      { name: "Travel Enthusiasts", role: "Contributor", avatar: "/placeholder.svg?text=TE" },
      { name: "Wildlife Photographers", role: "Moderator", avatar: "/placeholder.svg?text=WP" },
    ],
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing ? `You have unfollowed ${user.name}` : `You are now following ${user.name}`,
      variant: "default",
    })
  }

  const handleMessage = () => {
    toast({
      title: "Message Sent",
      description: `Your conversation with ${user.name} has been started`,
      variant: "default",
    })
  }

  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our community safe. We'll review this profile.",
      variant: "default",
    })
  }

  return (
    <div className="min-h-screen bg-background mx-2">
    <Container>
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full ">
        <Image
          src={user.coverImage || "/placeholder.svg"}
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
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0 md:mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.isVerified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Verified
                  </Badge>
                )}
                {user.role === "moderator" && (
                  <Badge className="bg-green-500">
                    <Shield className="h-3 w-3 mr-1" /> Moderator
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button variant="outline" size="sm" onClick={handleMessage}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant={isFollowing ? "outline" : "default"} size="sm" onClick={handleFollow}>
              {isFollowing ? (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Following
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Bell className="h-4 w-4 mr-2" />
                  Notification settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleReport} className="text-red-600">
                  <Flag className="h-4 w-4 mr-2" />
                  Report user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    Joined {user.joinDate}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Posts, Media, Likes */}
            <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="posts">
                  Posts <span className="ml-1 text-xs text-muted-foreground">({user.stats.posts})</span>
                </TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="likes">Likes</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              {/* Replace the PostCard usage in the posts TabsContent with AnimePostCard */}
              <TabsContent value="posts" className="mt-4 space-y-4">
                {posts.map((post) => (
                  <AnimePostCard
                    key={post.id}
                    author={{
                      name: post.author.name,
                      avatar: post.author.avatar,
                      level: 42,
                    }}
                    post={{
                      title: post.content.split("!")[0] + "!",
                      excerpt: post.content,
                      images: post.image,
                      publishDate: post.timestamp,
                    }}
                    genres={["Photography", "Nature", "Art"]}
                    stats={{
                      likes: post.likes,
                      comments: post.comments,
                      shares: post.shares,
                    }}
                  />
                ))}
              </TabsContent>

              <TabsContent value="media" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {media.map((item) => (
                    <div key={item.id} className="relative aspect-square rounded-md overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.description}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Replace the PostCard usage in the likes TabsContent with AnimePostCard */}
              <TabsContent value="likes" className="mt-4 space-y-4">
                {likes.map((post) => (
                  <AnimePostCard
                    key={post.id}
                    author={{
                      name: post.author.name,
                      avatar: post.author.avatar,
                      level: 38,
                    }}
                    post={{
                      title: post.content.split("!")[0] + "!",
                      excerpt: post.content,
                      images: post.image,
                      publishDate: post.timestamp,
                    }}
                    genres={["Photography", "Macro", "Wildlife"]}
                    stats={{
                      likes: post.likes,
                      comments: post.comments,
                      shares: post.shares,
                    }}
                    isLiked={true}
                  />
                ))}
              </TabsContent>

              <TabsContent value="comments" className="mt-4 space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{user.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                commented on {comment.postTitle}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="mt-1">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Heart className="h-4 w-4 mr-1" />
                              <span>{comment.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>Reply</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="text-center cursor-pointer hover:bg-muted rounded-md p-2 transition-colors"
                    onClick={() => {
                      setActiveFollowTab("followers")
                      setFollowersDialogOpen(true)
                    }}
                  >
                    <p className="text-2xl font-bold">{user.stats.followers.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div
                    className="text-center cursor-pointer hover:bg-muted rounded-md p-2 transition-colors"
                    onClick={() => {
                      setActiveFollowTab("following")
                      setFollowersDialogOpen(true)
                    }}
                  >
                    <p className="text-2xl font-bold">{user.stats.following.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user.stats.posts.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{user.stats.likes.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Likes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
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
            </Card>

            {/* Communities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Communities</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {user.communities.map((community, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={community.avatar} alt={community.name} />
                          <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{community.name}</p>
                          <p className="text-xs text-muted-foreground">{community.role}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Link href={`/community/${community.name.toLowerCase().replace(/\s+/g, "-")}`}>Visit</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Communities
                </Button>
              </CardFooter>
            </Card>

            {/* Edit Profile Button (only shown if it's the user's own profile) */}
            {/* Edit Profile and Settings Buttons */}
            <div className="flex gap-2">
              <Button className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="icon" onClick={() => setSettingsDialogOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <FollowersDialog
        user={user}
        open={followersDialogOpen}
        onOpenChange={setFollowersDialogOpen}
        defaultTab={activeFollowTab}
      />
      <ProfileSettingsDialog user={user} open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen} />
    </Container>
    </div>
  )
}

// Mock data for posts
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
      name: "Alex Kim",
      avatar: "/placeholder.svg?text=AK",
    },
    timestamp: "1 day ago",
    content:
      "I've been experimenting with long exposure photography lately. Here's a shot of the city lights at night.",
    image: "/placeholder.svg?height=400&width=600",
    likes: 89,
    comments: 15,
    shares: 3,
  },
  {
    id: 3,
    author: {
      name: "Alex Kim",
      avatar: "/placeholder.svg?text=AK",
    },
    timestamp: "3 days ago",
    content:
      "Looking for recommendations on a good entry-level DSLR camera. Any suggestions from fellow photographers?",
    likes: 45,
    comments: 56,
    shares: 2,
  },
]

// Mock data for media
const media = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sunset at the beach",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300",
    description: "City lights at night",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300",
    description: "Mountain landscape",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300",
    description: "Wildlife photography",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=300",
    description: "Portrait photography",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=300",
    description: "Macro photography",
  },
]

// Mock data for likes
const likes = [
  {
    id: 1,
    author: {
      name: "Maria Garcia",
      avatar: "/placeholder.svg?text=MG",
    },
    timestamp: "5 hours ago",
    content: "Check out this amazing macro shot I took of a butterfly!",
    image: "/placeholder.svg?height=400&width=600",
    likes: 156,
    comments: 32,
    shares: 8,
  },
  {
    id: 2,
    author: {
      name: "Tom Wilson",
      avatar: "/placeholder.svg?text=TW",
    },
    timestamp: "1 day ago",
    content: "Just got my hands on the new Canon EOS R5. The image quality is incredible!",
    image: "/placeholder.svg?height=400&width=600",
    likes: 203,
    comments: 47,
    shares: 12,
  },
]

// Mock data for comments
const comments = [
  {
    id: 1,
    postTitle: "Sunset Photography Tips",
    content:
      "Great tips! I've been struggling with getting the right exposure during golden hour. Will definitely try your suggestions.",
    time: "1 day ago",
    likes: 12,
  },
  {
    id: 2,
    postTitle: "New Camera Announcement",
    content:
      "I've been using the previous model for years and it's been fantastic. Looking forward to seeing the improvements in this version!",
    time: "3 days ago",
    likes: 8,
  },
  {
    id: 3,
    postTitle: "Wildlife Photography Workshop",
    content:
      "Is this workshop suitable for beginners? I have some experience with portrait photography but I'm new to wildlife.",
    time: "1 week ago",
    likes: 5,
  },
]

