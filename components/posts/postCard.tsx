"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Share2, Bookmark, MoreHorizontal, Sparkles, Eye, Delete } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { motion } from "framer-motion"
import UserAvatar from "../ui/user-avatar"
import Link from "next/link"
import LikeButton from "./like"
import { useSession } from "@/lib/auth/client" // Added
import { canEditPost, canDeletePost, getPostPermissions } from "@/utils/permissions" // Added
import { UpdatePostDialog } from "../dialogs/post/update-post"
import { DeleteConfirmationModal } from "../delete-confirmation-modal"
import { deletePost } from "@/app/actions/posts/delete" // Add this import
import { useRouter } from "next/navigation" // Add this import
import { toast } from "@/hooks/use-toast"

interface AnimePostCardProps {
  author: {
    id:string;
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
}: Readonly<AnimePostCardProps>) {
  // Initialize state with null to prevent hydration mismatch
  const [bookmarked, setBookmarked] = useState<boolean | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  // const [canEdit , setCanEdit] = useState(false) // This line was present in context, removing if not used or renaming
  const [canEditPermission, setCanEditPermission] = useState(false); // Added
  const [canDeletePermission, setCanDeletePermission] = useState(false); // Added
  const [isOpen, setIsOpen] = useState(false); // Added for dialog state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Add this for delete modal
  const [isDeleting, setIsDeleting] = useState(false); // Add this for delete state
  const { data: session, isPending } = useSession(); // Added
  const router = useRouter(); // Add this for navigation after deletion

  // Set the initial state after component mounts on client
  useEffect(() => {
    setBookmarked(isBookmarked)
  }, [stats.likes, isBookmarked])

  useEffect(() => { // Added useEffect for permissions
    const checkPermissions = async () => {
      if (!isPending && session?.user?.id && post.id) {
        const userId = session.user.id;
        const {canDelete,canEdit} = await getPostPermissions(userId, post.id);
        setCanEditPermission(canEdit);
        setCanDeletePermission(canDelete);
      } else {
        setCanEditPermission(false);
        setCanDeletePermission(false);
      }
    };

    checkPermissions();
  }, [post.id, session]);


  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }


  // Add this function to handle post deletion
  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      const response = await deletePost(post.id);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Post Deleted successfully"
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to Delete post",
          variant: "destructive"
        });
      }
      router.refresh(); // Refresh the page to show updated content
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
              <Link href={`/profile/${author.id}`}>
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
              </Link>
            
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
              {canEditPermission && ( // Added conditional Edit
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                  Edit Post
                </DropdownMenuItem>
              )}
              {canDeletePermission && ( // Added conditional Delete
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => setIsDeleteModalOpen(true)} // Update this to open delete modal
                >
                  Delete Post
                </DropdownMenuItem>
              )}
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
    
    {/* Add the UpdatePostDialog */}
    {isOpen && (
      <UpdatePostDialog
        postId={post.id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    )}
    
    {/* Add the DeleteConfirmationModal */}
    <DeleteConfirmationModal
      open={isDeleteModalOpen}
      onOpenChange={setIsDeleteModalOpen}
      onConfirm={handleDeletePost}
      isDeleting={isDeleting}
      title="Delete Post"
      description="Are you sure you want to delete this post? This action cannot be undone."
      itemName={post.title}
      itemType="post"
    />
    </>
  )
}

