import Heading from "@/components/ui/heading"
import PostList from "@/components/posts/post-list";
import { getPosts } from "@/app/actions/posts/get";

export default async function AnimeFeed() {
  const {posts} = await getPosts({
    orderBy : 'desc'
  });
  return (
    <div className="container py-4 md:py-12 ">
    
        <Heading>
            Featured Posts
        </Heading>


        <PostList posts={posts} className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 w-full" />
    </div>
  )
}

