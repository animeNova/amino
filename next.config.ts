import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns : [
      {
        hostname : 'lh3.googleusercontent.com'
      },
      {
        hostname : 'thumbs.dreamstime.com'
      },
      {
        hostname : 'sapphire-changing-rodent-630.mypinata.cloud'
      },
      {
        hostname : 'images.unsplash.com'
      },
      {
        hostname : 'picsum.photos'
      },
    ]
  },
  experimental :{
    authInterrupts : true,
  },
  transpilePackages : ['isomorphic-dompurify' , 'keyv'],
  typescript: {
    // This will allow builds to complete even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
  
  // Add this configuration
  unstable_allowDynamic: [
    '/app/**/page.tsx', // Allow dynamic rendering for all page components
  ],
};

export default nextConfig;
