import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Allow common external image hosts used in demos and free image providers
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'cdn.pixabay.com',
      'i.imgur.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'media.istockphoto.com',
      'www.freepik.com',
      't4.ftcdn.net',
      'img.freepik.com',
      'st2.depositphotos.com',
      'www.shutterstock.com',
      'cdn.shopify.com',
      'images.ctfassets.net',
      'd3c9jyj3w509b2.cloudfront.net',
      'bing.com',
      'images.unsplash.com',
    ],
  },
};

export default nextConfig;
