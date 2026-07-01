import { Icon } from "@/components/Icon";
import { getInitials } from "@/lib/initials";
import { REVIEWS, REVIEW_RATING } from "@/lib/reviews";
import { SITE } from "@/lib/constants";

// Server section (D-14/D-15) — NO "use client", NO ReviewCarousel: the reviews render
// as a STATIC 3-up grid (all three visible at once, zero carousel JS). The Review shape
// is derived from REVIEWS so this file never imports the client carousel module.
type Review = (typeof REVIEWS)[number];

// Three chosen short, brand-clean reviews (D-15). Selected by name so the pick is
// stable if REVIEWS is reordered.
const FEATURED_NAMES = ["Christine te Kamp", "Lois Lovelle", "Albert Terstegs"];
const FEATURED: Review[] = FEATURED_NAMES.map(
  (name) => REVIEWS.find((r) => r.name === name) as Review,
).filter(Boolean);

// Keurmerken: BRL 100 + BRL 200 + KvK (F-gassen/STEK dropped per owner, intake §5).
const KEURMERKEN = ["BRL 100", "BRL 200", `KvK ${SITE.kvk}`];

// USP pills (site's proven pattern) — content-sized, clean at 375px (UI-07).
const USPS = [
  { icon: "money_off", label: "Geen voorrijkosten" },
  { icon: "schedule", label: "Reactie binnen 1 werkdag" },
  { icon: "verified_user", label: "Gecertificeerd & verzekerd" },
];

function Stars() {
  return (
    <div className="mb-4 flex text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" filled className="text-lg" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col rounded-3xl bg-surface-container-lowest p-8 shadow-sm">
      <Stars />
      <p className="mb-8 line-clamp-5 flex-1 italic leading-relaxed text-on-surface">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="mt-auto flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container font-bold text-on-primary-container">
          {getInitials(review.name)}
        </div>
        <div>
          <p className="font-bold text-on-surface">{review.name}</p>
          <p className="text-xs text-on-surface-variant">{review.timeAgo}</p>
        </div>
      </div>
    </div>
  );
}

export function ProofBand() {
  // REVIEW_RATING is null by design until owner-confirmed — guard it (reviews.ts).
  const rating = REVIEW_RATING;
  const score = rating
    ? rating.value.toLocaleString("nl-NL", { minimumFractionDigits: 1 })
    : null;
  const reviewCount = rating?.count ?? REVIEWS.length;

  return (
    <section className="bg-surface-container-low py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading + Google score (CSS-G, no image — 06-03 .gmark) */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <h2 className="font-headline text-2xl font-extrabold text-on-surface sm:text-3xl">
            Wat onze klanten zeggen
          </h2>
          <div className="inline-flex items-center gap-3 rounded-full bg-surface-container-lowest px-5 py-2.5 shadow-sm">
            <span className="gmark" aria-hidden />
            {score && (
              <span className="flex items-center gap-1.5 text-on-surface">
                <span className="text-2xl font-extrabold">{score}</span>
                <Icon name="star" filled className="text-lg text-yellow-500" />
              </span>
            )}
            <span className="text-sm font-medium text-on-surface-variant">
              {reviewCount} reviews op Google
            </span>
          </div>
        </div>

        {/* Static 3-up review cards (D-15 — no carousel, all visible) */}
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURED.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </div>

        {/* Keurmerken strip + USP pills */}
        <div className="mt-12 flex flex-col items-center gap-5">
          <ul className="flex flex-wrap justify-center gap-3">
            {KEURMERKEN.map((keurmerk) => (
              <li
                key={keurmerk}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-surface-container-lowest px-3 py-2 text-sm font-semibold text-on-surface shadow-sm"
              >
                <Icon name="workspace_premium" filled className="text-base text-primary" />
                {keurmerk}
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap justify-center gap-3">
            {USPS.map((usp) => (
              <li
                key={usp.label}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-tertiary-fixed/40 px-4 py-2 text-sm font-semibold text-on-surface"
              >
                <Icon name={usp.icon} filled className="text-base text-tertiary" />
                {usp.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
