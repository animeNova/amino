
import { getCommunitys } from '@/app/actions/community/get';
import CommunityCard from '@/components/ui/communityCard';
import Heading from '@/components/ui/heading'
import React from 'react'





const index =async () => {
  const {communities} =await getCommunitys()
  return (
    <section className="container py-8 md:py-12">
        <Heading>
            Trending Communities
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <CommunityCard key={community.id} id={community.id} name={community.name} handle={community.handle} description={community.description} memberCount={community.memberCount} image={community.image} />
            ))}
          </div>
    </section>
  )
}

export default index
