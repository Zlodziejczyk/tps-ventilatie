import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = "https://tps-ventilatie-mpan4b7q6-pushly-projects.vercel.app";
const OUT = "/private/tmp/claude-501/-Users-brickpro-macos-Library-CloudStorage-OneDrive-Personal-work-Polaris360-Projects-TPS-Ventilatie/4f5a886e-039d-44f3-a858-be3063a3d352/scratchpad";
const SHOTS = `${OUT}/shots`;
mkdirSync(SHOTS, { recursive: true });

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1024, height: 768 },
  desktop: { width: 1440, height: 900 },
};

const TARGETS = ["/", "/contact", "/diensten", "/diensten/airconditioning", "/tarieven", "/over-ons"];

// ---------- in-page audit function (runs in browser) ----------
const PAGE_AUDIT = () => {
  const lum = (r, g, b) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map((x) => parseFloat(x.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  };
  const ratio = (f, b) => {
    const L1 = lum(f.r, f.g, f.b), L2 = lum(b.r, b.g, b.b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  };
  const effBg = (el) => {
    let node = el;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      const bgImg = cs.backgroundImage && cs.backgroundImage !== "none";
      const bc = parse(cs.backgroundColor);
      if (bgImg) return { color: bc && bc.a > 0 ? bc : { r: 255, g: 255, b: 255, a: 1 }, hasImage: true };
      if (bc && bc.a > 0.95) return { color: bc, hasImage: false };
      node = node.parentElement;
    }
    return { color: { r: 255, g: 255, b: 255, a: 1 }, hasImage: false };
  };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.1) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const sel = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += "#" + el.id;
    if (el.className && typeof el.className === "string")
      s += "." + el.className.trim().split(/\s+/).slice(0, 2).join(".");
    return s;
  };

  // ---- Contrast ----
  const contrast = [];
  const seen = new Set();
  document.querySelectorAll("body *").forEach((el) => {
    const direct = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!direct || !visible(el)) return;
    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    if (!fg || fg.a === 0) return;
    const bg = effBg(el);
    const fs = parseFloat(cs.fontSize);
    const fw = parseInt(cs.fontWeight) || 400;
    const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
    const cr = ratio(fg, bg.color);
    const key = `${cs.color}|${cs.fontSize}|${fw}|${bg.color.r},${bg.color.g},${bg.color.b}|${bg.hasImage}`;
    if (seen.has(key)) return;
    seen.add(key);
    const min = large ? 3.0 : 4.5;
    if (cr < min + 0.5) {
      contrast.push({
        ratio: +cr.toFixed(2), required: min, fontSizePx: fs, fontWeight: fw, large,
        color: cs.color, bg: `rgb(${bg.color.r},${bg.color.g},${bg.color.b})`,
        overGradientOrImage: bg.hasImage, pass: cr >= min,
        text: (el.textContent || "").trim().slice(0, 50), sel: sel(el),
      });
    }
  });
  contrast.sort((a, b) => a.ratio - b.ratio);

  // ---- Headings ----
  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
    .filter(visible)
    .map((h) => ({ level: +h.tagName[1], text: (h.textContent || "").trim().slice(0, 60) }));
  let prev = 0; const headingIssues = [];
  headings.forEach((h, i) => {
    if (i === 0 && h.level !== 1) headingIssues.push(`First heading is h${h.level}, not h1`);
    if (h.level > prev + 1 && prev !== 0) headingIssues.push(`Skipped from h${prev} to h${h.level} ("${h.text}")`);
    prev = h.level;
  });
  const h1Count = headings.filter((h) => h.level === 1).length;

  // ---- Images ----
  const imgs = [...document.querySelectorAll("img")];
  const imgsMissingAlt = imgs.filter((i) => !i.hasAttribute("alt")).map((i) => i.currentSrc || i.src);
  const imgsDecorative = imgs.filter((i) => i.getAttribute("alt") === "").length;
  const imgsWithAlt = imgs.filter((i) => (i.getAttribute("alt") || "").length > 0).length;

  // ---- Form controls ----
  const controls = [...document.querySelectorAll("input,select,textarea")]
    .filter((c) => c.type !== "hidden");
  const unlabeled = controls.filter((c) => {
    if (c.getAttribute("aria-hidden") === "true" || c.tabIndex === -1) return false;
    if (c.getAttribute("aria-label") || c.getAttribute("aria-labelledby")) return false;
    if (c.id && document.querySelector(`label[for="${CSS.escape(c.id)}"]`)) return false;
    if (c.closest("label")) return false;
    if (c.type === "checkbox" || c.type === "radio") return false;
    return true;
  }).map((c) => ({ tag: c.tagName.toLowerCase(), type: c.type, name: c.name }));

  // ---- Accessible names on interactive ----
  const noName = [];
  [...document.querySelectorAll("a,button,[role=button]")].filter(visible).forEach((el) => {
    const txt = (el.textContent || "").trim();
    const al = el.getAttribute("aria-label");
    const labelledby = el.getAttribute("aria-labelledby");
    const title = el.getAttribute("title");
    const imgAlt = el.querySelector("img[alt]")?.getAttribute("alt");
    if (!txt && !al && !labelledby && !title && !imgAlt)
      noName.push({ sel: sel(el), html: el.outerHTML.slice(0, 90) });
  });

  // ---- Touch targets (exclude inline links inside running text) ----
  const small = [];
  [...document.querySelectorAll("a,button,[role=button],input[type=checkbox],input[type=radio],select")]
    .filter(visible).forEach((el) => {
      const r = el.getBoundingClientRect();
      const inText = el.tagName === "A" && el.closest("p,li") &&
        getComputedStyle(el).display.includes("inline");
      if (inText) return;
      if (r.width < 44 || r.height < 44) {
        small.push({
          sel: sel(el), w: Math.round(r.width), h: Math.round(r.height),
          label: ((el.textContent || "").trim() || el.getAttribute("aria-label") || "").slice(0, 30),
          under24: r.width < 24 || r.height < 24,
        });
      }
    });

  // ---- Misc ----
  const hasViewport = !!document.querySelector('meta[name="viewport"]');
  const viewportContent = document.querySelector('meta[name="viewport"]')?.content || null;
  const lang = document.documentElement.lang;
  const skipLink = [...document.querySelectorAll("a")].some((a) => {
    const href = a.getAttribute("href") || "";
    const t = (a.textContent || "").toLowerCase();
    return href.startsWith("#") && (t.includes("skip") || t.includes("naar inhoud") || t.includes("hoofdinhoud") || t.includes("content"));
  });
  const bodyFontPx = parseFloat(getComputedStyle(document.body).fontSize);
  const horizScroll = document.documentElement.scrollWidth > window.innerWidth + 1;
  const scrollW = document.documentElement.scrollWidth;
  const innerW = window.innerWidth;

  return {
    title: document.title,
    metaDesc: document.querySelector('meta[name="description"]')?.content || null,
    lang, hasViewport, viewportContent, skipLink, bodyFontPx,
    horizScroll, scrollW, innerW,
    h1Count, headings, headingIssues,
    img: { total: imgs.length, missingAlt: imgsMissingAlt, decorative: imgsDecorative, withAlt: imgsWithAlt },
    unlabeledControls: unlabeled,
    noAccessibleName: noName,
    smallTargets: small,
    contrastFlags: contrast.slice(0, 30),
  };
};

