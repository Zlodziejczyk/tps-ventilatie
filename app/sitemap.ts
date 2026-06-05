import type { MetadataRoute } from "next";
import { sitemapEntries } from "@/lib/seo/policy";

// force-static is mandatory under output: export (RESEARCH §2) so this resolves to
// a build-time /sitemap.xml. Membership lives entirely in the single-source policy
// helper (no hardcoded route list) — the sitemap can never drift from the per-page
// robots directive (D-02). Currently the 4 static content pages; service-surface
// pages auto-join as Phase 4 flips their status to "published".
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries();
}
