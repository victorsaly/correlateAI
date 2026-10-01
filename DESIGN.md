---
name: CorrelateAI
description: Two real public series plotted on graph paper, checked, and marked with an honest verdict.
colors:
  graphite-ink: "#1d2a2e"
  graph-paper: "#f7f8f4"
  plate-paper: "#fbfcf9"
  ruled-wash: "#ebefe8"
  pressed-wash: "#e3e9e3"
  faded-graphite: "#56656a"
  rule-line: "#cbd5cf"
  input-rule: "#b9c5bf"
  grid-fine: "rgb(120 160 150 / 0.16)"
  grid-major: "rgb(120 160 150 / 0.32)"
  series-a-ink-blue: "#1a62ab"
  series-b-sienna: "#b8631a"
  red-pencil: "#b8322a"
  affirm-green: "#2b7448"
  caution-ochre: "#8a5a00"
  cyanotype-sheet: "#0a2a4c"
  cyanotype-plate: "#0c3057"
  cyanotype-popover: "#10386a"
  cyanotype-wash: "#113a66"
  cyanotype-pressed: "#154476"
  chalk: "#eef4fa"
  faded-chalk: "#aac4de"
  cyanotype-rule: "#2d5d8f"
  cyanotype-input-rule: "#3b6c9f"
  cyanotype-ring: "#7cc4ea"
  cyanotype-grid-fine: "rgb(235 245 255 / 0.1)"
  cyanotype-grid-major: "rgb(235 245 255 / 0.24)"
  series-a-cyan: "#279fc6"
  series-b-amber: "#d07f2a"
  chalk-pencil: "#ff8f80"
  chalk-affirm: "#74d9a0"
  chalk-caution: "#f0c060"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.55
  body:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
  figure:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "\"tnum\""
rounded:
  sm: "2px"
  md: "4px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  gutter: "16px"
  gutter-wide: "24px"
  container: "72rem"
  margin-column: "22rem"
components:
  button-primary:
    backgroundColor: "{colors.graphite-ink}"
    textColor: "{colors.graph-paper}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.graph-paper}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline-hover:
    backgroundColor: "{colors.pressed-wash}"
    textColor: "{colors.graphite-ink}"
  button-ghost-link:
    textColor: "{colors.graphite-ink}"
    padding: "0"
    height: "36px"
  toggle-item-on:
    backgroundColor: "{colors.pressed-wash}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  series-select:
    backgroundColor: "{colors.plate-paper}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "44px"
  tab:
    textColor: "{colors.faded-graphite}"
    padding: "0"
    height: "44px"
  tab-active:
    textColor: "{colors.graphite-ink}"
  chart-plate:
    backgroundColor: "{colors.plate-paper}"
    rounded: "{rounded.md}"
    padding: "12px"
    height: "26rem"
  verdict-mark:
    textColor: "{colors.red-pencil}"
    padding: "14px 24px"
  verdict-mark-small:
    textColor: "{colors.red-pencil}"
    typography: "{typography.label}"
    padding: "6px 12px"
  headline-r:
    textColor: "{colors.graphite-ink}"
    typography: "{typography.display}"
---

# Design System: CorrelateAI

## Overview

**Creative North Star: "The Lab Notebook"**

Every pair is a worked problem on graph paper. Two series are plotted, the arithmetic is checked in the margin, and the verdict is marked in red pencil. The system is a single sheet, not a dashboard: one ruled chart plate, one margin column of figures, and hairline rules doing the separating work that cards, tiles and gradients do elsewhere. In the light mode the sheet is pale graph paper with graphite ink. In the dark mode the same sheet becomes a cyanotype blueprint with chalk line work. The structure stays identical across modes and only the materials change.

Density is moderate and numerical. The figures are the content, so they get the hyperlegible mono face with tabular digits and the largest size on the page, while UI chrome stays small, quiet and graphite-toned. Colour is functional only: two series inks, three verdict inks, and nothing decorative. Any meaning that colour carries is also carried by form, whether that is a line dash, a ring style or an icon.

The voice is plain, exact and calm. Copy never uses emoji and never claims AI, "quantum" or "cutting-edge" anything. The surface rejects the category default of KPI tiles, chart cards with gradients and glowing accents.

