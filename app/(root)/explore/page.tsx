import { Suspense } from "react"
import { FilterBar } from "@/components/explore/filter-bar"
import Container from "@/components/ui/container"
import { getCommunitys } from "@/app/actions/community/get"
import CommunityCard from "@/components/community/communityCard"
import PaginationButtons from "@/components/ui/pagination-buttons"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Explore Communities - Amino',
  description: 'Discover and join vibrant communities on Amino. Find your perfect community based on your interests, hobbies, and passions.',
  keywords: 'communities, explore, discover, join community, amino communities',
  openGraph: {
    title: 'Explore Communities - Amino',
    description: 'Discover and join vibrant communities on Amino. Find your perfect community based on your interests, hobbies, and passions.',
    type: 'website',
    images: [
      {
        url: '/og-explore.jpg', // Make sure to add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'Explore Amino Communities'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Communities - Amino',
    description: 'Discover and join vibrant communities on Amino. Find your perfect community based on your interests, hobbies, and passions.'
  }
}

interface SearchParams {
  search?: string;
  page?: number;
  sort?: string;
  timeRange?: string;
  genres?: string;
  sizes?: string;
  activities?: string;
}
export default async function ExplorePage({
  searchParams,
}:Readonly<{
  searchParams: SearchParams;
}>) {
  const serviceParams = await searchParams;
  const { activities, genres, page, search, sizes, sort, timeRange } = serviceParams;
  const genresArr = genres?.split(",") ?? [];
  const activitiesArr = activities?.split(",").filter((activity): activity is "very-active" | "active" | "moderate" | "low" => {
    return ["very-active", "active", "moderate", "low"].includes(activity);
  }) ?? [];

  const {communities, totalCount, totalPages, hasMore} = await getCommunitys({
    search: search,
    offset: page ?? 1,
    limit: 6,
    genres: genresArr,
    activities: activitiesArr,
  })

  return (
    <Container>
    <div className="container py-8">
      <div className="flex flex-col gap-6 md:flex-row">
     

        {/* Main content area */}
        <main className="flex-1">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Communities</h1>
              <p className="hidden text-sm text-muted-foreground md:block">
                Showing <span className="font-medium">{communities.length}</span> communities of {totalCount}
              </p>
            </div>

            {/* Mobile filter bar - only visible on mobile */}
            <div className="">
              <FilterBar/>
            </div>

            <Suspense fallback={<div className="h-96 w-full rounded-lg bg-muted animate-pulse" />}>
              <div className="grid grid-row-1 md:grid-cols-3  gap-2">
                {communities.map((el) => (
                  <CommunityCard key={el.id} handle={el.handle} description={el.description} id={el.id} memberCount={el.memberCount} name={el.name} image={el.image} />
                ))}
              </div>
            </Suspense>
            <PaginationButtons currentPage={page ?? 1} totalPages={totalPages} />
            </div>
        </main>
      </div>
    </div>
    </Container>
  )
}
