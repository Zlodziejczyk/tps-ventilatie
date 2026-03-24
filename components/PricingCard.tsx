import Link from "next/link";
import { Icon } from "./Icon";

interface PricingCardProps {
  title: string;
  subtitle?: string;
  price: string;
  features: string[];
  popular?: boolean;
  ctaLabel: string;
  ctaHref: string;
}

export function PricingCard({
  title,
  subtitle,
  price,
  features,
  popular = false,
  ctaLabel,
  ctaHref,
}: PricingCardProps) {
  return (
    <div
      className={`hover-lift relative rounded-2xl p-6 transition-shadow ${
        popular
          ? "bg-surface-container-lowest ring-2 ring-primary shadow-2xl scale-105"
          : "bg-surface-container-lowest shadow-[0_20px_40px_rgba(0,31,41,0.06)] hover:shadow-[0_20px_40px_rgba(0,31,41,0.1)]"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-xs font-bold px-4 py-1 rounded-full shadow-md">
          Populaire keuze
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-headline font-bold text-on-surface">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-on-surface-variant mt-1">{subtitle}</p>
        )}
      </div>

      <div className="mb-6">
        <span className="text-3xl font-headline font-extrabold text-on-surface">
          {price}
        </span>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-on-surface-variant"
          >
            <Icon
              name="check_circle"
              filled
              className="text-tertiary text-lg shrink-0 mt-0.5"
            />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`block text-center px-5 py-3 rounded-xl font-semibold text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          popular
            ? "signature-gradient text-on-primary shadow-md active:scale-95"
            : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest hover:shadow-md"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
