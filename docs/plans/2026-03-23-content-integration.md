# Content Integration from Scraped Data

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate all real content, pricing, and images from the scraped `.firecrawl/` data into the existing Next.js webapp.

**Architecture:** Update existing components with real data from scraped markdown files. Download product images from original site. No new pages needed — all content fits into existing routes. The PricingTabs component gets the biggest overhaul (real WTW prices + full MV tab). Diensten page gets enriched descriptions.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, next/image

---

### Task 1: Download Product Images

**Files:**
- Create: `public/images/wtw/hru-200-eco.jpg`
- Create: `public/images/wtw/hru-350-eco.jpg`
- Create: `public/images/wtw/hru-300-eco.jpg`
- Create: `public/images/wtw/zehnder-comfoair-e.jpg`
- Create: `public/images/wtw/zehnder-comfoair-q.jpg`
- Create: `public/images/wtw/orcon-ecomax.jpg`
- Create: `public/images/mv/basis-reinigen.jpg`
- Create: `public/images/mv/compleet-reinigen.jpg`
- Create: `public/images/mv/compleet-reinigen-co2.jpg`
- Create: `public/images/mv/dakventilator-onderhoud.jpg`
- Create: `public/images/mv/dakventilator-vervangen.jpg`
- Create: `public/images/mv/dakventilator-itho.jpg`
- Create: `public/images/mv/dakventilator-zehnder.jpg`
- Create: `public/images/work/tpsventilatie-work.jpg`
- Create: `public/images/work/kanalen-voor.jpg`
- Create: `public/images/work/kanalen-na.jpg`

**Step 1: Download all images from original site**

Download from these URLs (found in `.firecrawl/` markdown files):
```
# WTW Units
https://tpsventilatie.nl/wp-content/uploads/00-itho-daalderop-wtw-hoogbouw-hru-200-tpsventilatie.jpg
https://tpsventilatie.nl/wp-content/uploads/00-hru-eco-350_front-tpsventilatie.jpg
https://tpsventilatie.nl/wp-content/uploads/00-Itho-Daalderop-WTW-HRU-ECO-300-tpsventilatie.jpg
https://tpsventilatie.nl/wp-content/uploads/00-zehnder-comfoair-e-wtw-unit-tpsventilatie.jpg
https://tpsventilatie.nl/wp-content/uploads/00-zehnder-comfoair-q-serie-tpsventilatie.jpg
https://tpsventilatie.nl/wp-content/uploads/00-wtw-orcon-tpsventilatie.jpg

# MV / Dakventilator
https://tpsventilatie.nl/wp-content/uploads/wtw-inregelen-Basis-REINIGEN.jpg
https://tpsventilatie.nl/wp-content/uploads/wtw-inregelen-Compleet-REINIGEN.jpg
https://tpsventilatie.nl/wp-content/uploads/wtw-inregelen-Compleet-REINIGEN-co2.jpg
https://tpsventilatie.nl/wp-content/uploads/mv-vervangen-1.jpg
https://tpsventilatie.nl/wp-content/uploads/mv-vervangen-2.jpg
https://tpsventilatie.nl/wp-content/uploads/mv-dakvent-002.jpg
https://tpsventilatie.nl/wp-content/uploads/mv-dakvent-001.jpg

# Work photos
https://tpsventilatie.nl/wp-content/uploads/tpsventilatie-work.jpeg
https://tpsventilatie.nl/wp-content/uploads/00-img_7305-2-tpsventilatie.jpg
https://tpsventilatie.nl/wp-content/uploads/00-img_7304-1536x1024-tpsventilatie.jpg
```

Save into organized subdirectories under `public/images/`.

**Step 2: Verify all images downloaded**

Run: `ls -la public/images/wtw/ public/images/mv/ public/images/work/`
Expected: All image files present with non-zero file sizes.

---

### Task 2: Update WTW Vervangen Pricing Data

**Files:**
- Modify: `components/PricingTabs.tsx` (lines 15-20, WTW_UNITS array)

**Step 1: Replace WTW_UNITS with real scraped data**

