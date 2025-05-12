import { getCommunityByHandle } from "@/app/actions/community/get";
import CommunityPage from "@/components/community/community-page";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

// Generate dynamic metadata based on community data
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } =await params;
  
  try {
    const community = await getCommunityByHandle(slug);
    if (!community) {
      return {
        title: 'Community Not Found - Amino',
        description: 'The requested community could not be found.'
      };
    }

    return {
      title: `${community.name} - Amino Community`,
      description: community.description || `Join the ${community.name} community on Amino`,
      openGraph: {
        title: `${community.name} - Amino Community`,
        description: community.description || `Join the ${community.name} community on Amino`,
        type: 'website',
        images: [
          {
            url: community.banner || community.image || '',
            width: 1200,
            height: 630,
            alt: community.name
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${community.name} - Amino Community`,
        description: community.description || `Join the ${community.name} community on Amino`,
        images: [community.banner || community.image || '']
      }
    };
  } catch (error) {
    return {
      title: 'Error - Amino Community',
      description: 'An error occurred while loading the community.'
    };
  }
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
