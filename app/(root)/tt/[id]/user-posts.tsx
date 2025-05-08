import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import AnimePostCard from "@/components/posts/postCard"

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
    <div className="flex justify-center items-center gap-3 flex-wrap">
      {posts.map((post) => (
            <AnimePostCard key={post.id} 
                       author={{
                           name: "SakuraChan",
                           avatar: "/placeholder.svg?height=40&width=40",
                           level: 42,
                         }}
                         post={{
                           title: "Why Chainsaw Man is a Masterpiece!",
                           excerpt:
                             "Just finished binge-watching Chainsaw Man and I need to share my thoughts! The animation quality and story development are absolutely incredible. MAPPA has outdone themselves with the fight scenes...",
                           publishDate: "2 hours ago",
                         }}
                         genres={["Shounen", "Action", "Supernatural"]}
                         stats={{
                           likes: 124,
                           comments: 32,
                           shares: 8,
                         }}
                       />
      ))}
    </div>
  )
}