Replace the `WTW_UNITS` array with:
```typescript
const WTW_UNITS = [
  {
    name: "Itho Daalderop HRU 200 ECO",
    image: "/images/wtw/hru-200-eco.jpg",
    price: "€ 1.450,-",
    highlight: "Voorzien van vuilfilterindicatie",
    specs: ["Capaciteit: 200 m\u00b3/h", "Rendement: 87%", "Installatietijd: 3-5 uur", "Op voorraad"],
    features: ["Vakkundige installatie", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
  {
    name: "Itho Daalderop HRU 350 ECO",
    image: "/images/wtw/hru-350-eco.jpg",
    price: "€ 1.650,-",
    highlight: "Voorzien van vuilfilterindicatie",
    specs: ["Capaciteit: 350 m\u00b3/h", "Rendement: 89,3%", "Installatietijd: 3-5 uur", "Op voorraad"],
    features: ["Vakkundige installatie", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
  {
    name: "Itho Daalderop HRU 300 ECO",
    image: "/images/wtw/hru-300-eco.jpg",
    price: "€ 2.400,-",
    highlight: "Voorzien van vuilfilterindicatie",
    specs: ["Capaciteit: 300 m\u00b3/h", "Rendement: 91,2%", "Installatietijd: 3-5 uur", "Op voorraad"],
    features: ["Vakkundige installatie", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
  {
    name: "Zehnder Comfoair E300/400",
    image: "/images/wtw/zehnder-comfoair-e.jpg",
    price: "€ 2.700,-",
    highlight: "SUPER STIL",
    specs: ["Capaciteit: 350/450/600 m\u00b3/h", "Rendement: 98,6%", "Installatietijd: 3-5 uur", "Op voorraad"],
    features: ["Vakkundige installatie", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: true,
  },
  {
    name: "Zehnder Comfoair Q350/450/600",
    image: "/images/wtw/zehnder-comfoair-q.jpg",
    price: "€ 3.500,-",
    highlight: "Voorzien van vuilfilterindicatie",
    specs: ["Capaciteit: 350/450/600 m\u00b3/h", "Rendement: 98,6%", "Installatietijd: 3-5 uur", "Op voorraad"],
    features: ["Vakkundige installatie", "Ingebouwde vochtsensor", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
  {
    name: "Orcon HRC Ecomax 300/400",
    image: "/images/wtw/orcon-ecomax.jpg",
    price: "€ 2.200,-",
    highlight: "Boven- en zijaansluitingen",
    specs: ["Capaciteit: 300/400 m\u00b3/h", "Rendement: 99,3%", "Installatietijd: 3-5 uur", "Op voorraad"],
    features: ["Vakkundige installatie", "Ingebouwde vochtsensor", "Inregelen WTW", "Reinigen en afstellen ventielen", "Reinigen afzuig- en toevoerkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
];
```

**Step 2: Update WTW card rendering to show images, specs, and features**

Update the WTW Vervangen section JSX to render product images (using next/image), highlight badge, specs list, and expandable features list. Show 3 cards per row on desktop.

---

### Task 3: Update WTW Onderhoud Pricing Data

**Files:**
- Modify: `components/PricingTabs.tsx` (lines 22-26, ONDERHOUD array)

**Step 1: Replace ONDERHOUD with real scraped data**

```typescript
const WTW_ONDERHOUD = [
  {
    label: "WTW Klein Onderhoud",
    price: "€ 180,-",
    time: "45-90 minuten",
    benefits: ["Verbeterde luchtkwaliteit", "Optimale werking", "Energiebesparing", "Verlengde levensduur"],
    features: ["Onderhoud WTW unit", "Onderhoud warmtewisselaar", "Reinigen afvoer- en toevoermotor", "Reinigen en afstellen ventielen", "Meten van luchtdebiet", "Foto's voor en na", "Uitleg en advies"],
    popular: false,
  },
  {
    label: "WTW Groot Onderhoud",
    price: "€ 280,-",
    time: "60-120 minuten",
    benefits: ["Verbeterde luchtkwaliteit", "Optimale werking", "Verlengde levensduur", "Energiebesparing"],
    features: ["Onderhoud WTW unit", "Onderhoud warmtewisselaar", "Reinigen afvoer- en toevoermotor", "Reinigen afzuig kanalen", "Inspectie toevoer kanalen", "Reinigen en afstellen ventielen", "Meten van luchtdebiet", "Inregelen volgens bouwbesluit normen", "Foto's voor en na", "Uitleg en advies"],
    popular: true,
  },
  {
    label: "WTW Kanalen Reinigen",
    price: "€ 200,-",
    time: "45-90 minuten",
    benefits: ["Verlengde levensduur", "Optimale werking", "Verbeterde luchtkwaliteit", "Energiebesparing"],
    features: ["Reinigen afzuig kanalen", "Inspectie toevoer kanalen", "Foto's voor en na", "Uitleg en advies"],
    popular: false,
  },
];
```

**Step 2: Remove the INREGELEN array entirely** (lines 28-32)

The inregelen section is no longer separate — it's included as a feature in each WTW vervangen package.

**Step 3: Update the Onderhoud section JSX**

Show time estimate, benefits badges, and full feature list for each package.

---

### Task 4: Build Full MV Tab

**Files:**
- Modify: `components/PricingTabs.tsx` (lines 179-192, MV tab section)

**Step 1: Add MV pricing data arrays**

