#!/usr/bin/env python3
"""Compara duas pastas de capturas pixel a pixel (paridade visual da Fase 1).

Para cada PNG presente nas duas pastas: tamanho igual? quantos pixels mudam
(qualquer canal com diferença > --tol)? Gera <nome>-diff.png em --diff-out
com os pixels alterados em magenta, para investigar.

Critério do roadmap: diferença ≤ 1% por página. Esta ferramenta reporta o
valor exato. Padrão: tolerância de 32 por canal e até 0,01%% de pixels por
captura, para ignorar anti-aliasing/subpixel e acusar só mudança visível.

Uso:
  python3 tools/visual-diff.py tools/baseline/shots tools/out/shots [--diff-out tools/out/diff] [--tol 32] [--max-pct 0.01]
Saída 0 = todas as capturas dentro de --max-pct (padrão 0).
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("a")
    ap.add_argument("b")
    ap.add_argument("--diff-out")
    ap.add_argument("--tol", type=int, default=32, help="tolerância por canal (0-255); ignora anti-aliasing")
    ap.add_argument("--max-pct", type=float, default=0.01, help="%% máximo de pixels diferentes por captura")
    args = ap.parse_args()
    names = sorted(f for f in os.listdir(args.a) if f.endswith(".png"))
    missing = [n for n in names if not os.path.exists(os.path.join(args.b, n))]
    worst, fails = 0.0, 0
    if args.diff_out:
        os.makedirs(args.diff_out, exist_ok=True)
    for n in names:
        if n in missing:
            continue
        A = np.asarray(Image.open(os.path.join(args.a, n)).convert("RGB")).astype(np.int16)
        B = np.asarray(Image.open(os.path.join(args.b, n)).convert("RGB")).astype(np.int16)
        if A.shape != B.shape:
            print(f"FAIL {n}: tamanho {A.shape[1]}x{A.shape[0]} -> {B.shape[1]}x{B.shape[0]}")
            fails += 1
            worst = 100.0
            continue
        mask = (np.abs(A - B) > args.tol).any(axis=2)
        cnt = int(mask.sum())
        pct = 100.0 * cnt / mask.size
        worst = max(worst, pct)
        bad = pct > args.max_pct
        fails += bad
        extra = ""
        if cnt:
            ys, xs = np.nonzero(mask)
            extra = f"  caixa x{xs.min()}-{xs.max()} y{ys.min()}-{ys.max()}"
            if args.diff_out:
                out = (A * 0.25 + 191).astype(np.uint8)
                out[mask] = [255, 0, 255]
                Image.fromarray(out).save(os.path.join(args.diff_out, n.replace(".png", "-diff.png")))
        print(f"{'FAIL' if bad else 'ok  '} {n}: {cnt} px ({pct:.4f}%){extra}")
    for n in missing:
        print(f"FAIL {n}: ausente em {args.b}")
        fails += 1
    print(f"\n{len(names)} capturas, {fails} acima do limite, pior caso {worst:.4f}%")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
