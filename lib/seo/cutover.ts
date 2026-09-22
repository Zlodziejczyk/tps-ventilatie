// THE CUTOVER DATE — the one place it is ever written (Phase 10, D-17/D-25).
//
// SETTING THIS IS AN ACT, NOT BOOKKEEPING. It arms a live gate: the moment this stops
// being null, `scripts/verify-redirects.ts` switches from "skip loudly" to "assert", and
// `scripts/gsc/thresholds.ts` starts counting the consolidation weeks from it. Plan 10-09
// sets it in the commit that follows the DNS flip — not before, and never as a guess.
//
// Two consumers need ONE answer to "has the cutover happened?". A second copy of this date
// in either of them would be the parallel-list anti-pattern this repo has already been bitten
// by once (the sitemap-vs-robots drift that lib/seo/policy.ts exists to prevent).
//
// NO-BARREL EXCEPTION (P8 D-05): member of the `lib/seo/*` family. Pure, no I/O.

/** ISO YYYY-MM-DD of the day the apex and www A records moved to Vercel. null until 10-09. */
export const LEGACY_CUTOVER_DATE: string | null = null;

/** True once the flip has been declared. The only way downstream code should ask. */
export function isCutoverDeclared(): boolean {
  return LEGACY_CUTOVER_DATE !== null;
}
