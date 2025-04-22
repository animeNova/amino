import { getCommunityByHandle } from "@/app/actions/community/get";
import { getUserId } from "@/app/actions/helpers/get-userId";
import CommunityPage from "@/components/community/community-page";
import { getCommentCommunityId, isCommunityMember } from "@/utils/permissions";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default async function page({
  params,
} : Props) {
  const {slug} = await params;
  const userId = await getUserId();
  try {
    const community = await getCommunityByHandle(slug);
    if (!community) {
      // If community is null, show 404 page
      notFound();
    }
    
    return (
      <div>
        <CommunityPage community={community} />
      </div>
    );
  } catch (error) {
    // Log the error for debugging
    console.error(`Error fetching community ${slug}:`, error);
    
    // Show 404 page for any errors
    notFound();
  }
}
