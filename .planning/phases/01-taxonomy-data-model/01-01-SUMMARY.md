---
phase: 01-taxonomy-data-model
plan: 01
subsystem: build-toolchain
tags: [dependencies, zod, tsx, prebuild-gate, next-config, supply-chain]
requires: []
provides:
  - "zod ^4.4.3 in dependencies (taxonomy validator runtime; reused by Phase 5 QA-02 form validation)"
  - "tsx ^4.22.4 in devDependencies (runs the standalone prebuild validator script)"
  - "package.json prebuild script: tsx scripts/validate-taxonomy.ts (build-blocking gate hook)"
  - "next.config.ts trailingSlash: false (D-03 no-trailing-slash URL policy)"
affects:
  - package.json
  - package-lock.json
  - next.config.ts
tech_stack:
  added:
    - "zod@4.4.3 (MIT, zero deps, no postinstall) — runtime schema validation"
    - "tsx@4.22.4 (no postinstall) — TypeScript script runner for the prebuild gate"
  patterns:
    - "npm pre<script> lifecycle hook: prebuild runs automatically before build; non-zero exit aborts the chain (makes taxonomy validation build-blocking)"
    - "Supply-chain gate before install: slopcheck + npm view scripts.postinstall (V14, the phase's only trust boundary)"
key_files:
  created: []
  modified:
    - "package.json — zod dep, tsx devDep, prebuild script"
    - "package-lock.json — zod + tsx resolved entries (lockfileVersion 3)"
    - "next.config.ts — added trailingSlash: false; output: \"export\" untouched"
decisions:
  - "D-07 toolchain: zod (runtime) + tsx (dev) + prebuild hook — chosen so taxonomy validation is genuinely build-blocking via npm's pre<script> mechanism"
  - "D-03: trailingSlash: false locked at the config layer so every downstream URL/canonical is consistent"
  - "output: \"export\" deliberately NOT modified — static-vs-hybrid is Phase 5's decision gate"
metrics:
  duration_min: 30
  completed: 2026-06-02
  tasks: 2
  files_changed: 3
  commits: 2
---

# Phase 1 Plan 1: Build Toolchain (zod + tsx + prebuild gate) Summary

Added the `zod` runtime dependency and `tsx` dev dependency (both supply-chain vetted clean), wired the npm `prebuild` hook that will make taxonomy validation build-blocking, and locked the no-trailing-slash URL policy in `next.config.ts` — the gate plumbing that the rest of Phase 1 builds against.

## What Was Built

**Task 1 — Dependencies (commit `e34d467`)**
- Ran the supply-chain gate FIRST (V14, the phase's only real threat surface): `slopcheck install zod` and `slopcheck install tsx` both returned **`[OK]`** (slopcheck 0.6.1); `npm view zod scripts.postinstall` and `npm view tsx scripts.postinstall` both **empty** (no install-time code execution).
- Installed `zod` → `dependencies` (resolved `^4.4.3`, node_modules 4.4.3 — exact research target) and `tsx` → `devDependencies` (resolved `^4.22.4`, node_modules 4.22.4 — exact research target).
- `package-lock.json` updated with one `node_modules/zod` and one `node_modules/tsx` entry; `lockfileVersion` is 3.
- No package other than `zod` and `tsx` was added. No global `npm update` run.

**Task 2 — Gate wiring + config (commit `4a3eee8`)**
- `package.json` `scripts.prebuild` = exactly `tsx scripts/validate-taxonomy.ts`. The original `dev`/`build`/`start`/`lint` scripts are unchanged. npm runs `prebuild` automatically before `build`, so a non-zero exit from the (future) validator will abort `next build`.
- `next.config.ts` gained exactly one key: `trailingSlash: false` (D-03). `output: "export"` and `images.unoptimized: true` were left intact (verified by grep count = 1 each).

## Installed Versions (recorded per plan output spec)

| Package | package.json range | node_modules version | slopcheck (0.6.1) | postinstall |
|---------|---------------------|----------------------|-------------------|-------------|
| zod | `^4.4.3` | 4.4.3 | `[OK]` | empty |
| tsx | `^4.22.4` | 4.22.4 | `[OK]` | empty |

## Verification

- `node -e "require('./package.json')..."` → `deps OK ^4.4.3 ^4.22.4` (zod in deps, tsx in devDeps).
- `node -e "... scripts.prebuild ..."` → `prebuild OK`.
- `grep -c "trailingSlash: false" next.config.ts` → `1`.
- `grep -c 'output: "export"' next.config.ts` → `1` (proves static-export mode was NOT touched).
- `package-lock.json` → `lockfileVersion: 3`, one zod + one tsx entry.
- **Not run (expected):** `npm run prebuild` / `npm run build` fail until plan 01-06 creates `scripts/validate-taxonomy.ts`. Per the plan's verification note, this is correct mid-phase behavior — the wiring is right; the target script is built later in the phase. No placeholder script was created.

## Deviations from Plan

None — the plan executed exactly as written.

**Environment note (not a plan deviation):** This repo lives on a OneDrive mount, where `npm install` writes are slow and can stall. The initial `slopcheck`-spawned and direct `npm install` processes hung without writing `package.json` (one reported "changed 1 package in 7m"). I cleared the stalled npm PIDs and re-ran the installs deterministically with `--no-audit --no-fund`, pinned to the research targets (`zod@4.4.3`, `tsx@4.22.4`). The final dependency state matches the plan's acceptance criteria exactly; no version ranges were hand-edited into `package.json` (npm wrote them). This was an environment-friction recovery, not a change to the planned work.

## Supply-Chain / Security Notes (threat_model)

- **T-01-SC / T-01-PI (mitigate):** Both new packages passed `slopcheck [OK]` and have empty `postinstall`. The install ran in the normal sandbox; deps pinned via lockfileVersion 3. No `[SUS]`/`[SLOP]` verdict encountered (which would have halted the plan).
- **T-01-CFG (accept):** Only `trailingSlash: false` was added to `next.config.ts`; `output: "export"` is explicitly preserved (grep-verified), so the Phase 5 static-vs-hybrid decision gate is untouched.
- No new HIGH-severity surface introduced. No new threat flags — the changes are two build-time dependencies and one config key, no runtime input/network/secret surface added.

## Known Stubs

None. The referenced `scripts/validate-taxonomy.ts` is intentionally absent — it is created in plan **01-06** against the registry built in **01-05**. This plan wires only the script *name* into the prebuild hook (gate plumbing), as scoped. The dangling reference is documented in PLAN.md and resolves within this same phase.

## Self-Check: PASSED
- FOUND: package.json (zod ^4.4.3, tsx ^4.22.4, prebuild script)
- FOUND: package-lock.json (lockfileVersion 3, zod + tsx entries)
- FOUND: next.config.ts (trailingSlash: false; output: "export" intact)
- FOUND commit e34d467 (Task 1 — deps)
- FOUND commit 4a3eee8 (Task 2 — prebuild + trailingSlash)