```typescript
const MV_ONDERHOUD = [
  {
    label: "MV Groot Onderhoud",
    price: "€ 195,-",
    features: ["Grondig reinigen ventilatiebox", "Inspectie ventilatiebox", "Reinigen ventielen", "Afstellen ventielen", "Reinigen ventilatiekanalen", "Inregelen systeem", "Voor & na foto's", "Uitleg en advies"],
    popular: true,
  },
  {
    label: "MV Klein Onderhoud",
    price: "€ 105,-",
    features: ["Grondig reinigen ventilatiebox", "Inspectie ventilatiebox", "Afstellen ventielen", "Inregelen systeem", "Voor & na foto's", "Uitleg en advies"],
    popular: false,
  },
  {
    label: "MV Kanalen Reinigen",
    price: "€ 165,-",
    features: ["Reinigen ventilatiekanalen", "Voor & na foto's", "Energiebesparing"],
    popular: false,
  },
];

const MV_VERVANGEN = [
  {
    label: "Basis + Reinigen",
    image: "/images/mv/basis-reinigen.jpg",
    price: "€ 480,-",
    product: "Zehnder Comfofan Silent",
    specs: ["Capaciteit: 450 m\u00b3/h", "7 jaar garantie", "Inclusief vochtsensor", "Installatietijd: 45-90 min"],
    features: ["Vakkundige installatie", "Ingebouwde vochtsensor", "Inregelen ventilatiebox", "Reinigen en afstellen ventielen", "Reinigen luchtkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
  {
    label: "Compleet + Reinigen",
    image: "/images/mv/compleet-reinigen.jpg",
    price: "€ 540,-",
    product: "Zehnder Comfofan Silent",
    specs: ["Capaciteit: 450 m\u00b3/h", "7 jaar garantie", "Inclusief vochtsensor", "Installatietijd: 45-90 min"],
    features: ["Vakkundige installatie", "Ingebouwde vochtsensor", "Inclusief afstandsbediening", "4 nieuwe Zehnder ventielen", "Inregelen ventilatiebox", "Reinigen en afstellen ventielen", "Reinigen luchtkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: true,
  },
  {
    label: "Compleet + Reinigen + CO2",
    image: "/images/mv/compleet-reinigen-co2.jpg",
    price: "€ 850,-",
    product: "Zehnder Comfofan Silent",
    specs: ["Capaciteit: 450 m\u00b3/h", "7 jaar garantie", "Inclusief vocht- en CO2-sensor", "Installatietijd: 60-120 min"],
    features: ["Vakkundige installatie", "Ingebouwde vochtsensor", "Externe CO2-sensor (220V)", "Inregelen ventilatiebox", "Reinigen en afstellen ventielen", "Reinigen luchtkanalen", "Uitleg en advies", "Foto's voor en na"],
    popular: false,
  },
];

const MV_DAKVENTILATOR = [
  {
    label: "Dakventilator Onderhoud",
    image: "/images/mv/dakventilator-onderhoud.jpg",
    price: "€ 190,-",
    features: ["Inspectie van dakventilator", "Reiniging van ventilatiekanalen", "Dakventilator schoon borstelen", "Reinigen en afstellen ventielen", "Meten van luchtdebiet", "Inregelen volgens bouwbesluit", "Voor & na foto's", "Uitleg & ventilatieadvies"],
    popular: false,
  },
  {
    label: "Dakventilator Groot Onderhoud",
    image: "/images/mv/dakventilator-onderhoud.jpg",
    price: "€ 250,-",
    features: ["Inspectie van dakventilator", "Reiniging van ventilator", "Reiniging van ventilatiekanalen", "Reinigen en afstellen ventielen", "Meten van luchtdebiet", "Inregelen volgens bouwbesluit", "Voor & na foto's", "Uitleg & ventilatieadvies"],
    popular: true,
  },
  {
    label: "Vervangen + Kanalen Reinigen",
    image: "/images/mv/dakventilator-vervangen.jpg",
    price: "€ 700,-",
    features: ["Nieuwe dakventilator", "Reiniging van ventilatiekanalen", "Reinigen en afstellen ventielen", "Meten van luchtdebiet", "Inregelen volgens bouwbesluit", "Voor & na foto's", "Uitleg & ventilatieadvies"],
    popular: false,
  },
  {
    label: "Itho CVE ECO + Reinigen",
    image: "/images/mv/dakventilator-itho.jpg",
    price: "€ 450,-",
    features: ["Itho CVE ECO met vochtsensor", "Vakkundige montage", "Inclusief draadloze bediening", "5 jaar fabrieksgarantie", "Reinigen ventilatiekanalen", "Reinigen en afstellen ventielen", "Inregelen systeem", "Uitleg en advies"],
    popular: false,
  },
  {
    label: "Zehnder Comfofan Hydro + Reinigen",
    image: "/images/mv/dakventilator-zehnder.jpg",
    price: "€ 450,-",
    features: ["Zehnder Comfofan Hydro", "Vakkundige montage", "Inclusief draadloze bediening", "7 jaar fabrieksgarantie", "Reinigen ventilatiekanalen", "Reinigen en afstellen ventielen", "Inregelen systeem", "Uitleg en advies"],
    popular: false,
  },
];
```

