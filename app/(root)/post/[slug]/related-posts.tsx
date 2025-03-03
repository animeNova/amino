import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AnimePostCard from "@/components/ui/posts/post"

const relatedPosts = [
  {
    id: 1,
    title: "The Impact of Studio Ghibli on Global Animation",
    excerpt: "Exploring how Miyazaki's works influenced animation worldwide...",
    image: "/placeholder.svg?height=200&width=300",
    genres: ["Studio Ghibli", "Analysis"],
  },
  {
    id: 2,
    title: "Modern Animation Techniques in Anime",
    excerpt: "How CGI and traditional animation are blending in modern anime...",
    image: "/placeholder.svg?height=200&width=300",
    genres: ["Technology", "Animation"],
  },
  {
    id: 3,
    title: "The Rise of Seasonal Anime",
    excerpt: "Understanding the seasonal release format and its impact...",
    image: "/placeholder.svg?height=200&width=300",
    genres: ["Industry", "Trends"],
  },
]

export default function RelatedPosts() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Related Posts</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {relatedPosts.map((post) => (
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
    </section>
  )
}

