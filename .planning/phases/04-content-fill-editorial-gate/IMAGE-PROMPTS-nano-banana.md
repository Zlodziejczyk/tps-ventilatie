# Hero / site imagery — Nano Banana (Gemini image) prompts

> Owner has access to **Nano Banana** (Gemini 2.5 Flash Image). Claude drafts the
> prompts; owner generates; Claude `sips`-optimizes + wires the files in. This
> unblocks the TIER-3 imagery that was waiting on Thomas's photos.
> Style anchor = the validated "Atmospheric Clarity, engineered" / Daikin-grade
> direction (sketch-findings-tps-ventilatie).

## How to use

1. Generate **#1 (homepage hero) first** as the style anchor.
2. For the rest, either re-paste the STYLE BLOCK or tell Nano Banana *"same
   photographic style, lighting and color grade as the previous image."* This
   keeps the set cohesive so the site feels like one shoot.
3. **No baked-in text or logos** — we overlay headlines in code and can composite
   the real TPS logo in post. Keep equipment **generic white/neutral** (don't ask
   for Daikin/Mitsubishi logos on units — keeps it truthful + avoids mangled text).
4. Generate **landscape**, highest quality. Name files by slot (below) and send
   them over; I'll resize (~1600px wide), compress, and place in `public/images/`.

## STYLE BLOCK (append to every prompt)

```
Photorealistic editorial photography, premium HVAC brand-campaign look (Daikin /
Mitsubishi Electric calibre). Bright and airy, soft natural cool daylight, clean
minimal Dutch residential setting. Light neutral palette — whites, pale grey-blue,
light oak — with subtle teal and green accents. Shallow depth of field, crisp
focus on the subject, gentle soft shadows, low contrast, tidy and uncluttered,
high-end. Natural realistic colour. No text, no watermarks, no brand logos. High
resolution, sharp detail.
```

## Prompts

### 1 — `home-hero.jpg` · homepage hero (16:9, text-safe)
```
A bright modern Dutch living room in soft morning light. A sleek white wall-
mounted air-conditioning unit sits high on a clean wall above a low oak sideboard
with a green plant; large windows reveal a leafy Dutch street. The right two-
thirds shows the room; the left third is calm empty wall space reserved for a text
overlay. Wide 16:9 cinematic composition. [STYLE BLOCK]
```

### 2 — `airco.jpg` · Airconditioning (3:2)
```
A friendly professional installer in clean light-grey workwear mounts a white
split air-conditioning unit on the wall of a bright modern living room, using a
spirit level, calm and focused. Natural daylight, a few plants, tidy space. Mid-
shot, technician on the right, open bright wall on the left for text. 3:2 aspect
ratio. [STYLE BLOCK]
```

### 3 — `warmtepompen.jpg` · Warmtepompen / heat pump (3:2)
```
A modern white air-source heat-pump outdoor unit installed neatly on a clean paved
base beside a contemporary Dutch brick townhouse, low planting and a tidy garden,
bright blue sky with soft clouds. Crisp, premium, aspirational. 3:2 aspect ratio,
calm sky above the unit for text. [STYLE BLOCK]
```

### 4 — `wtw.jpg` · WTW / heat-recovery ventilation (3:2)
```
A clean white heat-recovery ventilation (WTW) unit with tidy insulated ducts
mounted in a bright, organised utility room; a technician in light workwear checks
a filter, precise and calm. Modern, spotless, technical-but-approachable. Mid-shot.
3:2 aspect ratio. [STYLE BLOCK]
```

### 5 — `mv.jpg` · Mechanische ventilatie (3:2)
```
Elegant close detail of a modern round white ventilation valve in a bright
minimalist bathroom ceiling, soft daylight, a gloved hand gently adjusting it;
clean tiles, fresh airy feeling. 3:2 aspect ratio, calm negative space. [STYLE
BLOCK]
```

### 6 — `trust.jpg` · human "life" / trust shot (3:2)
```
A warm genuine moment: a friendly HVAC technician in clean light workwear shows a
tablet to a relaxed Dutch homeowner in a bright modern kitchen, both looking at the
screen with natural smiles, soft daylight. Trust and craftsmanship. Mid-shot,
uncluttered. 3:2 aspect ratio. [STYLE BLOCK]
```

## Planned placement (final call once images land)

- `home-hero.jpg` → homepage hero scene (Phase 6 uplift) — biggest "life" win.
- Pillar images (`airco/warmtepompen/wtw/mv`) → a soft hero treatment on the
  **pillar** pages (right-column image or subtle hero accent). **Keep the trust
  card on the service detail pages** — it converts; images complement, not replace.
- `trust.jpg` → over-ons / trust band / homepage proof section.
- All wired via `next/image` (`unoptimized: true` static export) — pre-sized so
  CWV stays green (SEO-10 mobile-INP).
