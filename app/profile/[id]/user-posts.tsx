import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"

const posts = [
  {
    id: 1,
    title: "My Take on the Latest Season of Demon Slayer",
    content:
      "The animation quality in the Entertainment District arc is absolutely mind-blowing! UFOTABLE has outdone themselves yet again...",
    image: "/placeholder.svg?height=300&width=600",
    genres: ["Review", "Demon Slayer"],
    stats: {
      likes: 1243,
      comments: 89,
      shares: 32,
    },
    timestamp: "2 days ago",
  },
  {
    id: 2,
    title: "Fan Art: Gojo Satoru from Jujutsu Kaisen",
    content:
      "Spent the weekend working on this digital painting of everyone's favorite sensei! Let me know what you think!",
    image: "/placeholder.svg?height=300&width=600",
    genres: ["Fan Art", "Jujutsu Kaisen"],
    stats: {
      likes: 2891,
      comments: 156,
      shares: 89,
    },
    timestamp: "5 days ago",
  },
]

export default function UserPosts() {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2">
              {post.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="rounded-full font-medium bg-primary/10">
                  {genre}
                </Badge>
              ))}
            </div>
            <h3 className="text-xl font-bold">{post.title}</h3>
          </CardHeader>
          {post.image && (
            <div className="relative aspect-video">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <CardContent className="pt-4">
            <p className="text-muted-foreground">{post.content}</p>
          </CardContent>
          <CardFooter className="border-t flex justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <Heart className="h-4 w-4" />
                <span className="text-xs">{post.stats.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{post.stats.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                <span className="text-xs">{post.stats.shares}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

