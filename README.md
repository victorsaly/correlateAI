# CorrelateAI

**Is that correlation real, or a coincidence?** Pair two real public datasets and get an honest verdict.

[correlateai.victorsaly.com](https://correlateai.victorsaly.com)

Two things that rise over the same decades will almost always correlate, whether or not they are related. CorrelateAI computes every statistic in the browser from source-linked public data, then checks whether the link survives once each series' time trend is removed.

## What it shows

For any pair of series:

- **Pearson r**, computed only on the years both series cover
- **p-value** (two-tailed t-test) and a **95% confidence interval** (Fisher z)
- **Detrended r**: the correlation after subtracting each series' straight-line trend
- **A plain-language verdict**: *Not significant*, *Likely spurious (shared time trend)*, *Direction flips without the trend*, *Interpret with caution*, or *Holds up after detrending*

Every result has a reproducible link (`/?a=<series>&b=<series>`). You can export it as a PNG card, as CSV, or as JSON with sources and statistics.

**Views**
- **Explore**: pick two series, or a random pair.
- **Gallery**: notable pairs from every combination, with a note on multiple comparisons.
- **Saved**: pairs saved in your browser.
- **How it works**: methodology, a calculator for your own numbers, and every source.

The verdict rules live in [`src/lib/correlationStats.ts`](src/lib/correlationStats.ts) and are covered by tests.

## Data

35 yearly series from sources that need no API key. A weekly GitHub Action refreshes them via `npm run collect:real`:

| Source | Series |
|---|---|
| World Bank | US GDP, population, life expectancy, inflation, internet users, and more |
| Our World in Data | CO₂ emissions, obesity, renewable share, alcohol, internet usage |
| USGS | Worldwide M5+ and M6+ earthquakes per year |
| Open-Meteo (ERA5) | Annual mean temperature for London, New York, Sydney and Tokyo |
| Frankfurter (ECB) | USD to EUR, GBP and JPY |

Each series is stored as `public/data/<id>.json` (`[{ year, value }]`). The catalog is `public/data/real_list.json`, with the source URL for every series.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # statistics, year alignment, share URLs
npm run type-check
npm run lint
npm run build        # set SKIP_PREFETCH=true to skip legacy prefetch
npm run collect:real # refresh the real data series
```

Built with React 19, Vite, Tailwind CSS v4, Radix primitives and Recharts. It deploys to GitHub Pages from `main` through GitHub Actions; the Pages source must be set to "GitHub Actions".

## Limits

The p-value assumes each year is independent of the last. Yearly series rarely are, so p-values are somewhat optimistic. Detrending helps, but it does not fully correct for this. A correlation that holds up still says nothing about cause.

## Pro

Custom uploads, embeds and an API are planned. [Join the waitlist](mailto:info@victorsaly.com?subject=CorrelateAI%20Pro%20waitlist).

## License

MIT © [Victor Saly](https://victorsaly.com)
