import Image from "next/image";
import type { Project } from "@/lib/projects";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";

interface ProjectCaseProps {
  project: Project;
}

// One showcased job on /projecten: title + period/tag chips, a short story, and
// the photo grid. Grid shape adapts to the photo set so no case renders a hole:
// 2 portraits fill a 2-col row; a portrait+landscape pair packs one 3-col row
// (landscape at 3/2 so both cells are equal height); sets with a landscape use
// 2 cols with the landscape full-width at 16/9. Tonal card — no 1px borders.
function gridClass(count: number, landscapes: number): string {
  const base = "grid grid-cols-1 gap-3 md:gap-4";
  if (count === 1) return base;
  if (count === 2 && landscapes === 1) return `${base} sm:grid-cols-2 lg:grid-cols-3`;
  if (landscapes === 0) return count === 2 ? `${base} sm:grid-cols-2` : `${base} sm:grid-cols-2 lg:grid-cols-3`;
  return `${base} sm:grid-cols-2`;
}

function photoClass(orientation: "portrait" | "landscape", count: number): string {
  const base = "relative rounded-2xl overflow-hidden";
  if (orientation === "portrait") return `${base} aspect-[3/4]`;
  if (count === 1) return `${base} aspect-[16/9]`;
  if (count === 2) return `${base} aspect-[3/2] sm:col-span-2`;
  return `${base} aspect-[16/9] sm:col-span-2`;
}

export function ProjectCase({ project }: ProjectCaseProps) {
  const landscapes = project.photos.filter((p) => p.orientation === "landscape").length;
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

      <StaggerChildren className={gridClass(project.photos.length, landscapes)}>
        {project.photos.map((photo) => (
          <StaggerItem
            key={photo.src}
            className={photoClass(photo.orientation, project.photos.length)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 600px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              loading="lazy"
            />
          </StaggerItem>
        ))}
      </StaggerChildren>
    </AnimateOnScroll>
  );
}
