#!/usr/bin/env python3
"""Lighthouse de referência (Fase 0) e de comparação (fim de cada fase).

Serve o site localmente (árvore atual ou um commit) — ou mede uma URL pública
com --url — e roda o Lighthouse em index e portal, mobile e desktop, N vezes,
guardando a MEDIANA. Gera um resumo em Markdown.

Uso:
  python3 tools/lighthouse.py --out tools/out/lh                 # árvore atual, local
  python3 tools/lighthouse.py --out tools/out/lh --ref a6ffe89
  python3 tools/lighthouse.py --out tools/out/lh-prod --url https://www.norva.cloud/
Variáveis: LIGHTHOUSE (binário; padrão "npx lighthouse"), CHROME_PATH.
Obs.: o servidor local (http.server) não comprime nem faz cache como a Vercel;
compare local com local e produção com produção.
"""
import argparse
import json
import os
import shlex
import statistics
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import PAGES, git_rev, serve, site_root  # noqa: E402

CATS = ["performance", "accessibility", "best-practices", "seo"]
AUDITS = {"first-contentful-paint": "FCP", "largest-contentful-paint": "LCP",
          "total-blocking-time": "TBT", "cumulative-layout-shift": "CLS", "speed-index": "SI"}


def run_lh(url, preset, path):
    lh = shlex.split(os.environ.get("LIGHTHOUSE", "npx --yes lighthouse"))
    cmd = lh + [url, "--quiet", "--output=json", f"--output-path={path}",
                "--chrome-flags=--headless=new --no-sandbox --disable-gpu",
                "--only-categories=" + ",".join(CATS)]
    if preset == "desktop":
        cmd.append("--preset=desktop")
    subprocess.run(cmd, check=True)
    r = json.load(open(path))
    row = {c: round(r["categories"][c]["score"] * 100) for c in CATS}
    for a, k in AUDITS.items():
        row[k] = r["audits"][a]["numericValue"]
    return row


def fmt(k, v):
    if k in CATS:
        return str(int(v))
    if k == "CLS":
        return f"{v:.3f}"
    return f"{v / 1000:.2f} s" if k != "TBT" else f"{v:.0f} ms"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--ref")
    ap.add_argument("--url", help="mede uma URL pública em vez do site local")
    ap.add_argument("--runs", type=int, default=3)
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    results = {}

    def measure(base):
        for page in PAGES:
            for preset in ("mobile", "desktop"):
                rows = []
                for i in range(args.runs):
                    rows.append(run_lh(base + page, preset, os.path.join(args.out, f"{page}-{preset}-{i}.json")))
                med = {k: statistics.median(r[k] for r in rows) for k in rows[0]}
                results[f"{page} {preset}"] = med
                print(page, preset, {k: fmt(k, v) for k, v in med.items()}, flush=True)

    if args.url:
        measure(args.url if args.url.endswith("/") else args.url + "/")
        src = args.url
    else:
        with site_root(args.ref) as root, serve(root) as base:
            measure(base)
        src = f"local ({args.ref or 'árvore de trabalho'} @ {git_rev(args.ref or 'HEAD')})"

    cols = CATS + list(AUDITS.values())
    md = [f"Fonte: {src} · mediana de {args.runs} execuções · Lighthouse CLI", "",
          "| Página / perfil | " + " | ".join(c.replace("best-practices", "boas práticas") for c in cols) + " |",
          "|---" * (len(cols) + 1) + "|"]
    for k, r in results.items():
        md.append(f"| {k} | " + " | ".join(fmt(c, r[c]) for c in cols) + " |")
    open(os.path.join(args.out, "summary.md"), "w").write("\n".join(md) + "\n")
    json.dump(results, open(os.path.join(args.out, "summary.json"), "w"), indent=1)
    print("\n".join(md))


if __name__ == "__main__":
    main()
