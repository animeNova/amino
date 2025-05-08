'use Effect';
import AnimePostCard from "@/components/posts/postCard";
import { PostQuery } from "@/app/actions/posts/get";

interface PostListProps {
  posts: PostQuery[];
}

export default function PostList({ posts }: PostListProps) {
  if (!posts || posts.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No posts found</div>;
  }  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {posts.map((post) => (
        <AnimePostCard
          key={post.post_id}
          author={{
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
            likes: post.likeCount || 0,
            comments: 32, // You might want to fetch actual comment counts
            shares: 8,    // You might want to fetch actual share counts
          }}
          isLiked={post.isLiked}
        />
      ))}
    </div>
  );
}