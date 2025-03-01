"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Reply } from "lucide-react"

interface Comment {
  id: number
  author: {
    name: string
    avatar: string
    level: number
  }
  content: string
  likes: number
  replies: number
  timestamp: string
  isLiked?: boolean
}

const initialComments: Comment[] = [
  {
    id: 1,
    author: {
      name: "OtakuMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 45,
    },
    content:
      "This is such a comprehensive analysis! I especially loved the part about the golden age of anime. The impact of shows like Evangelion can still be seen in modern anime.",
    likes: 24,
    replies: 3,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: {
      name: "SakuraChan",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 32,
    },
    content:
      "Great article! Would love to see more content about how different studios have influenced animation techniques over the years.",
    likes: 18,
    replies: 1,
    timestamp: "5 hours ago",
  },
]

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")

  const handleLike = (commentId: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          }
        }
        return comment
      }),
    )
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

      {/* Comment Form */}
      <div className="space-y-4">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button>Post Comment</Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <div className="flex gap-4">
              <div className="relative">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1 rounded-md font-medium">
                  Lv.{comment.author.level}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                  </div>
                </div>
                <p className="text-sm">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleLike(comment.id)}>
                    <Heart className={`h-4 w-4 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    <span className="text-xs">{comment.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Reply className="h-4 w-4" />
                    <span className="text-xs">{comment.replies}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

