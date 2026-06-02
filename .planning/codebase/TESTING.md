# Testing Patterns

**Analysis Date:** 2026-06-01

## Test Framework

**Runner:**
- Not configured — no `jest.config.*`, `vitest.config.*`, or equivalent file present
- No test runner listed in `package.json` scripts or devDependencies

**Assertion Library:**
- Not applicable — no testing library installed

**Run Commands:**
```bash
# No test commands configured
npm run lint      # Only quality check available
npm run build     # Build-time type checking via tsc (strict mode)
```

## Test File Organization

**Location:**
- None — no `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files exist anywhere in the repository

**Naming:**
- No pattern established

**Structure:**
- Not applicable

## Test Structure

**Suite Organization:**
- Not applicable — no tests written

**Patterns:**
- Not applicable

## Mocking

**Framework:** Not applicable

**Patterns:**
- Not applicable

**What to Mock (when tests are introduced):**
- `lib/forms.ts` `submitForm()` — wraps `fetch` and reads `process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL`; mock `fetch` and the env var
- `next/navigation` hooks (`usePathname`, `useSearchParams`) — required by `Navbar.tsx` and `PricingTabs.tsx`
- `framer-motion` — animation library that requires browser APIs; mock or use `@testing-library/react` with jsdom

## Fixtures and Factories

**Test Data:**
- Inline data arrays in source files can be reused directly in tests:
  - `REVIEWS` array in `app/page-sections/ReviewsSection.tsx`
  - `WTW_UNITS`, `MV_ONDERHOUD` etc. in `components/PricingTabs.tsx`
  - `SITE`, `NAV_LINKS` from `lib/constants.ts`

**Location:**
- No fixtures directory — would need to be created at `lib/__fixtures__/` or `__tests__/fixtures/`

## Coverage

**Requirements:** None enforced — no coverage tooling configured

**View Coverage:**
```bash
# Not configured — would require adding vitest or jest with coverage reporter
```

## Test Types

**Unit Tests:**
- None — pure utility functions in `lib/forms.ts` and `lib/useParticleEngine.ts` are good candidates
- `submitForm()` has clearly testable logic (env var present vs. absent branch, fetch ok/error)
- Helper functions `getInitials()`, `lerp()`, `randomFrom()` in canvas files are pure and easily testable

**Integration Tests:**
- None — `ContactForm` submit flow would benefit from a render + user interaction test

**E2E Tests:**
- None — Playwright recommended per project skill rules; critical flows to cover:
  - Contact form submission
  - Pricing tab switching via URL `?tab=airco`
  - Navbar dropdown hover behavior on desktop
  - Mobile menu open/close

## What to Add When Tests Are Introduced

**Recommended stack:**
- Unit/Integration: Vitest + `@testing-library/react` + jsdom (matches Next.js ecosystem)
- E2E: Playwright (`e2e-runner` agent available)

**Minimal vitest setup:**
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom
```

**Config location:** `vitest.config.ts` at project root

**Test directory convention (suggested):**
```
__tests__/
├── lib/
│   └── forms.test.ts
├── components/
│   ├── ContactForm.test.tsx
│   └── ReviewCarousel.test.tsx
e2e/
├── contact.spec.ts
└── pricing.spec.ts
```

## Common Patterns (to Establish)

**Async Testing (for ContactForm):**
```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/ContactForm";

vi.mock("@/lib/forms", () => ({
  submitForm: vi.fn().mockResolvedValue({ ok: true }),
}));

it("shows success state after submit", async () => {
  render(<ContactForm />);
  await userEvent.type(screen.getByLabelText(/uw naam/i), "Jan");
  await userEvent.click(screen.getByRole("button", { name: /versturen/i }));
  expect(await screen.findByText(/bericht verzonden/i)).toBeInTheDocument();
});
```

**Pure Function Testing (for lib/forms.ts):**
```typescript
import { submitForm } from "@/lib/forms";

it("returns ok:true on successful fetch", async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true });
  process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL = "https://example.com/hook";
  const result = await submitForm("contact", { naam: "Test" });
  expect(result.ok).toBe(true);
});
```

---

*Testing analysis: 2026-06-01*
