import { getUserBookmarks } from "@/app/actions/bookmarks";
import { Metadata } from "next";
import PostList from "@/components/posts/post-list";
import Container from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Bookmarks | Amino",
  description: "View your bookmarked posts",
};

interface BookmarksPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function BookmarksPage({ searchParams }: BookmarksPageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  
  const { bookmarks, totalCount, hasMore } = await getUserBookmarks({
    limit,
    offset,
  });
  
  const totalPages = Math.ceil(totalCount / limit);
  
  return (
    <Container>
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Your Bookmarks</h1>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground">
            When you bookmark posts, they'll appear here.
          </p>
        </div>
      ) : (
        <PostList
        posts={bookmarks}
        />
      )}
    </div>
    </Container>
  );
}