import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Bookmark, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import ShareButtons from "./share-buttons"
import RelatedPosts from "./related-posts"
import CommentSection from "./comment-section"


export default function PostPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      {/* <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Button variant="ghost" size="sm" className="mr-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </nav> */}

      <main className="container max-w-4xl py-6 lg:py-10">
        {/* Post Header */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {["Shounen", "Action", "Supernatural"].map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="rounded-full font-medium bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  {genre}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-primary">
              The Evolution of Anime: From Astro Boy to Modern Masterpieces
            </h1>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarImage src="/placeholder.svg?height=50&width=50" alt="AnimeScholar" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1 rounded-md font-medium">
                  Lv.85
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-bold text-lg">AnimeScholar</p>
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-sm text-muted-foreground">Posted on May 15, 2024</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <span>Follow</span>
              <span className="text-xs text-muted-foreground">(2.4k)</span>
            </Button>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg border">
            <img
              src="/placeholder.svg?height=600&width=1200"
              alt="Evolution of Anime"
              className="object-cover w-full"
            />
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center gap-6 py-4 border-y">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="h-5 w-5" />
              <span>1.2k Likes</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>234 Comments</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </Button>
          </div>

          {/* Post Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              The journey of anime from its humble beginnings to its current global phenomenon status is nothing short
              of remarkable. Starting with Osamu Tezuka's groundbreaking work on Astro Boy in 1963, anime has evolved
              into a diverse and sophisticated medium that continues to push creative boundaries.
            </p>

            <h2>The Golden Age of Anime</h2>
            <p>
              The 1980s and 1990s marked what many consider the golden age of anime. This period saw the release of
              numerous influential works that would shape the industry for decades to come:
            </p>
            <ul>
              <li>Akira (1988) - Revolutionized animation quality and mature storytelling</li>
              <li>Ghost in the Shell (1995) - Defined the cyberpunk genre in anime</li>
              <li>Neon Genesis Evangelion (1995) - Deconstructed the mecha genre</li>
            </ul>

            <h2>Modern Masterpieces</h2>
            <p>
              Today's anime industry continues to produce groundbreaking works. Studios like MAPPA, ufotable, and Kyoto
              Animation are pushing the boundaries of what's possible in animation, while streaming platforms have made
              anime more accessible than ever.
            </p>

            <div className="grid grid-cols-2 gap-4 my-8">
              <img src="/placeholder.svg?height=300&width=400" alt="Classic anime scene" className="rounded-lg" />
              <img src="/placeholder.svg?height=300&width=400" alt="Modern anime scene" className="rounded-lg" />
            </div>

            <h2>The Future of Anime</h2>
            <p>
              As we look to the future, the anime industry shows no signs of slowing down. With new technologies,
              international collaborations, and evolving storytelling techniques, anime continues to captivate audiences
              worldwide.
            </p>
          </article>

          {/* Share Section */}
          <ShareButtons />

          {/* Author Bio */}
          <div className="rounded-lg border p-6 mt-8">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src="/placeholder.svg?height=50&width=50" alt="AnimeScholar" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-1">
                      AnimeScholar
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                    </h3>
                    <p className="text-sm text-muted-foreground">Anime Historian & Cultural Analyst</p>
                  </div>
                  <Button>Follow</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Passionate about analyzing anime's cultural impact and historical significance. Writing about anime,
                  manga, and Japanese pop culture for over a decade.
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Comments Section */}
          <CommentSection />

          {/* Related Posts */}
          <RelatedPosts />

          {/* Navigation Between Posts */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Previous Post
            </Button>
            <Button variant="ghost" className="gap-2">
              Next Post
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

