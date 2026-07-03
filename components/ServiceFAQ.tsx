import { Icon } from "@/components/Icon";
import type { FaqItem } from "@/lib/services/types";

// IA-05 FAQ block (server component, D-03). Native <details>/<summary>
// disclosure renders with zero client-side JS — it stays a server component.
// When localAngle is non-empty it renders a short regio line ABOVE the FAQs
// (D-01). The whole block (localAngle line included) is omitted when there are
// no FAQs (D-06 graceful omit).
export function ServiceFAQ({
  faqs,
  localAngle,
}: {
  faqs: FaqItem[];
  localAngle?: string;
}) {
  if (faqs.length === 0) return null;
  const hasLocalAngle =
    typeof localAngle === "string" && localAngle.trim() !== "";

  return (
    <section className="max-w-3xl mx-auto px-6 my-20">
      {hasLocalAngle && (
        <p className="flex items-center gap-2 text-sm font-semibold text-tertiary mb-6">
          <Icon name="location_on" filled className="text-tertiary text-lg" />
          {localAngle}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface mb-8">
        Veelgestelde vragen
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={`${i}-${faq.question}`}
            className="group bg-surface-container-low rounded-xl p-5 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-center justify-between gap-4 min-h-[44px] cursor-pointer list-none font-semibold text-on-surface">
              {faq.question}
              <Icon
                name="expand_more"
                className="text-on-surface-variant transition-transform group-open:rotate-180 shrink-0"
              />
            </summary>
            <p className="text-on-surface-variant leading-relaxed mt-3">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
