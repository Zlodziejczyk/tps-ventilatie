import Link from "next/link";
import { Icon } from "./Icon";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  features?: string[];
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

export function ServiceCard({
  icon,
  title,
  description,
  features,
  primaryAction,
  secondaryAction,
}: ServiceCardProps) {
  return (
    <div className="hover-lift bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(0,31,41,0.06)] hover:shadow-[0_20px_40px_rgba(0,31,41,0.1)] transition-shadow relative group cursor-pointer">
      {/* Green corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center mb-4">
          <Icon name={icon} className="text-primary text-2xl" filled />
        </div>

        <h3 className="text-xl font-headline font-bold text-on-surface mb-2">
          {title}
        </h3>
        <p className="text-on-surface-variant mb-4 leading-relaxed">
          {description}
        </p>

        {features && features.length > 0 && (
          <ul className="space-y-2 mb-6">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-on-surface-variant"
              >
                <Icon
                  name="check_circle"
                  filled
                  className="text-tertiary text-lg"
                />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap gap-3">
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="signature-gradient text-on-primary px-5 py-2.5 rounded-lg font-semibold text-sm transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {primaryAction.label}
              </Link>
            )}
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="px-5 py-2.5 rounded-lg font-semibold text-sm text-primary bg-surface-container-high hover:bg-surface-container-highest transition-colors"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
