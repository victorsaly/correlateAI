# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Three audiences, served equally:
- **Journalists and writers** who see a claim like "X correlates with Y" and want to check it against real data, then cite or share the verdict.
- **Teachers and students** learning why correlation isn't causation, using real series and a live detrending demonstration.
- **Analysts** exploring pairs of public indicators and exporting the aligned data and statistics.

## Product Purpose
CorrelateAI lets anyone pair two real public time series and get an honest answer to "is this correlation real or a coincidence?" It shows Pearson r, a p-value, a 95% confidence interval, n, and the correlation after removing each series' time trend. A plain-language verdict sums these up. Success means people trust the numbers enough to cite and share them, and leave understanding why most striking correlations are spurious.

## Positioning
The product is honest by construction. Every number is computed in the browser from source-linked public data, and every result comes with a verdict on whether the link survives detrending. Viral "spurious correlation" sites exist to entertain. This one is built to check claims, and the results are reproducible: each pair has a deterministic URL.

## Operating Context
- Used in a browser on desktop and mobile. Shared via links and social cards on X, LinkedIn and Bluesky.
- Results are cited in articles and shown in classrooms.
- Data refreshes weekly through a GitHub Actions job that commits `public/data/`. The site is hosted on GitHub Pages at correlateai.victorsaly.com.

## Capabilities and Constraints
- **Catalog:** the 72 series in `public/data/real_list.json`, each `[{year, value}]` at annual resolution. Sources are World Bank, Our World in Data, Open-Meteo (ERA5), Frankfurter (ECB), NOAA, USGS, NSIDC, SILSO and the U.S. Treasury. Most series cover the US.
- **Statistics:** all statistics come from `src/lib/correlationStats.ts`. Nothing is randomised except the choice of a random pair.
- **Hosting:** static site with no backend or accounts. Saved pairs live in localStorage.
- **Pro tier:** custom uploads, embeds and an API. None of it is built yet. A waitlist is collected via a mailto link to info@victorsaly.com.
- **Statistical caveat (must be stated, never hidden):** p-values assume independent observations, but annual series are autocorrelated.

## Brand Commitments
- **Name:** stays "CorrelateAI". There is no AI in the product, so copy never claims AI, "quantum", or anything "cutting-edge".
- **Voice:** plain, exact and calm. No emoji, no hype.
- **Author:** Victor Saly (victorsaly.com, github.com/victorsaly).

## Evidence on Hand
- **Data:** real data files and their source URLs in the manifest.
- **Absent, never fabricate:** there are no users, testimonials, press, usage numbers, pricing or citations.

## Product Principles
1. Every number shown can be traced to a source and recomputed.
2. Verdict first, jargon second. Explain the statistics in plain language.
3. A shared result has to reproduce: the same link gives the same numbers.
4. Teach the trap, so users learn how spurious correlations arise instead of just being shown them.

## Accessibility & Inclusion
Verdicts must not rely on colour alone. Charts need text summaries. Both light and dark themes must meet WCAG AA contrast.
