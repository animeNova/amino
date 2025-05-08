import { getCommunityByHandle } from "@/app/actions/community/get";
import CommunityPage from "@/components/community/community-page";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default async function page({
  params,
} : Props) {
  const { slug } =await params;
  
  try {
    const community = await getCommunityByHandle(slug);
    if (!community) {
      // If community is null, show 404 page
      notFound();
    }
    
    return (
      <div>
        <CommunityPage community={community}  />
      </div>
    );
  } catch (error) {
    // Log the error for debugging
    console.error(`Error fetching community ${slug}:`, error);
    
    // Show 404 page for any errors
    notFound();
  }
}
