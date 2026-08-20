import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { splitLead, introSource, toParagraphs } from "@/lib/services/text";
import type { PageNode } from "@/lib/services/types";

// The descriptive prose that used to be dumped in the hero (owner feedback
// 2026-06-29: "still a wall of text"). Rendered in a comfortable reading column
// directly under the hero — every word stays on-page for SEO while the hero stays
// lean. Left-aligned under the hero's text column for visual continuity.
//
// TWO MODES, because not every page shows its lead sentence the same way:
//
//   default (includeLead omitted) — renders splitLead(...).rest, i.e. the intro
//   MINUS its lead sentence. Pillar and sub-service routes use this: their
//   ServiceHero already displays that lead sentence, so repeating it here would
//   duplicate it on screen.
//
//   includeLead — renders the WHOLE intro. Pages with their own hero markup use
//   this. /diensten is the case: it has a hardcoded hero paragraph and no
//   ServiceHero, so in default mode the authored intro's first sentence would be
//   silently dropped and render NOWHERE.
//
// That is the constraint this prop exists to satisfy: NO AUTHORED SENTENCE MAY
// RENDER NOWHERE. Content that exists in the taxonomy but appears on no page is
// the "the data says one thing, the page does another" defect Phase 8 exists to
// remove — do not simplify this prop away without giving the hub another place
// to show its lead sentence. The default is false so the 21 pillar and
// sub-service routes are byte-identical in output.
export function ServiceIntro({
  node,
  includeLead = false,
}: {
  node: PageNode;
  includeLead?: boolean;
}) {
  const full = introSource(node);
  const body = includeLead ? full.trim() : splitLead(full).rest;
  if (body === "") return null;
  const paragraphs = toParagraphs(body, 2);

  return (
    <AnimateOnScroll as="section" className="max-w-7xl mx-auto px-6 mb-14">
      <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-on-surface-variant">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </AnimateOnScroll>
  );
}
