import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex flex-wrap gap-1 mb-2">
                  {post.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-semibold line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

