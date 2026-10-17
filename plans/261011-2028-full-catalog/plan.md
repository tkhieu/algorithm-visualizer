# Plan: full Levitin catalog (architecture phases 2–4) + navigation rebuild

Status: in progress · Base: `feat/knapsack-visualizer` @ `6223740` (PR #1, deployed) · Stack/architecture: `docs/kien-truc-ung-dung-demo.md` · Inventory: `docs/levitin-thuat-toan-co-the-demo.md`

Goal: every problem and every solving method from the inventory is runnable in the app with input → step-by-step trace → output, plus compare + testcases per problem, and a rebuilt navigation that reaches any problem or any algorithm in ≤ 2 clicks (or via search).

## Shared rules (all phases, all workers)
- App lives in `source-code/`. npm only (pnpm is broken). TS strict. UI: shadcn/ui, light theme, strictly black/white/grayscale (state distinguished by gray shade, border weight, dash, pattern, icon, label — never hue). All user-facing text Vietnamese.
- Keep the existing contracts in `src/core/contracts` (`Problem`, `Algorithm`, `Recorder`, `Step`, `RunResult`, `ComparisonAdapter`, `Visualizer`). Extend only in Phase F.
- One `run()` per algorithm used both traced and untraced. Steps carry stable `lineId` that exists in `pseudocode.ts`, Vietnamese `explain`, `marks`, optional `phase`. Visual state mutated only through `rec.step(...)` (Immer).
- Never weaken, skip, narrow or delete tests. Conventional commits, no AI references. Never commit `node_modules`/`dist`. No new npm dependencies in Phase B (ask in report if truly needed).
- Every algorithm module: `index.ts` (id `<problemId>/<techniqueId>`, title, chapter, section, page, technique, exactness, complexity, views, traceLimit), `run.ts`, `pseudocode.ts`, `legend.ts` (optional), `run.test.ts`.
- Every problem module `src/problems/<problemId>/`: `definition.ts` (Zod input/output schemas, constraints, Vietnamese Wecode-style statement, ≥ 2 examples), `generators.ts` (seeded, tiny/small/medium/large), `cases.ts` (named cases covering normal, edge, small, large, special and — where validation applies — invalid), `checker.ts` (verdict; optimality/objective where meaningful), `adapters.ts` (only if the problem has ≥ 2 algorithms), `definition.test.ts`.
- Each algorithm's `run.test.ts` must prove correctness on seeded random instances against a reference (brute force or a trusted second algorithm) and that the trace replays (TraceStore) to the final visual state; at least one step-text test per algorithm.

## Phase F — Foundation (one worker, sequential, must merge first)
Branch `feat/catalog-foundation` from `feat/knapsack-visualizer`.
1. **Registry by convention**: discover problems and algorithms with `import.meta.glob('src/problems/*/index.ts')` and `import.meta.glob('src/algorithms/*/*/index.ts')` (lazy), so Phase B workers add folders only and never edit a shared registry file.
2. **Full manifest** `src/catalog/manifest.ts`: every problem and algorithm id below with chapter, section, page, technique, Vietnamese title and status `ready | planned`. Knapsack = ready. Coverage test: every `ready` manifest id is registered and every registered id is in the manifest; a separate test `full coverage` lists `planned` ids and is expected to pass only at the end of Phase B (mark it with an env switch `COVERAGE=strict`, default non-strict; Phase B final gate runs strict).
3. **Problem-agnostic pages**: Player, Compare, Testcases, Problem pages must work for any registered problem (no knapsack hard-coding). Input editor: problem may export a custom editor component (e.g. graph editor, point editor, string pair, array); fallback = JSON editor with schema validation, examples dropdown, seeded generator. Output panel: problem may export an output renderer; fallback = pretty JSON + verdict.
4. **Visualizers** (generic, documented props, each with a fixture story/test): existing `matrix`, `state-space-tree`, `items`, plus new `array-bars` (compare/swap/pivot/sorted ranges/subarray brackets), `graph` (directed/undirected, weights, node/edge marks, distances labels, flow/capacity labels, bipartite layout, DAG layering; SVG ≤ 300 nodes, Canvas above), `tree` (BST/AVL/2-3/B-tree/heap/Huffman/recursion tree; rotations/splits animate between steps), `string-align` (text, pattern window, shift table, char comparisons), `points-2d` (points, segments, hull, strip, tours; Canvas for many points; zoom/pan), `numeric-plot` (function curve, interval, tangent/secant, iterates), `hash-table` (buckets/slots, chains, probes), `sequence` (list of generated objects, current, changed positions; numeric recurrence tables), `board` (n×n grid for n-queens/assignment cost matrix highlights).
5. **Navigation rebuild**:
   - Persistent left sidebar with three switchable trees: **Theo chương** (chương → bài toán → cách giải), **Theo kỹ thuật** (kỹ thuật → cách giải, grouped by problem), **Theo bài toán** (bài toán → cách giải). Status badge `planned` greyed but visible. Collapsible, remembers state, highlights the current route.
   - Global search / command palette (shadcn `Command`, `Ctrl+K` and `/`): search problems and algorithms by Vietnamese/English name, chapter, section.
   - Breadcrumbs on every page: Chương › Bài toán › Cách giải.
   - Routes: `/` home (overview: counts, featured comparisons, chapters grid), `/problems` (all problems, filters by chapter/technique/status), `/algorithms` (table of all algorithms: name, problem, chương/§/trang, kỹ thuật, độ phức tạp, exact/approx, status; sortable/filterable), `/chapter/:n`, `/technique/:t` (same catalog component, filtered), `/problem/:problemId`, `/play/:problemId/:algoId`, `/compare/:problemId`, `/testcases/:problemId`, `/about`. Problem page lists all its algorithms with "Chạy" and "So sánh tất cả".
   - Player shows sibling algorithms switcher (same problem) and prev/next algorithm in chapter.
6. Keep all existing knapsack tests/e2e green; update e2e for new navigation; add e2e: sidebar three modes, command palette finds an algorithm, `/algorithms` table filters.
7. `scripts/new-algorithm.ts` + `npm run new:problem <id>` / `npm run new:algo <problemId> <techniqueId>` scaffolds that pass lint/typecheck.
8. Write `source-code/docs/adding-an-algorithm.md` (contract, conventions, checklist) for Phase B workers.
Gate: `npm ci && npm run typecheck && npm run lint && npm run test && npm run build && npm run e2e` all green.

## Phase B — Problems and algorithms (parallel workers, each own worktree branched from merged foundation)
Workers may only add/modify files under their own `src/problems/<id>/`, `src/algorithms/<id>/`, problem-specific editor/output components inside those folders, and their own e2e spec `e2e/catalog-<group>.spec.ts`. If a shared visualizer needs a change, implement the minimal generic extension, keep its existing tests green, and call it out in the report. Flip manifest status to `ready` only for their own ids (the manifest is the one shared file; edit only your own lines).

### B1 — Numbers, searching, generation, numerical (Ch 1, 2, 4, 5.4, 6.2, 6.5, 12.4)
| problemId | algorithms (techniqueId) | views |
|---|---|---|
| `gcd` | `euclid`, `consecutive-integer`, `middle-school` | sequence |
| `fibonacci` | `recursive`, `iterative`, `memo` (DP comparison) | tree, sequence |
| `search-sorted` | `sequential`, `binary`, `interpolation` | array-bars |
| `fake-coin` | `divide-by-two`, `divide-by-three` | sequence |
| `multiplication` | `russian-peasant`, `karatsuba`, `schoolbook` | sequence |
| `josephus` | `simulation`, `recurrence` | sequence |
| `combinatorial-generation` | `johnson-trotter`, `lexicographic-permutations`, `subsets-bitstring`, `gray-code` | sequence |
| `kth-smallest` | `quickselect-lomuto`, `sort-then-pick` | array-bars |
| `polynomial-eval` | `horner`, `naive` | sequence |
| `exponentiation` | `left-right-binary`, `right-left-binary`, `naive` | sequence |
| `matrix-multiplication` | `strassen`, `standard` | matrix |
| `linear-system` | `gaussian-elimination`, `lu-decomposition` | matrix |
| `root-finding` | `bisection`, `false-position`, `newton` | numeric-plot |
| `nim` | `winning-strategy` (single-pile and multi-pile XOR) | sequence |

### B2 — Sorting, heaps, trees, hashing, presorting (Ch 3.1, 4.1, 5.1–5.3, 6.1, 6.3, 6.4, 7.1, 7.3, 7.4)
| problemId | algorithms | views |
|---|---|---|
| `sorting` | `selection`, `bubble`, `insertion`, `mergesort`, `quicksort`, `heapsort`, `counting` (comparison/distribution counting) | array-bars (+ tree for heap/merge recursion) |
| `heap-construction` | `bottom-up`, `top-down` | tree, array-bars |
| `binary-tree-traversal` | `preorder`, `inorder`, `postorder`, `level-order` (+ height computation) | tree |
| `balanced-search-tree` | `bst-insert`, `avl-insert`, `two-three-insert`, `b-tree-insert` | tree |
| `dictionary-hashing` | `separate-chaining`, `linear-probing` | hash-table |
| `element-uniqueness` | `brute-force`, `presort` (also `mode` via presorting as variant) | array-bars |

### B3 — Graphs (Ch 3.5, 4.2, 8.4, 9.1–9.4, 10.2–10.4)
| problemId | algorithms | views |
|---|---|---|
| `graph-traversal` | `dfs`, `bfs` | graph (+ stack/queue panel) |
| `topological-sort` | `dfs-based`, `source-removal` | graph |
| `transitive-closure` | `warshall`, `dfs-each-vertex` | matrix, graph |
| `all-pairs-shortest-path` | `floyd`, `dijkstra-all-sources` | matrix, graph |
| `single-source-shortest-path` | `dijkstra`, `bfs-unweighted` (only on unit weights; adapter labels scope) | graph |
| `minimum-spanning-tree` | `prim`, `kruskal` (union-find panel) | graph |
| `huffman-coding` | `huffman` (+ fixed-length baseline for comparison) | tree |
| `maximum-flow` | `shortest-augmenting-path` (Edmonds–Karp), `ford-fulkerson-dfs` | graph |
| `bipartite-matching` | `augmenting-path`, `via-max-flow` | graph (bipartite layout) |
| `stable-marriage` | `gale-shapley-men-propose`, `gale-shapley-women-propose` | sequence/board (preference tables) |

### B4 — Strings, geometry, DP examples, LP (Ch 3.2, 3.3, 5.5, 7.2, 8.1, 8.3, 10.1)
| problemId | algorithms | views |
|---|---|---|
| `string-matching` | `brute-force`, `horspool`, `boyer-moore` | string-align |
| `closest-pair` | `brute-force`, `divide-and-conquer` | points-2d |
| `convex-hull` | `brute-force`, `quickhull` | points-2d |
| `coin-row` | `dp`, `memo`, `exhaustive` | sequence/matrix |
| `change-making` | `dp`, `greedy` (labeled may fail) | matrix |
| `coin-collecting` | `dp`, `exhaustive-paths` | board/matrix |
| `optimal-bst` | `dp`, `exhaustive` | matrix, tree |
| `linear-programming-2d` | `simplex`, `vertex-enumeration` | numeric-plot (2D feasible region) + matrix (tableau) |

### B5 — Combinatorial optimisation, backtracking, branch-and-bound, approximation + course topics (Ch 3.4, 12.1–12.3, exercises)
| problemId | algorithms | views |
|---|---|---|
| `tsp` | `exhaustive`, `branch-and-bound`, `nearest-neighbor`, `twice-around-tree`, `christofides` | points-2d, state-space-tree |
| `assignment` | `exhaustive`, `branch-and-bound`, `hungarian` (extension, labeled not in book) | board, state-space-tree |
| `n-queens` | `backtracking`, `exhaustive` | board, state-space-tree |
| `hamiltonian-circuit` | `backtracking`, `exhaustive` | graph, state-space-tree |
| `subset-sum` | `backtracking`, `dp`, `exhaustive` | state-space-tree, matrix |
| `graph-coloring` (bài Sở thú) | `greedy`, `welsh-powell`, `dsatur` (extension), `backtracking`, `exhaustive` | graph, state-space-tree |
| `matrix-chain` | `dp`, `memo`, `exhaustive` | matrix, tree |
| `lcs` | `dp`, `memo`, `brute-force` | matrix, string-align |

Knapsack (`knapsack-01`, already ready) stays as is; add `greedy-approx` enhanced variant only if trivial (optional).

## Phase I — Integration (orchestrator + one worker)
Merge B branches into the foundation branch one at a time (each cross-reviewed). Final gate with `COVERAGE=strict`: every manifest id is `ready`, registered, has tests and opens in the player without console errors (generated e2e that visits every `/play/:p/:a` and `/compare/:p` and `/testcases/:p`, runs a default input, asserts output + no console errors). Export testcases for every problem into `testcases/<problemId>/`. Redeploy to Cloudflare Pages.

## Acceptance (end of plan)
1. Every problem/algorithm in the tables above runs with step-by-step trace and correct output; compare works on every problem with ≥ 2 algorithms; testcases page works for every problem.
2. Navigation: three sidebar modes, command palette, `/problems`, `/algorithms`, breadcrumbs, sibling switcher; any algorithm reachable in ≤ 2 clicks from the sidebar.
3. Gates green: typecheck, lint, unit tests, build, e2e (incl. the all-routes smoke e2e and `COVERAGE=strict`).
4. Live on Cloudflare Pages without console errors.
