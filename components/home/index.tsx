import Hero from "./hero/Hero";
import Trending from './trending_communities/index'
import FeaturedPosts from './featured_posts'
const index = () => {
  return (
    <div>
      <Hero />
      <Trending />
      <FeaturedPosts />
    </div>
  )
}

export default index
