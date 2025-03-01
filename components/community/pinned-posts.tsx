import { Pin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface PinnedPostsProps {
  posts: {
    title: string
    timestamp: string
  }[]
}

export function PinnedPosts({ posts }: PinnedPostsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h4 className="text-sm font-medium">Pinned Posts</h4>
        <Button variant="ghost" size="icon">
          <Pin className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.title} className="flex items-start space-x-4">
              <Star className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">{post.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

