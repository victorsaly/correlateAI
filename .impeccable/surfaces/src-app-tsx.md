---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface: CorrelateAI app (Explore, Saved, Gallery, Learn)

Mode: Operate (Learn is Read). Audience: journalists checking claims, teachers, analysts. Task: choose two real series and get an honest verdict, then share or export it.

## Direction contract
THESIS: Every pair is a worked problem on graph paper. It is plotted, checked, and the verdict is marked in red pencil. It rejects the category's default dashboard of KPI tiles and chart cards with gradients.
OWN-WORLD:
- Light: pale millimetre graph-paper ground (a faint 8px/40px grid on the chart plate only), graphite ink, and red-pencil for verdict marks. Series A is solid ink-blue and series B is dashed graphite, so they differ by line form as well as hue.
- Dark: cyanotype blueprint ground with chalk lines.
- Atkinson Hyperlegible Next for UI and Atkinson Hyperlegible Mono for figures (unambiguous digits). Square 4px corners and 1px rules. No cards in cards.
STORY: The user sees a real pair already plotted, reads the verdict in one glance, toggles "Remove trend" and watches the correlation collapse. They then trust the result and share the deterministic link.
FIRST VIEWPORT:
- Thin top bar with the wordmark, tabs and theme toggle.
- A worksheet line "[A] vs [B]" with Swap and Random, plus an overlap route bar.
- The chart plate on the grid takes about 2/3 width.
- The right margin column has r in large mono figures, then p, n, the 95% CI and the detrended r, and the verdict circled in red pencil with its explanation.
- The primary action, "Share", sits under the verdict.
- Mobile stacks the picker, verdict, chart and stats.
FORM: Lab Notebook. Candidate 3 of 7 on my ordered list. Seed key c3f59f1a.
Signature interaction: the "Remove trend" toggle morphs the lines into their residuals while r counts down to the detrended r.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
