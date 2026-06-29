import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hybrid hosting (Phase 5, QA-01): default Next.js mode — static pages
  // prerender, route handlers run as serverless functions, Image Optimization on.
  trailingSlash: false,
  images: {
    // AVIF must be opted in explicitly — the Next default serves WebP only.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
