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


        <PostList posts={posts} />
    </div>
  )
}

