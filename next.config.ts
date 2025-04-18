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
    ]
  },
  experimental :{
    authInterrupts : true
  }
};

export default nextConfig;
