#!/usr/bin/env bash
# Genereert geoptimaliseerde webversies van de projectfoto's (macOS sips).
#
# Bron:  "iCloud Photos/" — hernoemde originelen van Thomas (zie PHOTOS.md daar)
# Doel:  public/images/projecten/ — max 1400px lange zijde, JPEG q70
#
# Privacy-regels (besluit 2026-07-19, quick task 260719-t62):
#  - NIET publiceren: bosch-warmtepomp-monoblock-montage (montage onaf),
#    toshiba-wandunit-zwart-kinderkamer (gezinsfoto's), daikin-vloermodel-babykamer,
#    daikin-buitendelen-duo-terras (persoon in beeld; croppen zou de units raken —
#    daikin-buitendelen-rij-gevel toont dezelfde klus beter)
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="iCloud Photos"
OUT="public/images/projecten"
mkdir -p "$OUT"

# "origineel-basisnaam:webnaam" — webnamen zonder datum-prefix (SEO).
MAP=(
  "2026-06-03_airco-omkasting-eikenhout-vide:airco-omkasting-eikenhout-vide"
  "2026-06-03_airco-omkasting-eikenhout-detail:airco-omkasting-eikenhout-detail"
  "2026-06-04_toshiba-daiseikai-buitendelen-duo:toshiba-daiseikai-buitendelen-duo"
  "2026-06-06_buitendelen-trio-daikin-mitsubishi:buitendelen-trio-daikin-mitsubishi"
  "2026-06-25_daikin-perfera-vloermodel-slaapkamer:daikin-perfera-vloermodel-slaapkamer"
  "2026-06-25_daikin-buitendelen-plat-dak-zonnepanelen:daikin-buitendelen-plat-dak-zonnepanelen"
  "2026-06-28_mitsubishi-wandunit-boven-deur:mitsubishi-wandunit-boven-deur"
  "2026-06-30_toshiba-wandunit-zwart-zolder:toshiba-wandunit-zwart-zolder"
  "2026-06-30_toshiba-wandunit-zwart-interieur:toshiba-wandunit-zwart-interieur"
  "2026-06-30_toshiba-buitendelen-duo-dakkapel:toshiba-buitendelen-duo-dakkapel"
  "2026-07-02_daikin-vloermodel-zolderkamer:daikin-vloermodel-zolderkamer"
  "2026-07-02_daikin-buitendeel-plat-dak-grind:daikin-buitendeel-plat-dak-grind"
  "2026-07-03_mitsubishi-buitendeel-witte-gevel:mitsubishi-buitendeel-witte-gevel"
  "2026-07-08_mitsubishi-buitendeel-dak-closeup:mitsubishi-buitendeel-dak-closeup"
  "2026-07-08_mitsubishi-buitendeel-terras:mitsubishi-buitendeel-terras"
  "2026-07-08_mitsubishi-wandunit-hoek:mitsubishi-wandunit-hoek"
  "2026-07-10_daikin-buitendeel-gevel:daikin-buitendeel-gevel"
  "2026-07-10_daikin-vloermodel-woonkamer:daikin-vloermodel-woonkamer"
  "2026-07-10_daikin-vloermodel-woonkamer-2:daikin-vloermodel-woonkamer-2"
  "2026-07-10_daikin-wandunit-nis:daikin-wandunit-nis"
  "2026-07-10_daikin-buitendelen-rij-gevel:daikin-buitendelen-rij-gevel"
)

# Budget: ≤ ~420KB per foto (grid-weergave, retina). Eerst 1400px q65; wat daar
# overheen gaat (grof metselwerk/grind comprimeert slecht) opnieuw op 1200px q60.
encode() { # encode <src> <dst>
  sips -Z 1400 -s format jpeg -s formatOptions 65 "$1" --out "$2" >/dev/null
  if [ "$(stat -f%z "$2")" -gt 420000 ]; then
    sips -Z 1200 -s format jpeg -s formatOptions 60 "$1" --out "$2" >/dev/null
  fi
}

for entry in "${MAP[@]}"; do
  encode "${SRC}/${entry%%:*}.JPEG" "${OUT}/${entry##*:}.jpg"
done

echo "OK: $(ls "$OUT" | wc -l | tr -d ' ') webfoto's in $OUT"
