#!/usr/bin/env bash
# Build-time assertion (Crit 4 / QA-03): the contradictory service-radius
# literals ("straal van 50km" / "straal van 100 km") must NOT exist anywhere in
# app/ or components/ — the radius derives once from SITE.serviceRadiusKm (plan
# 01-03). This script PASSES (exit 0) only when grep finds nothing; it exits
# non-zero if any stale literal is reintroduced. Scoped to app/ + components/
# (the only dirs that ever held the literals; over-ons holds regio prose, not a
# numeric radius literal, so it is correctly out of the match set).
set -uo pipefail

# Catches the old literals (50/100) AND the current value (60), in both the
# spaced and unspaced forms, plus any "straal van <n>" radius phrasing. The
# legitimate "{SITE.serviceRadiusKm} km" interpolation has no digit before "km"
# so it is never matched.
PATTERN='straal van [0-9]\|50 *km\|60 *km\|100 *km'

if MATCHES=$(grep -rn "$PATTERN" app components 2>/dev/null); then
  echo "✗ Stale service-radius literal(s) found (QA-03 / Crit 4 violation):" >&2
  echo "$MATCHES" >&2
  exit 1
fi

echo "✅ No stale service-radius literal in app/ or components/ (QA-03 / Crit 4)."
exit 0
