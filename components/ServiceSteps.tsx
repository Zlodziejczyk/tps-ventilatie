import { StaggerChildren, StaggerItem } from "@/components/StaggerChildren";
import { Icon } from "@/components/Icon";
import type { StepItem } from "@/lib/services/types";

// IA-05 "stap voor stap" block (server component, D-03). Salvages the existing
// numbered-step visual (badge + text in surface cards). Renders nothing when
// there are no steps (D-06 graceful omit) so draft shells stay clean.
export function ServiceSteps({ steps }: { steps: StepItem[] }) {
  if (steps.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 my-20">
      <div className="bg-surface-container-low rounded-2xl p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface mb-8 flex items-center gap-3">
          <Icon name="list_alt" className="text-primary text-3xl" />
          Stap voor stap
        </h2>
        <StaggerChildren className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {steps.map((step, i) => (
            <StaggerItem key={`${i}-${step.title}`}>
              <div className="flex items-start gap-4 bg-surface-container-lowest rounded-xl p-5 h-full">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-on-surface mb-1">{step.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
