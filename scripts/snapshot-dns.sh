#!/usr/bin/env bash
# Read-only DNS zone snapshot (Phase 9, D-14) — NOT shipped runtime code.
#
# WHAT IT DOES. Writes one timestamped, diffable record set per zone, queried
# directly at the zone's authoritative nameserver, so "what did DNS say on
# <date>" is a file in git instead of a memory. Phase 10's rollback plan is
# literally "revert two A records"; a re-runnable snapshot is what makes the
# before/after of that cutover diffable:
#     diff docs/baseline/2026-09-16/dns/<zone>-<before>.txt docs/baseline/<date>/dns/<zone>-<after>.txt
#
# HOW TO RUN.
#     bash scripts/snapshot-dns.sh <zone> [<zone>...] [--out <dir>]
#     default --out = docs/baseline/$(date -u +%F)/dns
#     e.g.  bash scripts/snapshot-dns.sh tpsventilatie.nl tpsklimaattechniek.nl --out docs/baseline/2026-09-16/dns
#
# RECORD SET (per zone, in this order): SOA NS A MX TXT at the apex; A for
# www mail ftp smtp pop; TXT _dmarc; TXT x._domainkey and titan1._domainkey
# (the DKIM selectors seen on the two zones — cyberfolks signs with `x`, Titan
# with `titan1`); CNAME autoconfig; SRV _autodiscover._tcp; DS at the registry.
#
# OUTPUT FORMAT. Three header lines, a blank line, then raw `dig +noall +answer`
# rows. This is deliberately byte-compatible with the hand-taken 2026-09-16
# snapshot files (docs/baseline/2026-09-16/dns/) so `diff` works across
# captures. Do not "tidy" the format.
#
# READ-ONLY BY CONSTRUCTION. The only tool this script invokes is `dig`, and
# only for queries. It has no registrar automation and no dynamic-DNS path.
# Both zones carry live mail; every DNS change on this project is a separate,
# deliberate, hand-executed step (Phase 10 MIG-02) — never this script.
set -euo pipefail

usage() {
  echo "Usage: bash scripts/snapshot-dns.sh <zone> [<zone>...] [--out <dir>]" >&2
  echo "  e.g. bash scripts/snapshot-dns.sh tpsventilatie.nl tpsklimaattechniek.nl --out docs/baseline/2026-09-16/dns" >&2
  exit 2
}

OUT="docs/baseline/$(date -u +%F)/dns"
ZONES=()
while [ $# -gt 0 ]; do
  case "$1" in
    --out) [ $# -ge 2 ] || usage; OUT="$2"; shift 2 ;;
    --out=*) OUT="${1#--out=}"; shift ;;
    -h|--help) usage ;;
    -*) echo "✗ unknown option: $1" >&2; usage ;;
    *) ZONES+=("$1"); shift ;;
  esac
done
[ "${#ZONES[@]}" -ge 1 ] || usage
command -v dig >/dev/null 2>&1 || { echo "✗ dig not found on PATH" >&2; exit 2; }
mkdir -p "$OUT"

# One query, never fatal: a timeout or SERVFAIL is recorded IN the snapshot as a
# comment line (so the gap is visible in the diff) instead of aborting the run.
query() {
  local ns="$1"; shift
  dig @"$ns" +noall +answer +time=5 +tries=2 "$@" || echo "# QUERY FAILED (dig exit $?): $*"
}

snapshot_zone() {
  local zone="$1"
  local ns_list ns stamp file
  ns_list="$(dig +short NS "$zone" +time=5 +tries=2 | sort)"
  if [ -z "$ns_list" ]; then
    echo "✗ $zone: no NS records resolved — delegation broken, zone unreachable, or the name is wrong" >&2
    return 1
  fi
  ns="$(printf '%s\n' "$ns_list" | head -1)"
  ns="${ns%.}"
  stamp="$(date -u +%Y-%m-%dT%H%M%SZ)"
  file="$OUT/$zone-$stamp.txt"
  {
    echo "# DNS snapshot $zone  taken $(date -u +%FT%TZ)  queried @$ns"
    echo "# registry delegation: $(printf '%s\n' "$ns_list" | tr '\n' ' ')"
    echo "# DS: $(dig +short DS "$zone" +time=5 +tries=2 | tr '\n' ' ')  (empty = DNSSEC off)"
    echo
    for t in SOA NS A MX TXT; do query "$ns" "$zone" "$t"; done
    for h in www mail ftp smtp pop; do query "$ns" "$h.$zone" A; done
    query "$ns" "_dmarc.$zone" TXT
    for s in x titan1; do query "$ns" "$s._domainkey.$zone" TXT; done
    query "$ns" "autoconfig.$zone" CNAME
    query "$ns" "_autodiscover._tcp.$zone" SRV
  } > "$file"
  local records
  records="$(grep -Ec '[[:space:]]IN[[:space:]]' "$file" || true)"
  echo "✅ $zone → $file ($records records, queried @$ns)"
}

FAILED=0
for zone in "${ZONES[@]}"; do
  snapshot_zone "$zone" || FAILED=1
done
[ "$FAILED" -eq 0 ] || { echo "✗ one or more zones could not be snapshotted" >&2; exit 1; }
