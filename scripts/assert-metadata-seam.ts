// Build-time CLI assertion — NOT shipped runtime code.
// Intentional console.log/console.error usage (build-time reporting) and
// node:assert-only (no jest/vitest — test frameworks are out of scope this
// milestone per REQUIREMENTS; Node built-ins suffice).
//
// Run on demand:  npx tsx scripts/assert-metadata-seam.ts
// Guards the ONE bypass the relational indexation invariant cannot see (D-04).
// checkIndexationInvariants() reasons about taxonomy nodes; it is structurally
// blind to a route that hand-writes its own robots directive in its metadata
// export. lib/seo/metadata.ts buildMetadata() derives that directive from the
// single-source policy, so it must stay the only way a page gets one. This turns
// "the seam is the only way" from a comment into an enforced rule.
//
// Because the check is source-level, it strips comments before matching — every
// occurrence of the words this guard looks for under app/ today sits inside an
// explanatory comment, so an unstripped scan would fail on day one. The stripping
// is regex-based and therefore approximate; D-04 explicitly permits dropping this
// guard if it ever turns into fragile maintenance. It is a cheap safety net, not
// load-bearing architecture.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const APP_DIR = "app";

// app/robots.ts IS the robots.txt route handler — it legitimately names the
// concept. It writes no per-page index directive.
const ALLOWLIST = new Set([path.join("app", "robots.ts")]);

function walk(dir: string): string[] {
  const found: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...walk(full));
    } else if (entry.isFile() && /\.tsx?$/.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
}

// Block comments first (this also covers the JSX `{/* … */}` form), then line
// comments — matching `//` only when it is NOT preceded by a colon, so URLs like
// https://example.com survive intact.
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

const files = walk(APP_DIR);
const pageRoutes = files.filter((file) => path.basename(file) === "page.tsx");

assert(files.length > 0, `no .ts/.tsx files found under ${APP_DIR}/ — the scan is misconfigured`);
assert(pageRoutes.length > 0, `no page.tsx routes found under ${APP_DIR}/ — the scan is misconfigured`);

const offenders: string[] = [];
const missingSeam: string[] = [];

for (const file of files) {
  const code = stripComments(fs.readFileSync(file, "utf8"));

  if (!ALLOWLIST.has(file)) {
    if (/\brobots\s*:/.test(code)) {
      offenders.push(`${file} — declares a literal \`robots\` metadata key`);
    }
    if (/\bindex\s*:\s*false/.test(code)) {
      offenders.push(`${file} — declares a literal noindex directive`);
    }
  }

  if (path.basename(file) === "page.tsx" && !/\bbuildMetadata\b/.test(code)) {
    missingSeam.push(file);
  }
}

if (offenders.length > 0) {
  console.error("✗ Per-page robots directive written outside the seam:");
  for (const offender of offenders) {
    console.error(`  ${offender}`);
  }
}
assert.equal(
  offenders.length,
  0,
  "a per-page robots directive may only come from buildMetadata() in lib/seo/metadata.ts — " +
    "the relational indexation gate cannot see a route that writes its own, so such a page could " +
    "go dark (or get indexed) with every guard still green",
);

if (missingSeam.length > 0) {
  console.error("✗ Page routes not going through the metadata seam:");
  for (const file of missingSeam) {
    console.error(`  ${file}`);
  }
}
assert.equal(
  missingSeam.length,
  0,
  "every app/**/page.tsx must import buildMetadata from @/lib/seo/metadata — that is the single " +
    "seam where canonical, OG/Twitter and the robots directive are derived",
);

console.log(
  `✅ Metadata seam intact — ${files.length} files scanned under ${APP_DIR}/, ${pageRoutes.length} page routes all build metadata through buildMetadata(), no route writes its own index directive.`,
);
