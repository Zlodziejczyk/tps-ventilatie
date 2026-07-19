import Image from "next/image";
import type { Project } from "@/lib/projects";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";

interface ProjectCaseProps {
  project: Project;
}

// One showcased job on /projecten: title + period/tag chips, a short story, and
// the photo grid. Landscape photos span two columns so mixed-orientation sets
// stay balanced. Tonal card surface — no 1px borders (design system).
export function ProjectCase({ project }: ProjectCaseProps) {
  return (
    <AnimateOnScroll as="article" className="bg-surface-container-low rounded-3xl p-6 md:p-10">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">
          {project.title}
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-label font-medium text-primary bg-primary/10 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          <span className="text-xs font-label text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
            {project.period}
          </span>
        </div>
      </div>

      <p className="text-on-surface-variant leading-relaxed max-w-3xl mb-8">
        {project.summary}
      </p>

      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {project.photos.map((photo) => (
          <StaggerItem
            key={photo.src}
            className={
              photo.orientation === "landscape"
                ? "relative aspect-[4/3] sm:col-span-2 rounded-2xl overflow-hidden"
                : "relative aspect-[3/4] rounded-2xl overflow-hidden"
            }
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              loading="lazy"
            />
          </StaggerItem>
        ))}
      </StaggerChildren>
    </AnimateOnScroll>
  );
}
