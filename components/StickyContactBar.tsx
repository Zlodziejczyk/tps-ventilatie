"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { Icon } from "@/components/Icon";

// Site-wide sticky contact bar (Sketch-003-D), mounted at <body> level in
// app/layout.tsx so it is genuinely viewport-fixed. The container-trap (a
// transform / filter / backdrop-filter / container-type ancestor) is the
// documented failure mode — keep this a direct body child.
//
// Adapted to the REAL design tokens: the glass-nav utility (the sketch's
// --glass-* / spring custom props do not exist in globals.css) + an inline
// cubic-bezier spring. This is the ONE always-on contact element site-wide
// (no separate WhatsApp FAB); Phase 6 inherits this exact component.
export function StickyContactBar() {
  // Both init hidden so SSR and the first client render agree (no hydration
  // mismatch); the effect reveals the bar only after mount.
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("cbar-dismissed") === "1") {
      setDismissed(true);
      return;
    }
    // Scroll in ~200px past the top so the bar never competes with a hero CTA.
    const onScroll = () => setShow(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem("cbar-dismissed", "1");
  }

  return (
    <div
      className="glass-nav fixed inset-x-0 bottom-0 z-[9990] shadow-[0_-8px_32px_rgba(0,101,128,0.14)] transition-transform duration-[450ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      style={{
        transform: show ? "none" : "translateY(125%)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
      role="region"
      aria-label="Direct contact"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Contactbalk sluiten"
        className="btn-hover absolute right-3 top-2 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
      >
        <Icon name="close" className="text-[20px]" />
      </button>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 pr-12 max-[560px]:flex-col max-[560px]:items-stretch max-[560px]:gap-2.5 max-[560px]:px-3">
        <p className="flex items-center gap-2 font-semibold text-on-surface max-[560px]:pr-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          Direct contact?
        </p>

        {/* Content-sized pills (never flex-1: equal thirds crush "WhatsApp" and shatter
            the phone number <560px). whitespace-nowrap + dropped digits keep one clean row. */}
        <div className="flex items-center gap-2 min-w-0 max-[560px]:w-full max-[560px]:justify-center max-[560px]:gap-1">
          <a
            href={`tel:${SITE.phone}`}
            className="btn-hover flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-surface-container-high px-4 py-2.5 font-semibold text-on-surface max-[560px]:gap-1.5 max-[560px]:px-2 max-[560px]:text-sm"
          >
            <Icon name="call" filled className="text-[20px] text-primary max-[560px]:text-[18px]" />
            <span>
              Bel<span className="font-normal text-on-surface-variant max-[560px]:hidden"> {SITE.phoneDisplay}</span>
            </span>
          </a>

          <a
            href={SITE.whatsappUrl}
            target="_blank"
            rel="noopener"
            className="btn-hover flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-surface-container-high px-4 py-2.5 font-semibold text-on-surface max-[560px]:gap-1.5 max-[560px]:px-2 max-[560px]:text-sm"
          >
            <Icon name="chat" filled className="text-[20px] text-primary max-[560px]:text-[18px]" />
            WhatsApp
          </a>

          <Link
            href="/contact"
            className="btn-hover signature-gradient flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 font-semibold text-white max-[560px]:gap-1.5 max-[560px]:px-2.5 max-[560px]:text-sm"
          >
            <Icon name="request_quote" filled className="text-[20px] max-[560px]:text-[18px]" />
            Offerte
          </Link>
        </div>
      </div>
    </div>
  );
}
