// Build-time CLI — the first link in the prebuild guard chain (package.json
// `prebuild` runs all eight guards; this one leads because a broken taxonomy
// makes every later assertion meaningless). npm runs the chain BEFORE
// `next build`; a non-zero exit from any guard aborts the build, making all of
// them genuinely build-blocking (D-07/D-08, extended by Phase-8 D-01).
//
// console.log / console.error / process.exit are INTENTIONAL and correct here —
// this is a build-time CLI, NOT shipped runtime code (so the no-console-in-
// production rule does not apply). The script imports only local @/lib modules
// and prints to stdout/stderr — no fs writes, no network (Information-Disclosure
// boundary kept tight).

import { z } from "zod";
import { pagesSchema } from "@/lib/services/types";
import { PAGES } from "@/lib/services/registry";

const result = pagesSchema.safeParse(PAGES);

if (!result.success) {
  console.error("✗ Taxonomy validation failed — aborting build.\n");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

console.log(`✅ Taxonomy valid — ${PAGES.length} pages passed pagesSchema.`);
