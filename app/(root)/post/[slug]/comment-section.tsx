"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle } from "lucide-react"
import UserAvatar from "@/components/ui/user-avatar"
import { formatDistanceToNow } from "date-fns"
import { NestedComment } from "@/types/comments"
import { createComment } from "@/app/actions/comments/create";
import { useRouter } from "next/navigation"

interface CommentSectionProps {
  comments: NestedComment[];
}

// Memoized Reply Form component
const ReplyForm = memo(
  ({
    authorName,
    onCancel,
    onSubmit,
    autoFocus = false,
  }: {
    authorName: string
    onCancel: () => void
    onSubmit: (content: string) => void
    autoFocus?: boolean
  }) => {
    const [content, setContent] = useState("")

    const handleSubmit = useCallback(() => {
      if (!content.trim()) return
      onSubmit(content)
      setContent("")
    }, [content, onSubmit])

    return (
      <div className="mt-3 space-y-3">
        <Textarea
          placeholder={`Reply to ${authorName}...`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] text-sm"
          autoFocus={autoFocus}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            Reply
          </Button>
        </div>
      </div>
    )
  }
)

ReplyForm.displayName = "ReplyForm"

// Move CommentItem component definition outside and add proper type
interface CommentItemProps {
  comment: NestedComment;
  onReplySubmit: (parentId: string, content: string) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReplySubmit }) => {
  const [isReplying, setIsReplying] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleReplySubmit = async (content: string) => {
    await onReplySubmit(comment.id, content);
    setIsReplying(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <UserAvatar url={comment.userImage} className="w-full h-full" />
            <AvatarFallback>{comment.userName[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] px-1 rounded-md font-medium">
            Lv.54
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.userName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              <Heart className="h-4 w-4" />
              <span>Like</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </Button>
            {comment.is_edited && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>

          {isReplying && (
            <ReplyForm
              authorName={comment.userName}
              onCancel={() => setIsReplying(false)}
              onSubmit={handleReplySubmit}
              autoFocus
            />
          )}
        </div>
      </div>
      {comment.replies.length > 0 && !isCollapsed && (
        <div className="ml-12 space-y-4 border-l-2 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

CommentItem.displayName = "CommentItem"

export default function CommentSection({ comments, postId }: CommentSectionProps & { postId: string }) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      await createComment(postId, {
        content: newComment
      });
      
      setNewComment(""); // Clear the input
      // You might want to refresh the comments list here
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
      router.refresh()
    }
  }

  const handleSubmitReply = async (parentId: string, content: string) => {
    try {
      await createComment(postId, {
        content,
        parentId
      });
      router.refresh()
      // You might want to refresh the comments list here
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        <MessageCircle className="h-6 w-6" />
      </div>

      {/* Comment Form */}
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <UserAvatar url={undefined} className="w-full h-full" />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <Textarea 
            placeholder="Write a comment..." 
            className="min-h-[100px]"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment}
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              onReplySubmit={handleSubmitReply}
            />
          ))
        )}
      </div>
    </section>
  )
}
