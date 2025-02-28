"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface AnimePostCardProps {
  author: {
    name: string
    avatar: string
    level?: number
  }
  post: {
    title: string
    excerpt: string
    images?: string
    publishDate: string
  }
  genres: string[]
  stats: {
    likes: number
    comments: number
    shares: number
  }
  isLiked?: boolean
  isBookmarked?: boolean
}

export default function AnimePostCard({
  author = {
    name: "SakuraChan",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 42,
  },
  post = {
    title: "Why Chainsaw Man is a Masterpiece!",
    excerpt:
      "Just finished binge-watching Chainsaw Man and I need to share my thoughts! The animation quality and story development are absolutely incredible...",
    images: 'https://thumbs.dreamstime.com/b/anime-boy-aesthetic-image-wallpaper-cute-cartoon-anime-wallpaper-342273503.jpg',
    publishDate: "2 hours ago",
  },
  genres = ["Shounen", "Action", "Supernatural"],
  stats = {
    likes: 124,
    comments: 32,
    shares: 8,
  },
  isLiked = false,
  isBookmarked = false,
}: AnimePostCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(stats.likes)
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  return (
    <Card className="max-w-[400px] mx-auto border-2 bg-background hover:shadow-xl transition-shadow duration-300  flex justify-between flex-col">
      <CardHeader className="pt-5 pb-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="bg-primary/10">{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {author.level && (
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1 rounded-md font-medium">
                  Lv.{author.level}
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-lg flex items-center gap-1">
                {author.name}
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </p>
              <p className="text-xs text-muted-foreground">{post.publishDate}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Follow {author.name}</DropdownMenuItem>
              <DropdownMenuItem>Mute posts</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <h2 className="text-xl font-bold leading-tight mb-3 text-primary">{post.title}</h2>

          <div className="flex flex-wrap gap-2 mb-3">
            {genres.map((genre, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="rounded-full font-medium bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3 space-y-4">
            
      <div className="relative h-48">
            <Image
                 src={'https://thumbs.dreamstime.com/b/anime-boy-aesthetic-image-wallpaper-cute-cartoon-anime-wallpaper-342273503.jpg'}
                 alt={post.title}
                 fill
                className="object-cover hover:scale-105 transition-transform"
              />
      </div>
        <p className="text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>

        <Button variant="link" className="px-0 font-semibold text-primary hover:text-primary/80">
          Read more →
        </Button>
      </CardContent>

      <CardFooter className="py-3 border-t flex justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5" onClick={handleLike}>
            <Heart
              className={cn("h-5 w-5 transition-colors", liked ? "fill-red-500 text-red-500" : "text-muted-foreground")}
            />
            <span className={cn("font-medium", liked ? "text-red-500" : "text-muted-foreground")}>{likeCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">{stats.comments}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
            <Share2 className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">{stats.shares}</span>
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="px-2" onClick={handleBookmark}>
          <Bookmark
            className={cn(
              "h-5 w-5 transition-colors",
              bookmarked ? "fill-primary text-primary" : "text-muted-foreground",
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  )
}

