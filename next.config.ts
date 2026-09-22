import type { NextConfig } from "next";
// Relative, not the `@/` alias — see the IMPORT DISCIPLINE note in lib/seo/redirects.ts.
// Aliases in the next.config.ts module graph resolve against the compiled config's location,
// not the importing file's, and fail at build time in a way no local check reproduces.
import { toCatchAllRedirect, toNextRedirects, toTrailingSlashRedirect } from "./lib/seo/redirects";

const nextConfig: NextConfig = {
  // Hybrid hosting (Phase 5, QA-01): default Next.js mode — static pages
  // prerender, route handlers run as serverless functions, Image Optimization on.
  trailingSlash: false,
  // Phase 10 / §Pitfall 1. With this unset, Next.js `unshift`es a `/:path+/` → `/:path+` 308 to
  // the FRONT of the redirects array, ahead of every rule below — so a legacy URL like
  // /over-ons/ would cost TWO hops and MIG-07 could never be green. Disabling it and re-adding
  // the identical rule LAST puts the ordering under our control. Removing this line silently
  // reintroduces the second hop; scripts/verify-redirects.ts is what catches that.
  skipTrailingSlashRedirect: true,
  images: {
    // AVIF must be opted in explicitly — the Next default serves WebP only.
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      ...toNextRedirects(), // 9 explicit, most specific first
      toCatchAllRedirect(), // then the host-gated catch-all (D-12: after, never before)
      toTrailingSlashRedirect(), // then canonical-host normalisation
    ];
  },
};

export default nextConfig;
