// Shared presentation helpers for service/pillar copy. Pure functions — no React,
// no data. The hero shows the lead sentence; ServiceIntro renders the rest below,
// so both derive the same split from one implementation (D-06 fallback-safe).

// Split an (owner-approved) intro string into a lead sentence + the supporting
// copy. Boundary = first .?! followed by whitespace + a capital, with a >=30-char
// minimum lead so it never breaks on an early abbreviation ("bijv.", "incl.").
// No boundary found → the whole string is the lead and rest is "" (short
// draft/navDescription fallbacks never regress).
export function splitLead(text: string): { lead: string; rest: string } {
  const trimmed = text.trim();
  const boundary = /[.!?]\s+(?=[A-ZÀ-Þ])/g;
  let match: RegExpExecArray | null;
  while ((match = boundary.exec(trimmed)) !== null) {
    const end = match.index + 1; // keep the punctuation on the lead
    if (end >= 30) {
      return { lead: trimmed.slice(0, end), rest: trimmed.slice(end).trim() };
    }
  }
  return { lead: trimmed, rest: "" };
}

// The hero/intro source: the owner-approved intro, falling back to navDescription
// when intro is empty (draft shells, D-06).
export function introSource(node: {
  content: { intro: string };
  navDescription: string;
}): string {
  return node.content.intro.trim() !== ""
    ? node.content.intro
    : node.navDescription;
}

// Group prose into `count` roughly balanced paragraphs, splitting only at sentence
// boundaries, so long intro copy reads in digestible chunks instead of one wall
// (owner feedback 2026-06-29). Falls back to a single paragraph when there are too
// few sentences to split cleanly.
export function toParagraphs(text: string, count = 2): string[] {
  const trimmed = text.trim();
  if (trimmed === "") return [];
  const sentences = trimmed.match(/[^.!?]+[.!?]+(?:\s|$)/g);
  if (!sentences || sentences.length < count + 1) return [trimmed];
  const per = Math.ceil(sentences.length / count);
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += per) {
    out.push(sentences.slice(i, i + per).join("").trim());
  }
  return out.filter((p) => p !== "");
}
