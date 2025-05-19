import AnimePostCard from "@/components/posts/postCard";
import { PostQuery } from "@/app/actions/posts/get";
import { cn } from "@/lib/utils";


interface PostListProps {
  posts: PostQuery[];
  className?: string;
}

export default function PostList({ posts , className}: Readonly<PostListProps>) {
  if (!posts || posts.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No posts found</div>;
  }  
  return (
    <div className={cn(className)}>
      {posts.map((post) => (
        <AnimePostCard
          key={post.post_id}
          author={{
            id : post.post_user_id,
            name: post.user_name,
            avatar: post.user_image,
            level: post.userLevel
          }}
          post={{
            id: post.post_id,
            title: post.post_title,
            image: post.post_image,
            excerpt: post.post_content.replace(/<\/?p[^>]*>/g, '').replace(/<[^>]*>/g, ''),
            publishDate: post.post_created_at.toLocaleDateString()
          }}
          genres={post.post_tags}
          stats={{
            likes: post.likeCount ?? 0,
            comments: post.commentCount ?? 0, // You might want to fetch actual comment counts
            shares: 8,    // You might want to fetch actual share counts
          }}
          isLiked={post.isLiked}
        />
      ))}
    </div>
  );
}