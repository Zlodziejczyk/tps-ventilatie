import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { Icon } from "@/components/Icon";
import { REVIEWS, REVIEW_RATING } from "@/lib/reviews";

export function ReviewsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
              KLANTVERHALEN
            </div>
            <h2 className="text-4xl font-extrabold font-headline mb-4">
              Wat klanten over ons zeggen
            </h2>
          </div>

          {/* Google rating summary — stars + score render ONLY when a real
              Google rating is sourced (REVIEW_RATING, D-13/D-17). While null we
              show a neutral count, never a fabricated score. */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6"
              aria-label="Google"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {REVIEW_RATING ? (
              <>
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" filled className="text-lg" />
                  ))}
                </div>
                <span className="font-bold text-on-surface text-lg">
                  {REVIEW_RATING.value.toFixed(1)}
                </span>
                <a
                  href={REVIEW_RATING.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-surface-variant text-sm hover:text-primary transition-colors"
                >
                  ({REVIEW_RATING.count} reviews op Google)
                </a>
              </>
            ) : (
              <span className="text-on-surface-variant text-sm">
                {REVIEWS.length}+ reviews op Google
              </span>
            )}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.2}>
          <ReviewCarousel reviews={REVIEWS} />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