**Key Characteristics:**
- One sheet with two materials: graph paper (light) and cyanotype (dark).
- Figures are set in Atkinson Hyperlegible Mono with tabular numerals, and the headline r is the largest type on the page.
- Series A is a solid line and series B is dashed (6 4), so the two differ in form as well as hue.
- The verdict is always ink, icon and ring form together, never colour alone.
- Corners are square 4px and separators are 1px rules. Containers are never nested.
- One authored motion moment: removing the trend.

## Colors

The palette is graphite on paper (or chalk on cyanotype), with two validated series inks and three verdict inks. Nothing else is chromatic.

### Primary
- **Graphite Ink** (light) / **Chalk** (dark): text, the primary button fill, the active tab underline, and the headline r. The primary action inverts it, with graphite fill on paper or chalk fill on cyanotype.

### Secondary (series inks)
- **Series A, Ink Blue** (light) / **Cyan** (dark): the solid line, its legend swatch, its coverage bar and its source dot. In light mode it doubles as the focus ring, and it tints the text selection at 28%.
- **Series B, Sienna** (light) / **Amber** (dark): the dashed line (6 4) and every swatch for B, which is dashed by mask wherever it appears.
- Both pairs were validated with the dataviz CVD and contrast checker: #1a62ab and #b8631a on #f7f8f4, and #279fc6 and #d07f2a on #0c3057 (the dark chart plate).

### Tertiary (verdict inks)
- **Red Pencil** (light) / **Chalk Pencil** (dark): verdicts for "likely spurious" and "not significant", plus error borders. It is also the destructive token.
- **Affirm Green** / **Chalk Affirm**: the "significant" verdict only.
- **Caution Ochre** / **Chalk Caution**: the "caution" verdict only.
- **Faded Graphite** / **Faded Chalk**: the "insufficient data" verdict, alongside its general role as muted text.

### Neutral
- **Graph Paper** / **Cyanotype Sheet**: the page ground.
- **Plate Paper** / **Cyanotype Plate**: the chart plate, the series selects and popovers. Its one step lighter (or deeper) than the ground marks the ruled working area.
- **Ruled Wash** / **Cyanotype Wash**: muted and secondary surfaces, such as the table header and skeletons.
- **Pressed Wash** / **Cyanotype Pressed**: hover and the "on" state of toggle groups.
- **Faded Graphite** / **Faded Chalk**: labels, captions, axis ticks and quiet figures. They pass AA in both modes.
- **Rule Line** / **Cyanotype Rule**: every 1px border and divider. **Input Rule** / **Cyanotype Input Rule** is the slightly stronger rule used on form controls.
- **Grid Fine / Grid Major**: the chart ruling only. Fine lines sit on the plate background every 8px. Major lines are drawn by the chart itself.

### Named Rules
**The Two Inks Rule.** Only the two series and the three verdict states carry hue. A chromatic accent for decoration, branding or emphasis is not part of this system.

**The Never Colour Alone Rule.** A verdict always pairs its ink with an icon and a ring form: solid (significant, not significant), dashed (caution), double (likely spurious) or dotted (insufficient). A series is always told apart by line form, with A solid and B dashed. Grey out the screen and every meaning must survive.

## Typography

**Body Font:** Atkinson Hyperlegible Next (with ui-sans-serif, system-ui, sans-serif), weights 400 and 600, italic 400.
**Figure Font:** Atkinson Hyperlegible Mono (with ui-monospace, monospace), weights 400 and 600.

**Character:** Both faces were drawn for unambiguous letterforms and digits, which matters on a page made of numbers: the slashed zero, the open 1 and the distinct 5 and 6 all read at a glance. The sans faces handle every word and the mono face handles every figure.

### Hierarchy
- **Display** (Mono 600, 3.75rem, line-height 1, -0.03em): the headline r only, prefixed with a sign (+0.91). It also appears at the same size on the share card.
- **Headline** (600, 1.5rem, -0.02em): view titles such as "Gallery". The wordmark uses the same treatment at 1.25rem.
- **Title** (600, 1.125rem): section heads inside a view.
- **Body** (400, 1rem, 1.5): running text, and the select values at 16px so mobile never zooms. Prose is capped at 60–65ch.
- **Body small** (400, 0.875rem): margin explanations, legends, source notes, and stat terms set in muted ink.
- **Label** (400, 0.75rem): chart captions, units, axis ticks (12px) and the coverage-ruler years.
- **Figure** (Mono 400, 1rem, tabular): p, n, CI, r² and the raw and detrended r, plus every table cell and count.
- **Tabs** (400, 15px): muted until active.

