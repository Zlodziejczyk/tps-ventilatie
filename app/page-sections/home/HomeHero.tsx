"use client";

import { useRef, useState } from "react";
import { OfferteForm } from "@/components/OfferteForm";
import { PillarGrid } from "./PillarGrid";
import { Icon } from "@/components/Icon";
import { getInitials } from "@/lib/initials";
import { REVIEWS, REVIEW_RATING } from "@/lib/reviews";
import { SITE } from "@/lib/constants";

// Proof-bar monograms — first four real reviewer names (D-07: initials, never avatars).
const PROOF_NAMES = REVIEWS.slice(0, 4).map((r) => r.name);
// One short, brand-clean real quote (visually clamped, never edited — reviews.ts note).
const HERO_QUOTE = REVIEWS[3]; // Christine te Kamp

export function HomeHero() {
  // Shared conversion state — the compact form's dienst is CONTROLLED so a pillar
  // Offerte click (Task 3 routeToOfferte) can pre-select the service after mount (D-09).
  const [dienst, setDienst] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  // REVIEW_RATING is null by design until owner-confirmed — guard it (reviews.ts contract).
  const rating = REVIEW_RATING;
  const score = rating
    ? rating.value.toLocaleString("nl-NL", { minimumFractionDigits: 1 })
    : null;
  const reviewCount = rating?.count ?? REVIEWS.length;

  // Coverage line composed from data (D-06) — never a hardcoded town list.
  const coverageTowns = SITE.serviceAreas.slice(1, 5).join(", ");

  // Signature gesture (D-09): a pillar Offerte click pre-selects that service in the
  // compact form (controlled dienst) and scrolls to it — reduced-motion-aware, no
  // query param / useSearchParams / Suspense, so the page stays statically generated.
  function routeToOfferte(pillarNavTitle: string) {
    setDienst(pillarNavTitle);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
  }

  return (
    <>
    <section className="@container relative overflow-hidden">
      {/* Decorative pure-CSS aurora (06-03) — no WebGL/canvas, animation gated in CSS,
          off the LCP path (the H1 is LCP). */}
      <div className="aurora" aria-hidden>
        <span className="blob b1 left-[-10%] top-[-15%] h-[55%] w-[55%]" />
        <span className="blob b2 right-[-12%] top-[8%] h-[50%] w-[50%]" />
        <span className="blob b3 left-[18%] bottom-[-25%] h-[60%] w-[60%]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="grid items-start gap-10 @min-[860px]:grid-cols-[1.15fr_0.85fr]">
          {/* Left — proof-forward hero copy */}
          <div>
            {/* Dutch badge (UI-05 — no English chrome) */}
            <span className="inline-flex items-center gap-2 rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold uppercase tracking-widest text-on-tertiary-fixed-variant">
              <Icon name="verified" filled className="text-sm" />
              {SITE.tagline}
            </span>

            {/* Exactly one H1, with a gradient-accent span (D-06) */}
            <h1 className="mt-6 font-headline text-4xl font-extrabold leading-[1.1] tracking-tight text-on-surface sm:text-5xl">
              Airco, warmtepomp &amp; ventilatie —{" "}
              <span className="gradient-text">
                goed geregeld in Zoetermeer en heel Zuid-Holland
              </span>
            </h1>

            {/* Proof bar (D-07) — initials monograms + score + count */}
            <div className="mt-8 inline-flex flex-wrap items-center gap-4 rounded-2xl bg-surface-container-lowest px-4 py-3 shadow-sm">
              <div className="flex items-center">
                {PROOF_NAMES.map((name, i) => (
                  <span
                    key={name}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-on-primary-container ring-2 ring-surface-container-lowest"
                    style={{ marginLeft: i === 0 ? 0 : "-0.5rem" }}
                  >
                    {getInitials(name)}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1.5 font-bold text-on-surface">
                {score && (
                  <>
                    <Icon name="star" filled className="text-base text-yellow-500" />
                    {score}
                  </>
                )}
                <span className="font-medium text-on-surface-variant">
                  · {reviewCount} Google-reviews
                </span>
              </span>
            </div>

            {/* One short, real, attributed quote (clamped, not edited) */}
            <p className="mt-4 max-w-md text-sm italic text-on-surface-variant line-clamp-2">
              &ldquo;{HERO_QUOTE.quote}&rdquo; — {HERO_QUOTE.name}
            </p>

            {/* Data-sourced coverage line (D-06) */}
            <p className="mt-6 flex items-start gap-2 text-sm text-on-surface-variant">
              <Icon name="location_on" filled className="shrink-0 text-base text-primary" />
              <span>
                Actief rondom {SITE.city}: {coverageTowns} e.o. — tot{" "}
                {SITE.serviceRadiusKm} km.
              </span>
            </p>

            {/* Live availability pulse */}
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-on-surface">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" />
              </span>
              Direct beschikbaar voor advies &amp; offerte
            </p>
          </div>

          {/* Right — the compact offerte form (the conversion unit) */}
          <div
            ref={formRef}
            className="rounded-3xl bg-surface-container-lowest p-6 shadow-lg sm:p-8"
          >
            <h2 className="mb-1 font-headline text-xl font-bold text-on-surface">
              Vraag vrijblijvend een offerte aan
            </h2>
            <p className="mb-6 text-sm text-on-surface-variant">
              Postcode, telefoon en uw dienst — u rondt het af in WhatsApp.
            </p>
            <OfferteForm
              variant="compact"
              dienst={dienst}
              onDienstChange={setDienst}
            />
          </div>
        </div>
      </div>
    </section>

    <PillarGrid onOfferte={routeToOfferte} />
    </>
  );
}
