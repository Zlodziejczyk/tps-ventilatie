import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo/policy";

// force-static so robots.txt builds under output: export. Open policy (D-03): allow
// everything, with no blocked paths anywhere — draft + privacy-beleid pages carry
// their own noindex meta and must stay crawlable for that directive to be seen. AI
// crawlers are allowed on purpose (GEO / AI-citation visibility, a local-discovery channel).
export const dynamic = "force-static";

// Explicit AI-crawler allow entries (the opt-out block list is documented in the
// owner runbook, not enforced here — D-03).
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: CANONICAL_ORIGIN,
  };
}
