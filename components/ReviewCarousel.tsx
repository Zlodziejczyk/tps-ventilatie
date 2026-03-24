"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Icon } from "@/components/Icon";

export interface Review {
  name: string;
  quote: string;
  timeAgo: string;
}

interface ReviewCarouselProps {
  reviews: Review[];
  intervalMs?: number;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Stars() {
  return (
    <div className="flex text-yellow-500 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" filled className="text-lg" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col h-full min-w-0">
      <Stars />
      <p className="text-on-surface italic mb-8 leading-relaxed flex-1 line-clamp-5">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold shrink-0">
          {getInitials(review.name)}
        </div>
        <div>
          <p className="font-bold">{review.name}</p>
          <p className="text-xs text-on-surface-variant">{review.timeAgo}</p>
        </div>
      </div>
    </div>
  );
}

export function ReviewCarousel({
  reviews,
  intervalMs = 4000,
}: ReviewCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const getVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 1024) return 1;
    if (window.innerWidth < 1280) return 2;
    return 3;
  }, []);

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getVisibleCount]);

  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    },
    [maxIndex]
  );

  // Clamp currentIndex when visibleCount changes
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Auto-scroll
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, intervalMs);
    return () => clearInterval(timer);
  }, [next, intervalMs, isHovered]);

  // Touch support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  // Calculate card width percentage and gap
  const gapRem = 2; // gap-8 = 2rem
  const cardWidthCalc = `calc((100% - ${(visibleCount - 1) * gapRem}rem) / ${visibleCount})`;
  const offsetCalc = `calc(-${currentIndex} * (${cardWidthCalc} + ${gapRem}rem))`;

  const progressPercent = maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel track */}
      <div className="overflow-hidden px-1">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-out"
          style={{
            gap: `${gapRem}rem`,
            transform: `translateX(${offsetCalc})`,
          }}
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="shrink-0"
              style={{ width: cardWidthCalc }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shadow-md hover:bg-primary hover:text-on-primary transition-colors cursor-pointer hidden lg:flex"
        aria-label="Vorige review"
      >
        <Icon name="chevron_left" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center shadow-md hover:bg-primary hover:text-on-primary transition-colors cursor-pointer hidden lg:flex"
        aria-label="Volgende review"
      >
        <Icon name="chevron_right" />
      </button>

      {/* Progress bar */}
      <div className="flex justify-center mt-8">
        <div className="w-32 h-1.5 rounded-full bg-on-surface/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.max(10, progressPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
