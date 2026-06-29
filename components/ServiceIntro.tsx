import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { splitLead, introSource, toParagraphs } from "@/lib/services/text";
import type { PageNode } from "@/lib/services/types";

// The descriptive prose that used to be dumped in the hero (owner feedback
// 2026-06-29: "still a wall of text"). Rendered in a comfortable reading column
// directly under the hero — every word stays on-page for SEO while the hero stays
// lean. The lead sentence remains in the hero; this shows the supporting copy,
// chunked into digestible paragraphs. Left-aligned under the hero's text column
// for visual continuity. Renders nothing when there is no supporting copy.
export function ServiceIntro({ node }: { node: PageNode }) {
  const { rest } = splitLead(introSource(node));
  if (rest === "") return null;
  const paragraphs = toParagraphs(rest, 2);

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