**Step 2: Replace the empty MV tab placeholder with 3 sub-sections**

Build the MV tab with sub-sections matching the WTW tab's visual style:
1. "Onderhoud & Reinigen" — 3 cards (MV_ONDERHOUD)
2. "Ventilatiebox Vervangen" — 3 cards with product images (MV_VERVANGEN)
3. "Dakventilator" — 5 cards with images (MV_DAKVENTILATOR)

Each sub-section has a heading and grid of cards matching existing design patterns.

---

### Task 5: Update Homepage PricingSection with Real Prices

**Files:**
- Modify: `app/page-sections/PricingSection.tsx`

**Step 1: Update the "vanaf" prices to match real data**

- WTW Vervanging: `€1450` (already correct)
- MV Vervanging: change from `€480` to `€480` (already correct)
- Update feature lists to match real package contents

No major changes needed here — the homepage pricing is already close to real data. Just verify accuracy.

---

### Task 6: Enrich Diensten Page with Scraped Content

**Files:**
- Modify: `app/diensten/page.tsx`

**Step 1: Add WTW detailed content**

In the WTW section, add informational content from `.firecrawl/wtw-unit-vervangen.md`:
- When to replace (15-20 year lifespan, warning signs)
- How replacement works (step-by-step process from scraped data)
- Benefits of regular maintenance

**Step 2: Add MV detailed content**

In the Mechanische Ventilatie section, enrich with `.firecrawl/mechanische-ventilatie-onderhoud-reinigen.md`:
- Benefits after maintenance (gezond binnenklimaat, minder stof, langere levensduur, etc.)
- Cleaning method: roterende borstel advantages
- Why cleaning matters (voorkom gezondheidsklachten, ongedierte, extra onderhoudswerk)

**Step 3: Add Dakventilator info**

Add dakventilator content from `.firecrawl/mechanische-ventilatie-dakventilator.md`:
- Importance of maintenance (every 4-5 years)
- Energy savings (old models use up to 80% more energy)
- When to replace (15+ years old)

---

### Task 7: Enrich WhyTPS Section with Additional USPs

**Files:**
- Modify: `app/page-sections/WhyTPSSection.tsx`

**Step 1: Add scraped USPs**

Add additional trust signals from `.firecrawl/mechanische-ventilatie-dakventilator.md`:
- "Merk-onafhankelijk" (already in diensten page, reinforce here)
- "Meer dan 10 jaar ervaring op het gebied van ventilatie"
- "Geen extra voorrijkosten"
- "Werkgebied tot 60 km vanuit Zoetermeer"

Update the USPs array to include these — keep the 3 best, most differentiating ones. The "10+ jaar ervaring" and "merk-onafhankelijk" are strong additions.

---

### Task 8: Add Work Photos to WhyTPS Image Grid

**Files:**
- Modify: `app/page-sections/WhyTPSSection.tsx`

**Step 1: Replace placeholder image grid with real work photos**

The current image grid shows text placeholders ("Schone lucht", "Vakmanschap", etc.). Replace with actual `next/image` components using the downloaded work photos and product images.

---

### Task 9: Build & Verify

**Step 1: Run the build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors.

**Step 3: Visual check**

Run: `npm run dev`
Manually verify:
- `/tarieven` — WTW tab shows 6 real products with images and correct prices
- `/tarieven` — MV tab shows 3 sub-sections with full pricing
- `/diensten` — Enriched descriptions for WTW, MV, and Dakventilator
- `/` — WhyTPS section has real photos and updated USPs
- All images load correctly

---

### Task 10: Commit

**Step 1: Stage and commit all changes**

```bash
git add public/images/ components/PricingTabs.tsx app/page-sections/ app/diensten/page.tsx
git commit -m "feat: integrate real content, pricing, and images from scraped data

- Replace placeholder WTW pricing with 6 real products (Itho, Zehnder, Orcon)
- Fix WTW onderhoud prices to match real rates (€180/€280/€200)
- Remove standalone inregelen section (folded into package features)
- Build full MV tab with 3 sub-sections (onderhoud, vervangen, dakventilator)
- Add product images downloaded from original site
- Enrich diensten page with detailed service descriptions
- Update WhyTPS section with real work photos and additional USPs

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```
