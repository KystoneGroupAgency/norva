#!/usr/bin/env bash
# Roda tools/style-diff.py em paralelo (página x largura) e resume.
# Uso: tools/style-diff-all.sh <ref> [target]
set -uo pipefail
REF="$1"; TARGET="${2:-}"
PY="${PYTHON:-python3}"
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="${TMPDIR:-/tmp}/norva-style-diff"; mkdir -p "$LOG"; rm -f "$LOG"/*.log
pids=()
for page in index.html portal.html; do
  for w in 1440 1024 768 390; do
    "$PY" "$DIR/style-diff.py" --ref "$REF" ${TARGET:+--target "$TARGET"} --pages "$page" --widths "$w" \
      > "$LOG/$page-$w.log" 2>&1 &
    pids+=($!)
  done
done
rc=0
for p in "${pids[@]}"; do wait "$p" || rc=1; done
cat "$LOG"/*.log | grep -v '^Total' | grep -v '^$'
echo; echo "Total de diferenças: $(cat "$LOG"/*.log | awk '/^Total de diferenças/ {s+=$4} END {print s+0}')"
exit $rc
