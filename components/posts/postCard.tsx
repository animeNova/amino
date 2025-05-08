"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Share2, Bookmark, MoreHorizontal, Sparkles, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { motion } from "framer-motion"
import UserAvatar from "../ui/user-avatar"
import Link from "next/link"
import LikeButton from "./like"

interface AnimePostCardProps {
  author: {
    name: string;
    avatar?: string;
    level?: number | null;
  }
  post: {
    id:string;
    title: string
    excerpt: string
    image: string
    publishDate: string
  }
  genres: string[]
  stats: {
    likes: number
    comments: number
    shares: number
  }
  isBookmarked?: boolean
  isLiked : string | null;
}

export default function AnimePostCard({
  author,
  post,
  genres,
  stats,
  isBookmarked = false,
  isLiked
}: AnimePostCardProps) {
  // Initialize state with null to prevent hydration mismatch
  const [bookmarked, setBookmarked] = useState<boolean | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Set the initial state after component mounts on client
  useEffect(() => {
    setBookmarked(isBookmarked)
  }, [stats.likes, isBookmarked])


  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }


  return (
    <Card
      className="w-[380px] md:w-[400px] mx-auto border-2 bg-background hover:shadow-xl transition-all duration-300 flex justify-between flex-col overflow-hidden"
      style={{
        boxShadow: isHovered ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" : "",
        transform: isHovered ? "translateY(-2px)" : "",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rest of your component remains the same */}
      <CardHeader className="pt-5 pb-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar
                className={cn(
                  "size-12 border-2 transition-all duration-300",
                  isHovered ? "border-primary shadow-md" : "border-primary/70",
                )}
              >
                <UserAvatar url={author.avatar} className="w-full h-full" />
                <AvatarFallback className="bg-primary/10">{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
            
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-md font-medium shadow-sm">
                  Lv.5
                </div>
             
            </div>
            <div>
              <div className={cn(
                "font-bold flex items-center gap-1 text-lg"
              )}>
                {author.name.includes('@') 
                  ? author.name.split('@')[0] 
                  : author.name}
                {author.name.length > 15 && 
                  <span className="inline-block" title={author.name}>
                    <MoreHorizontal className="h-3 w-3" />
                  </span>
                }
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-xs text-muted-foreground">{post.publishDate}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
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
          <h2 className="text-xl font-bold leading-tight mb-3 text-primary hover:text-primary/90 transition-colors cursor-pointer">
            {post.title}
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            {genres.map((genre, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="rounded-full font-medium bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3 space-y-4">
      
          <div
            className="relative h-48 overflow-hidden rounded-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className={cn("object-cover transition-transform duration-500", isHovered ? "scale-105" : "")}
            />
          </div>
          
          {/* Replace dangerouslySetInnerHTML with a safer approach */}
          <div className="text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt}
          </div>
          
          <Link href={`/post/${post.id}`}>
            <Button
              variant="link"
              className="px-0 font-semibold text-primary hover:text-primary/80 hover:underline transition-all"
            >
              Read more →
            </Button>
          </Link>
        </CardContent>

      <CardFooter className="py-3 border-t flex justify-between">
        <div className="flex items-center gap-4">
          <LikeButton postId={post.id} likes={stats.likes} isLiked={isLiked !== null}  />

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/20"
          >
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">{stats.comments}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 hover:bg-green-50 dark:hover:bg-green-950/20"
          >
            <Share2 className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">{stats.shares}</span>
          </Button>
        </div>

        <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="sm"
            className={cn("px-2 transition-colors", bookmarked ? "bg-primary/10 hover:bg-primary/20" : "")}
            onClick={handleBookmark}
          >
            <Bookmark
              className={cn(
                "h-5 w-5 transition-colors",
                bookmarked ? "fill-primary text-primary" : "text-muted-foreground",
              )}
            />
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  )
}

