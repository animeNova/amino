'use client';
// In a client component
import { addBookmark, removeBookmark, isBookmarked as isBookmarkedAction} from "@/app/actions/bookmarks";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function BookmarkButton({ postId }: { postId: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    // Check if post is bookmarked on component mount
    const checkBookmark = async () => {
      const result = await isBookmarkedAction(postId);
      setIsBookmarked(result);
      setIsLoading(false);
    };
    
    checkBookmark();
  }, [postId]);
  
  const toggleBookmark = async () => {
    setIsLoading(true);
    
    if (isBookmarked) {
      await removeBookmark(postId);
      setIsBookmarked(false);
      router.refresh();
    } else {
      await addBookmark(postId);
      setIsBookmarked(true);
      router.refresh();
    }
    
    setIsLoading(false);
  };
  
  return (
    <motion.div whileTap={{ scale: 0.9 }}>
    <Button
      variant="ghost"
      size="sm"
      className={cn("px-2 transition-colors", isBookmarked ? "bg-primary/10 hover:bg-primary/20" : "")}
      onClick={toggleBookmark}
      disabled={isLoading}
    >
      <Bookmark
        className={cn(
          "h-5 w-5 transition-colors",
          isBookmarked ? "fill-primary text-primary" : "text-muted-foreground",
        )}
      />
    </Button>
  </motion.div>
  );
}