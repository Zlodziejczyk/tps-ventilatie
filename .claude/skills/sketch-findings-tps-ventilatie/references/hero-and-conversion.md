# Hero & Conversion Entry

From **Sketch 001 → Variant D ("Proof-forward, engineered")**. The hero is the
highest-leverage surface: premium first impression + immediate trust + 4-pillar
routing + a frictionless contact path, all above the fold.

## Design Decisions

- **Lead with proof + action, not just a headline.** A **proof bar** (reviewer
  avatars + `4,9 ★` + a short quote + "50+ Google-reviews") sits at the very top,
  then headline, then an **inline engineered offerte form** as the primary CTA.
- **Headline** uses a gradient-accent span (`-webkit-background-clip:text`), reflects
  the **4-pillar klimaattechniek** positioning: *"Airco, warmtepomp & ventilatie —
  goed geregeld in Zoetermeer."* (The earlier rotating-word hero is variant A, kept
  for reference; D won.)
- **Engineered offerte form** (the recurring conversion unit): Postcode + Telefoon +
  Dienst `<select>` + a prominent submit, with the blueprint texture + live pulse +
  reassurance line ("Vrijblijvend · geen kosten · AVG-proof").
- **★ Signature interaction:** the 4 **pillar cards route the chosen service straight
  into the offerte form** (pre-selects the `<select>`, nudges the form). Service
  clarity feeds speed-to-contact in one gesture.
- **Nav carries contact:** WhatsApp (accent) + Bel (click-to-call) + Offerte.
- **Background:** pure-CSS aurora (see design-language.md) — premium airy, CWV-safe.
- **Fixes baked in:** the off-brand English "Clean Air Technology" badge is replaced
  with a Dutch one; **Warmtepompen** (net-new pillar) is surfaced with a *Nieuw* tag.

## CSS Patterns

**Hero head: text + form, two columns** (stacks under ~860px container):
```css
.head { display:grid; grid-template-columns: 1.15fr 0.85fr; gap: clamp(28px,4vw,56px); align-items:start; }
@container stage (max-width:860px){ .head{ grid-template-columns:1fr; } }
```

**Proof bar** (rounded surface pill, avatar stack):
```css
.proofbar{display:inline-flex;align-items:center;gap:14px;flex-wrap:wrap;background:var(--color-surface);border-radius:var(--radius-full);padding:9px 9px 9px 18px;box-shadow:var(--shadow-md);}
.proofbar .av i{width:26px;height:26px;border-radius:50%;margin-left:-8px;border:2px solid var(--color-surface);}
```

The engineered form reuses `.engineered::before` (design-language.md) + `.field`
focus ring `box-shadow:0 0 0 4px rgba(0,101,128,.1)`.

## HTML Structures

**Pillar card → offerte routing** (the signature interaction):
```html
<a class="pcard" onclick="routeToOfferte('Warmtepomp', this); return false;">…</a>
<script>
function routeToOfferte(service, card){
  const sel = document.getElementById('d-dienst');
  for (let i=0;i<sel.options.length;i++)
    if (sel.options[i].text.toLowerCase().startsWith(service.toLowerCase())){ sel.selectedIndex=i; break; }
  card.classList.add('routed');               // visual confirm
  /* nudge the form (scale pulse) + toast "… gekozen — vul uw gegevens in" */
}
</script>
```
In the real React build this is a controlled `<select>` value + a ref-scroll to the
form; the form posts via the Phase-5 secure route (NOT the client webhook).

## What to Avoid

- **No WebGL aurora here** — use the CSS aurora (CWV / SEO-10).
- **No English chrome** — all Dutch.
- **Don't bury the offerte action** — proof + form share the first screen; that's the
  whole point of D over the calmer variants A/B.

## Origin

Sketch 001, variant **D**. Full markup + the A/B/C alternatives (for reference) in
`sources/001-homepage-hero/index.html` (winner tab marked ★ Gekozen).
