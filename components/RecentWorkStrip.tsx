import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { RECENT_WORK_PHOTOS } from "@/lib/projects";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";

// Compact proof-strip of real installs, shown on the airconditioning pillar page
// (the only pillar with publishable owner photos so far — warmtepompen/WTW join
// when Thomas supplies material). Links through to the full /projecten page.
export function RecentWorkStrip() {
  return (
    <AnimateOnScroll as="section" className="max-w-7xl mx-auto px-6 mb-20">
      <div className="bg-surface-container-low rounded-3xl p-8 md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-on-surface mb-2">
              Recent geplaatst in de regio
            </h2>
            <p className="text-on-surface-variant">
              Echte installaties van ons eigen team — geen stockfoto&apos;s.
            </p>
          </div>
          <Link
            href="/projecten"
            className="btn-hover flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold transition-colors hover:bg-on-primary-fixed focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Bekijk ons werk
            <Icon name="arrow_forward" />
          </Link>
        </div>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {RECENT_WORK_PHOTOS.map((photo) => (
            <StaggerItem
              key={photo.src}
              className="photo-frame photo-duo relative aspect-square rounded-2xl overflow-hidden"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover photo-grade"
                loading="lazy"
              />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </AnimateOnScroll>
  );
}
