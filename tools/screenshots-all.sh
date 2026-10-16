#!/usr/bin/env bash
# Roda tools/screenshots.py em paralelo (uma largura por processo).
# Uso: tools/screenshots-all.sh <pasta-saida> [ref-git]
set -euo pipefail
OUT="$1"; REF="${2:-}"
PY="${PYTHON:-python3}"
DIR="$(cd "$(dirname "$0")" && pwd)"
pids=()
for w in 1440 1024 768 390; do
  "$PY" "$DIR/screenshots.py" --out "$OUT" --widths "$w" ${REF:+--ref "$REF"} > "/tmp/norva-shots-$w.log" 2>&1 &
  pids+=($!)
done
rc=0
for p in "${pids[@]}"; do wait "$p" || rc=1; done
ls "$OUT"/*.png | wc -l
exit $rc