### Named Rules
**The Figures Are Mono Rule.** Any number that a reader might compare, copy or cite is set in the mono face with tabular numerals. Years in prose and running copy stay in the sans.

**The Two Weights Rule.** Only 400 and 600 are loaded. Hierarchy comes from size, ink (graphite against faded graphite) and position, never from more weights.

## Layout

The layout is a single centred sheet, max 72rem wide, with 16px side gutters that grow to 24px from 640px. A thin top bar holds the wordmark, the tagline, the theme toggle and the source link, with underline tabs beneath it, all closed by a 1px rule.

Explore is a worksheet. First comes a full-width line reading "[A] vs [B]", with Swap and Random and a coverage ruler under it. Below that is a two-column grid from 1024px: the chart plate fills the flexible column (minmax(0,1fr)), and a 22rem margin column sits to its right, divided from it by a 1px left rule with 32px of inset. The margin stacks the headline r, then the figures between two rules, then the verdict, then the Share action and Save. Under 1024px everything stacks in reading order: headline r, figures, verdict and share, then the chart. Source notes and the data table sit below a full-width rule, in two columns from 768px.

The rhythm is built on 4px: 8px and 12px inside controls, 16px and 24px between groups, 32px between the columns and the main padding, and 40px between gallery sections. The chart plate is 22rem tall on mobile and 26rem from 640px. Lists such as the Gallery and Saved views are ruled rows (a 1px top rule on the list and a 1px rule under each row), never tiles.

**The Margin Column Rule.** Statistics and the verdict live in the right-hand margin of the sheet, separated by a rule, not boxed. The chart is the page and the margin annotates it.

## Elevation & Depth

The system is flat. Depth is conveyed by material, with the plate one tone off the ground and the fine ruling marking the working surface, and by 1px rules. Nothing at rest casts a shadow. The only floating layers are transient: the chart tooltip, select lists and the share menu. These use the popover surface and a soft shadow, because they genuinely sit above the sheet.

### Shadow Vocabulary
- **Floating layer** (`box-shadow: 0 4px 16px rgb(0 0 0 / 0.12)`): the chart tooltip only. Radix menus and select lists use the equivalent shadcn `shadow-md`.

**The Flat Sheet Rule.** Surfaces that belong to the sheet never lift. If an element is part of the worksheet, separate it with a rule or a tone. Only something that floats over the sheet and then disappears gets a shadow.

## Shapes

Corners are square-ish at 4px, used on buttons, selects, toggle groups, the chart plate, the alert and the data table. Menu items use 2px. The only round forms are the 8px source dots next to each series name and the hand-drawn pencil ring around a verdict.

Lines are the form language. Borders are 1px. Series lines are 2px. The active tab is a 2px underline. Swatches are 2px bars: solid for A, and masked to a 6/4 or 5/3 dash for B. The coverage ruler draws each series' years as these same bars on a shared axis, with the overlap marked.

### The chart plate
The plate is a ruled working surface. CSS draws a fine 8px grid in grid-fine on the plate tone, offset by -1px so the first lines register with the border. The major lines are **not** in the CSS. The chart draws them in grid-major on its own ticks: round years on x (every 1, 2, 5, 10, 20, 25 or 50 years, chosen so there are 8 ticks or fewer) and whole standard deviations on y. The paper and the scale therefore always register. A zero baseline is drawn in faded graphite at 50% opacity.

**The One Axis Rule.** Charts never use a dual axis. A pair is shown either standardised on one shared axis (z-scores, labelled with true minus signs, +2 to −2) or as small multiples in actual units, two panels stacked on a shared year axis. The scatter view (A against B) draws one dot per year with a dashed least-squares fit.

**The No Nesting Rule.** A bordered container never sits inside another bordered container. The plate is the only framed region in a view.

## Components

### Buttons
- **Shape:** gently squared (4px), 36px tall (32px small, 44px on mobile touch rows), with 16px horizontal padding and 14px text.
- **Primary:** a graphite fill with paper text in light mode, and a chalk fill with cyanotype text in dark mode. A view gets one primary action: Share on Explore. "Remove trend" adopts the primary fill while it is pressed, so its pressed state is unmistakable.
- **Outline:** a 1px rule on the ground. It fills with the pressed wash on hover. Used for Copy link, Download, Swap and Random pair.
- **Ghost / link:** no padding, underlined on hover (Save this pair, Show the table).
- **Focus:** a 2px outline in the ring colour, offset 2px, applied globally.

