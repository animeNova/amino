import Heading from "@/components/ui/heading"
import AnimePostCard from "@/components/ui/posts/post"

export default function AnimeFeed() {
  return (
    <div className="container py-8 md:py-12 ">
    
        <Heading>
            Featured Posts
        </Heading>

      <div className="flex flex-wrap justify-start items-center gap-4">
        <AnimePostCard
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

        <AnimePostCard
          author={{
            name: "OtakuKing",
            avatar: "/placeholder.svg?height=40&width=40",
            level: 78,
          }}
          post={{
            title: "Top 5 Slice of Life Anime You Need to Watch!",
            excerpt:
              "If you're looking for some heartwarming anime that will make you smile, here are my top recommendations! These shows perfectly capture the beauty of everyday life...",
            publishDate: "5 hours ago",
          }}
          genres={["Slice of Life", "Comedy", "School"]}
          stats={{
            likes: 256,
            comments: 45,
            shares: 23,
          }}
          isLiked={true}
        />

        <AnimePostCard
          author={{
            name: "MangaMaster",
            avatar: "/placeholder.svg?height=40&width=40",
            level: 65,
          }}
          post={{
            title: "Jujutsu Kaisen Season 2 Analysis [Spoilers!]",
            excerpt:
              "The Shibuya Incident arc has been absolutely mind-blowing! Let's break down the latest episodes and discuss the incredible character development we're seeing...",
            publishDate: "Yesterday",
          }}
          genres={["Shounen", "Dark Fantasy", "Supernatural"]}
          stats={{
            likes: 432,
            comments: 89,
            shares: 56,
          }}
          isBookmarked={true}
        />
      </div>
    </div>
  )
}

