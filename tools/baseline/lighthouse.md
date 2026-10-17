# Lighthouse de referência (Fase 0)

Commit medido: `a6ffe89`. Medido em 16/10/2026 (horário de Brasília) com Lighthouse 12
(CLI, Chrome headless, `--no-sandbox --disable-gpu`), mediana de 3 execuções por linha.
Perfil mobile = padrão do Lighthouse (Moto G Power, 4G lento, CPU 4x); desktop = `--preset=desktop`.

## Local (python http.server, sem compressão) — use para comparar fases
| Página / perfil | performance | accessibility | boas práticas | seo | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|---|
| index.html mobile | 76 | 87 | 100 | 100 | 3.03 s | 3.65 s | 250 ms | 0.000 | 4.81 s |
| index.html desktop | 99 | 87 | 100 | 100 | 0.75 s | 0.75 s | 0 ms | 0.011 | 0.82 s |
| portal.html mobile | 85 | 94 | 100 | 100 | 2.73 s | 3.75 s | 0 ms | 0.005 | 2.73 s |
| portal.html desktop | 99 | 94 | 100 | 100 | 0.71 s | 0.80 s | 0 ms | 0.000 | 0.71 s |

## Produção (https://www.norva.cloud/, Vercel)
| Página / perfil | performance | accessibility | boas práticas | seo | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|---|
| index.html mobile | 49 | 87 | 100 | 100 | 2.75 s | 3.32 s | 24245 ms | 0.000 | 10.99 s |
| index.html desktop | 98 | 87 | 100 | 100 | 0.94 s | 0.94 s | 0 ms | 0.011 | 1.21 s |
| portal.html mobile | 80 | 94 | 100 | 100 | 2.60 s | 3.80 s | 232 ms | 0.005 | 3.50 s |
| portal.html desktop | 99 | 94 | 100 | 100 | 0.83 s | 0.87 s | 0 ms | 0.000 | 0.83 s |

## Observações
- O TBT do index no mobile oscila muito entre execuções (250 ms local, 1,4 s numa
  execução com a máquina carregada e 24 s em produção nesta medição). A causa provável
  é a escultura WebGL (`hero-sculpture.js`) rodando em GL por software no Chrome
  headless com CPU 4x mais lenta. Vale ler a Performance mobile do index com cuidado
  e comparar sempre na mesma máquina.
- Acessibilidade 87 (index) e 94 (portal) são o ponto de partida da Fase 6 (meta ≥ 95).
- Reproduzir: `python3 tools/lighthouse.py --out tools/out/lh --ref a6ffe89` (local) ou
  `--url https://www.norva.cloud/` (produção).
