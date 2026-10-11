# Plan: Knapsack 0/1 visualizer (architecture phases 0 + 1)

Status: in progress · Owner: codex (implement) · Reviewer: claude_code (cross-review)

Worktree: `/home/hieu/Data/Learning.UIT/CS112.F31.LT.TTNT-PTTKTT/HomeWork-worktrees/knapsack-visualizer` (branch `feat/knapsack-visualizer`). Work only there; never touch the main worktree.

## Read first (inside the worktree)
- `docs/kien-truc-ung-dung-demo.md` — architecture to follow: §2 folder layout, §3 contracts/recorder/worker, §4 routes and page layouts, §5 stack, §7 phases 0 and 1.
- `docs/de-bai-bai-tap-lon.md` — assignment: input → step-by-step → output, compare several algorithms, grouped testcases.
- `docs/levitin-thuat-toan-co-the-demo.md`.

## Scope
1. **App in `source-code/`**: Vite + React + TypeScript strict, React Router, Zustand, Immer `produceWithPatches`, Zod, Tailwind + shadcn/ui, d3 only for layout, Recharts for metric charts, Vitest, Playwright. Use **npm** (pnpm is broken on this machine). Playwright chromium is already installed in `~/.cache/ms-playwright`.
2. **Core** (`src/core`): contracts; `TraceRecorder` + `MetricsRecorder` sharing one `Recorder` interface; `TraceStore` with patches/inverse, checkpoints every 100 steps or byte budget, seek and step-back; worker protocol with batching, per-run timeout and cancel.
3. **Catalog** (`src/catalog`): registry, manifest, chapters, techniques.
4. **Problem** `src/problems/knapsack-01`: Zod schemas, constraints, Wecode-style Vietnamese statement, seeded generators (tiny/small/medium/large), named cases in all 6 groups (normal/edge/small/large/special/invalid), checker with verdict + optimality, comparison adapter.
5. **Algorithms** `src/algorithms/knapsack-01/<technique>/` each with `index.ts` (chapter, section, page, technique, exactness, complexity, views, traceLimit), `run.ts`, `pseudocode.ts` (stable line ids), `legend.ts`, `run.test.ts`:
   - `exhaustive` (Levitin §3.4)
   - `dp-table` (§8.2 bottom-up + backtrack to recover items)
   - `dp-memo` (§8.2 memory function; show which cells get computed)
   - `branch-and-bound` (§12.2 best-first, items sorted by ratio, ub = v + (W − w)·(v_next / w_next); show pruned nodes)
   - `greedy-approx` (§12.3 greedy by value/weight; labeled approximate; report ratio to optimum)
6. **Workers**: `run.worker.ts` (one per lane), `bench.worker.ts` (pool, untraced, warmup + median).
7. **Visualizers**: `matrix` (DP table: current cell, dependency cells, memo computed/uncomputed, backtrack path); `state-space-tree` (exhaustive / B&B / memo call tree; pruned and best nodes; zoom/pan; truncates gracefully when large); `items` (weight, value, ratio, taken/considered/rejected). Every algorithm's player shows a sensible view; multiple views allowed.
8. **Routes** (architecture §4.1):
   - `/` catalog with chapter/technique filters; `/chapter/:n` and `/technique/:t` reuse the same CatalogPage.
   - `/problem/knapsack-01`.
   - `/play/:problemId/:algoId` per §4.2: input editor (manual / seeded random / testcase tabs + validation messages), central visualizer, pseudocode with highlighted line, Vietnamese per-step explanation, state inspector, output with verdict, bottom controls (first/back/play-pause/forward/last/scrub/speed), op-count metrics, keyboard shortcuts (Space, arrows, Shift+arrows by phase).
   - `/compare/knapsack-01?algos=...`: shared input, N lanes with compact visualizers, independent cursors plus sync by progress % or phase, results table (optimal?, ratio to optimum, steps, op counts, median ms), chart of time vs n.
   - `/testcases/knapsack-01`: grouped cases, run all, pass/fail, timing, CSV + JSON export, benchmark by n.
   - `/about`.
   - Shareable URL state (seed, size, case, algos).
9. **UI**: shadcn/ui, LIGHT theme, strictly BLACK AND WHITE / grayscale (neutral palette, no colored accents). Distinguish step states with gray shades, border weight, dashed/solid outlines, fill patterns, icons and labels — never hue. Readable and responsive down to ~1280 px. All user-facing text in Vietnamese.
10. **Testcase deliverable**: `npm run export:testcases` writes every named case plus a set of generated large cases as JSON (input + expected optimum) to the worktree-root folder `testcases/` with a short `README.md` describing the groups; commit the generated files.
11. **`source-code/README.md`**: install, dev, build, test, short architecture tour.

## Acceptance (all must hold)
1. From `source-code/`: `npm ci` (lockfile committed), `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, `npm run e2e` all pass with zero errors.
2. Unit tests prove: the 4 exact algorithms return the same optimal value as exhaustive on ≥ 200 seeded random small instances; greedy returns a feasible solution and reports its ratio; the checker rejects infeasible outputs; invalid cases are rejected by validation; TraceStore seek forward, seek backward and step-back reproduce visual state identical to a linear replay; trace truncation still computes the final output (`truncated` flag set).
3. Playwright e2e: catalog → problem page → player for `dp-table` → run a preset → step forward/back changes the highlighted pseudocode line and the visual state → output shows the optimal value; compare page runs all 5 algorithms on one input and shows the results table; testcases page runs all and shows pass counts.
4. `npm run dev` starts and every route renders without console errors.
5. Never weaken, skip, narrow or delete tests to make gates pass. If a product decision is ambiguous, choose what is most consistent with `docs/kien-truc-ung-dung-demo.md` and note it in the report.

## Commits
Small conventional commits on `feat/knapsack-visualizer`, no AI references, never commit `node_modules`/`dist`. No git remote exists, so finish with a clean committed branch instead of a PR.
