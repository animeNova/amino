import { Metadata } from 'next';
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Bookmark, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import RelatedPosts from "./related-posts"
import CommentSection from "./comment-section"
import Container from "@/components/ui/container"
import ShareDialog from "../../../../components/ui/share-dialog"
import { headers } from "next/headers"
import { getPostById } from "@/app/actions/posts/get"
import UserAvatar from "@/components/ui/user-avatar"
import DOMPurify from 'isomorphic-dompurify';
import { getNestedComments } from '@/app/actions/comments/get';
import LikeButton from '@/components/posts/like';
import { notFound } from 'next/navigation';

interface AnimePostProps {
  params : {
    slug : string
  }
}

// Add metadata generation
export async function generateMetadata({ params }: AnimePostProps): Promise<Metadata> {
  const {slug} = await params;
  const post = await getPostById(slug);
  
  return {
    title: post?.post_title,
    description: post?.post_content.substring(0, 160).replace(/<[^>]*>/g, ''), // Strip HTML and limit to 160 chars
    openGraph: {
      title: post?.post_title,
      description: post?.post_content.substring(0, 160).replace(/<[^>]*>/g, ''),
      images: [
        {
          url: post?.post_image || '',
          width: 1200,
          height: 630,
          alt: post?.post_title,
        },
      ],
      type: 'article',
      authors: [post?.user_name || ''],
      publishedTime: post?.post_created_at.toISOString(),
      tags: post?.post_tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.post_title,
      description: post?.post_content.substring(0, 160).replace(/<[^>]*>/g, ''),
      images: [post?.post_image || ''],
    }
  };
}

export default async function PostPage({params} : AnimePostProps) {
  const {slug} = await params;
  const post = await getPostById(slug)
  const {comments,totalCount} = await getNestedComments(slug)
    // Get the host from headers
    const headersList =await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    
    // Construct the full post URL
    const postUrl = `${baseUrl}/post/${slug}`;
  if(!post){
      notFound();
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="sticky top-12 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Button variant="ghost" size="sm" className="mr-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Button>
          <div className="flex items-center gap-2">
            <ShareDialog
                postTitle="The Evolution of Anime: From Astro Boy to Modern Masterpieces"
                postUrl={postUrl}
              />
            <Button variant="ghost" size="sm">
              <Bookmark className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </nav>
    <Container>
      <main className="container max-w-4xl py-6 lg:py-10">
        {/* Post Header */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {post?.post_tags.map((genre) => (
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
             {post?.post_title}
            </h1>
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <UserAvatar url={post?.user_image!} className="w-full h-full" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs px-1 rounded-md font-medium">
                  Lv.85
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-bold text-lg">{post?.user_name}</p>
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-sm text-muted-foreground">Posted on {post?.post_created_at.toLocaleDateString()}</p>
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
              src={post?.post_image}
              alt="Evolution of Anime"
              className="object-cover w-full"
            />
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center gap-6 py-4 border-y">
            <LikeButton postId={post.post_id} isLiked={post.isLiked != null} likes={post.likeCount!}  />
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>234 Comments</span>
            </Button>
            <ShareDialog
                postTitle="The Evolution of Anime: From Astro Boy to Modern Masterpieces"
                postUrl={postUrl}
              />
          </div>

          {/* Post Content */}
          <article 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post?.post_content || '')
            }}
          />

          {/* Author Bio */}
          <div className="rounded-lg border p-6 mt-8">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                  <UserAvatar url={post?.user_image!} className="w-full h-full" />
                  <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-1">
                      {post?.user_name}
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                    </h3>
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
          <CommentSection comments={comments} postId={post?.post_id!} />

          {/* Related Posts */}
          {/* <RelatedPosts /> */}

  
       
        </div>
      </main>
      </Container>
    </div>
  )
}