### Toggle groups
- **Style:** joined segments with 4px outer corners and a 1px input rule. Each item is 32px tall with 12px side padding.
- **State:** the "on" segment fills with the pressed wash. They are used for chart form (Over time, A against B) and scale (Standardised, Actual units).

### Series select
- **Style:** a 44px plate-tone trigger with a 1px input rule and a 16px value. A 20px swatch leads it (solid for A, dashed for B), so the picker teaches the legend.
- **Menu:** grouped by category on the popover surface.

### Tabs
- **Style:** text only, 15px, faded graphite, 24px apart, 44px tall. The active tab turns graphite and gains a 2px underline that overlaps the header rule.

### Headline r and figures
The margin opens with a small muted label ("Correlation", or "Correlation, trend removed"), then the r in display mono with an explicit sign, then a strength phrase. A two-column definition list sits between 1px rules underneath it. The figure that duplicates the headline is set in muted ink.

### Verdict Mark (signature)
The verdict label is set in 600 weight at 15px with its icon, and a hand-drawn pencil ellipse surrounds it in the verdict ink. The ellipse slightly overshoots its start, like a pencil loop. The ring is 2px at the medium size and 1.5px at the small size used in Gallery and Saved rows. The ring form encodes the level (see The Never Colour Alone Rule). The double ring adds a second, lighter loop. A muted plain-language explanation always follows the mark.

### Chart plate, legend and tooltip
The legend sits above the plate as text with 24px line swatches. The caption under the plate (12px, muted) states the scale in plain words and adds a note when the trend is removed. The tooltip is the one floating card: popover surface, 4px corners, 1px rule and 12px text.

### Pair rows (Gallery, Saved)
These are ruled list rows rather than cards: the pair name in 600 weight with a muted "vs", then the figures in mono columns, then a small verdict mark and a chevron. The whole row is a single hit target, and its names underline on hover.

### Share card
A 1200×630 static composition of the same world: the wordmark and URL, the pair title in series inks, the plate with the chart (not animated), and the r in display mono. It is rendered in both themes.

## Motion

There is one authored moment, and everything else is near-instant. Toggling "Remove trend" tweens the same line paths into their residuals over **700ms ease-out**. At the same time the headline r counts to its new value over **700ms** with a quadratic ease-out, so the number and the lines settle together. When the verdict level changes, the pencil ring draws on through an animated mask (**520ms, cubic-bezier(0.16, 1, 0.3, 1)**), which keeps dashed and dotted rings intact as they draw. The double ring's second loop follows after **380ms**, over 420ms. While a new pair loads, the current one dims to 60% opacity. Under `prefers-reduced-motion: reduce`, CSS animations and transitions collapse to 0.01ms and the r counter snaps directly to its value. The Recharts line tween is driven by JavaScript, so it checks the same media query and is turned off.

## Do's and Don'ts

### Do:
- **Do** set every comparable number in Atkinson Hyperlegible Mono with tabular numerals, and sign every r (+0.91, −0.01).
- **Do** draw series A solid and series B dashed (6 4) in every chart, swatch, select and coverage bar.
- **Do** pair every verdict ink with its icon and ring form (solid, dashed, dotted or double), followed by a plain-language explanation.
- **Do** keep the major grid on the chart's own round-year ticks so paper and scale register. The plate CSS carries the fine 8px ruling only.
- **Do** separate regions with 1px rules and the plate tone, and keep corners at 4px.
- **Do** caption every chart in plain words, and offer the paired years as a table.
- **Do** define both modes for every new token: graph paper and cyanotype.
- **Do** write copy that is plain, exact and calm.

### Don't:
- **Don't** put two series on a dual axis. Use one standardised axis or stacked small multiples in actual units.
- **Don't** let colour alone carry a verdict or tell the series apart.
- **Don't** nest a bordered container inside another, and don't turn statistics into KPI tiles or chart cards.
- **Don't** add gradients, glows, or shadows on anything that belongs to the sheet.
- **Don't** introduce hue outside the two series inks and three verdict inks.
- **Don't** add motion beyond the trend toggle and the pencil ring, and never animate without honouring reduced motion.
- **Don't** use emoji, or claim AI, "quantum" or "cutting-edge" anything.