const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0; const step = 400;
      const t = setInterval(() => {
        window.scrollBy(0, step); y += step;
        if (y >= document.body.scrollHeight) { clearInterval(t); res(); }
      }, 60);
    });
  });
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
};

const perf = (page) =>
  page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] || {};
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    const res = performance.getEntriesByType("resource");
    const byType = {};
    let totalTransfer = nav.transferSize || 0;
    res.forEach((r) => {
      byType[r.initiatorType] = (byType[r.initiatorType] || 0) + 1;
      totalTransfer += r.transferSize || 0;
    });
    const big = res
      .map((r) => ({ name: r.name.split("/").pop().slice(0, 40), kb: Math.round((r.transferSize || 0) / 1024) }))
      .filter((r) => r.kb > 20).sort((a, b) => b.kb - a.kb).slice(0, 8);
    return {
      ttfbMs: Math.round(nav.responseStart || 0),
      domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd || 0),
      loadMs: Math.round(nav.loadEventEnd || 0),
      fcpMs: fcp ? Math.round(fcp.startTime) : null,
      requestCount: res.length + 1,
      totalTransferKb: Math.round(totalTransfer / 1024),
      byType, biggestResources: big,
    };
  });

(async () => {
  const browser = await chromium.launch();
  const results = { base: BASE, pages: {}, perf: {}, notes: [] };

  // discover one service page under airconditioning
  let servicePage = null;
  {
    const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
    const p = await ctx.newPage();
    await p.goto(BASE + "/diensten/airconditioning", { waitUntil: "networkidle", timeout: 60000 });
    servicePage = await p.evaluate(() => {
      const a = [...document.querySelectorAll('a[href*="/diensten/airconditioning/"]')]
        .map((x) => new URL(x.href).pathname)
        .filter((h) => h.split("/").length === 4);
      return a[0] || null;
    });
    await ctx.close();
  }
  if (servicePage) { TARGETS.push(servicePage); results.notes.push(`Discovered service page: ${servicePage}`); }

  for (const path of TARGETS) {
    const slug = path === "/" ? "home" : path.replace(/\//g, "_").replace(/^_/, "");
    results.pages[path] = {};

    // DESKTOP — full structural/a11y/contrast + screenshots
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${SHOTS}/${slug}__desktop-fold.png` });
      await autoScroll(page);
      const audit = await page.evaluate(PAGE_AUDIT);
      results.pages[path].desktop = audit;
      await page.screenshot({ path: `${SHOTS}/${slug}__desktop-full.png`, fullPage: true });
      if (path === "/" || path === "/contact") results.perf[path] = await perf(page);
      await ctx.close();
    }

    // MOBILE — touch targets, horizontal scroll + screenshots
    {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.mobile, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      const page = await ctx.newPage();
      await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${SHOTS}/${slug}__mobile-fold.png` });
      await autoScroll(page);
      const audit = await page.evaluate(PAGE_AUDIT);
      results.pages[path].mobile = {
        horizScroll: audit.horizScroll, scrollW: audit.scrollW, innerW: audit.innerW,
        smallTargets: audit.smallTargets, bodyFontPx: audit.bodyFontPx,
        contrastFlags: audit.contrastFlags,
      };
      if (path === "/" || path === "/contact" || path === servicePage)
        await page.screenshot({ path: `${SHOTS}/${slug}__mobile-full.png`, fullPage: true });
      await ctx.close();
    }
  }

  // Home tablet + laptop fold
  for (const vp of ["tablet", "laptop"]) {
    const ctx = await browser.newContext({ viewport: VIEWPORTS[vp] });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${SHOTS}/home__${vp}-fold.png` });
    await ctx.close();
  }

  // Sticky bar (desktop, scrolled) + mobile menu open
  {
    const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${SHOTS}/home__sticky-bar.png` });
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: VIEWPORTS.mobile, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(800);
    try {
      await page.click('button[aria-label="Open menu"]', { timeout: 5000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${SHOTS}/home__mobile-menu.png` });
    } catch (e) { results.notes.push("mobile menu open failed: " + e.message); }
    await ctx.close();
  }

  // Focus-visible probe on home (desktop): tab and capture
  {
    const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(600);
    const focusProbe = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          label: (el.textContent || "").trim().slice(0, 24) || el.getAttribute("aria-label"),
          outlineWidth: cs.outlineWidth, outlineStyle: cs.outlineStyle,
          boxShadow: cs.boxShadow !== "none" ? "present" : "none",
        };
      });
      if (info) focusProbe.push(info);
    }
    await page.screenshot({ path: `${SHOTS}/home__focus-probe.png` });
    results.focusProbe = focusProbe;
    await ctx.close();
  }

  await browser.close();
  writeFileSync(`${OUT}/audit.json`, JSON.stringify(results, null, 2));
  // compact console summary
  for (const [path, data] of Object.entries(results.pages)) {
    const d = data.desktop || {};
    console.log(`\n### ${path}`);
    console.log(`title: ${d.title}`);
    console.log(`h1Count=${d.h1Count} headingIssues=${JSON.stringify(d.headingIssues)}`);
    console.log(`imgMissingAlt=${(d.img?.missingAlt||[]).length} imgWithAlt=${d.img?.withAlt} decorative=${d.img?.decorative}`);
    console.log(`unlabeledControls=${JSON.stringify(d.unlabeledControls)}`);
    console.log(`noAccessibleName=${(d.noAccessibleName||[]).length}`);
    console.log(`skipLink=${d.skipLink} lang=${d.lang} bodyFontPx=${d.bodyFontPx} viewport=${d.viewportContent}`);
    console.log(`desktop smallTargets=${(d.smallTargets||[]).length} mobile smallTargets=${(data.mobile?.smallTargets||[]).length}`);
    console.log(`mobile horizScroll=${data.mobile?.horizScroll} (scrollW=${data.mobile?.scrollW} innerW=${data.mobile?.innerW})`);
    const cf = (data.mobile?.contrastFlags||[]).filter(x=>!x.pass && !x.overGradientOrImage);
    console.log(`contrast SOLID-bg failures (mobile): ${cf.length}`);
    cf.slice(0,6).forEach(c=>console.log(`   ${c.ratio}:1 (need ${c.required}) ${c.fontSizePx}px "${c.text}" ${c.color} on ${c.bg} [${c.sel}]`));
  }
  console.log(`\n=== PERF ===`);
  for (const [p, v] of Object.entries(results.perf)) {
    console.log(`${p}: FCP=${v.fcpMs}ms DCL=${v.domContentLoadedMs}ms load=${v.loadMs}ms reqs=${v.requestCount} transfer=${v.totalTransferKb}KB`);
    console.log(`   biggest: ${v.biggestResources.map(r=>r.name+" "+r.kb+"KB").join(", ")}`);
  }
  console.log(`\n=== FOCUS PROBE (home, first tabs) ===`);
  (results.focusProbe||[]).forEach(f=>console.log(`   ${f.tag} "${f.label}" outline=${f.outlineWidth}/${f.outlineStyle} shadow=${f.boxShadow}`));
  console.log(`\nNotes: ${results.notes.join(" | ")}`);
  console.log(`\nWrote ${OUT}/audit.json and screenshots to ${SHOTS}`);
})();
