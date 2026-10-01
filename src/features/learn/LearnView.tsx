import { ExternalLink } from 'lucide-react'
import { categoryLabel } from '@/lib/format'
import type { Dataset } from '@/types'
import { WaitlistNote } from '@/app/WaitlistNote'
import { TryYourOwn } from './TryYourOwn'

export function LearnView({ catalog }: { catalog: Dataset[] }) {
  const groups = Object.entries(
    catalog.reduce<Record<string, Dataset[]>>((acc, d) => ((acc[d.category] ??= []).push(d), acc), {})
  ).sort(([x], [y]) => x.localeCompare(y))

  return (
    <div className="flex flex-col gap-14">
      <article className="max-w-[68ch] space-y-5 leading-relaxed">
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">How the verdict is worked out</h1>
        <p>
          Two things rising over the same decades will almost always correlate, whether or not they have anything to do with
          each other. CorrelateAI runs the checks a careful analyst would, and shows every number it used.
        </p>
        <Step term="Pearson r">
          How closely the two series move together, from −1 (perfectly opposite) through 0 (unrelated) to +1 (perfectly
          together). Computed only on the years both series cover.
        </Step>
        <Step term="p-value and 95% interval">
          How surprising this r would be if the series were really unrelated, given how many years there are. Few years
          means wide intervals and weak evidence. Below 0.05 is the conventional bar.
        </Step>
        <Step term="Detrended r">
          Each series has its straight-line trend over time subtracted, and r is computed again on what remains. If the
          correlation collapses, the two series were mostly just both going up (or down) over time.
        </Step>
        <Step term="The verdict">
          <em>Not significant</em> if p ≥ 0.05. <em>Likely spurious</em> if both series trend strongly and the detrended r
          falls below 0.3. <em>Direction flips</em> if the detrended r has the opposite sign and is at least 0.3 in size. <em>Interpret with caution</em> if detrending removes more than 0.4 of the correlation. Otherwise it{' '}
          <em>holds up after detrending</em>.
        </Step>
        <div className="rounded-md border px-5 py-4 text-sm">
          <p className="font-semibold">Limits worth knowing</p>
          <p className="mt-1 text-muted-foreground">
            The p-value assumes each year is independent of the last. Yearly data rarely is, so real-world p-values are
            somewhat optimistic; detrending helps but does not fully fix this. And even a correlation that holds up says
            nothing about which causes which, or whether a third factor drives both.
          </p>
        </div>
      </article>

      <section aria-labelledby="own" className="flex flex-col gap-4">
        <div className="max-w-[65ch]">
          <h2 id="own" className="text-2xl font-semibold tracking-[-0.02em]">Check your own numbers</h2>
          <p className="mt-2 text-muted-foreground">
            Paste two columns of values in time order, for example from a spreadsheet. Nothing leaves your browser.
          </p>
        </div>
        <TryYourOwn />
      </section>

      <section aria-labelledby="sources">
        <h2 id="sources" className="text-2xl font-semibold tracking-[-0.02em]">Sources</h2>
        <p className="mt-2 max-w-[65ch] text-muted-foreground">
          {catalog.length} yearly series, refreshed weekly from public sources that need no account. Each links to where it came from.
        </p>
        <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
          {groups.map(([cat, list]) => (
            <div key={cat}>
              <h3 className="border-b pb-1 text-sm font-semibold">{categoryLabel(cat)}</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {list.map((d) => (
                  <li key={d.id}>
                    {d.name}
                    <span className="block text-xs text-muted-foreground">
                      {d.dateRange.start}–{d.dateRange.end} ·{' '}
                      <a href={d.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 underline">
                        {d.source} <ExternalLink aria-hidden className="size-3" />
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <WaitlistNote />
    </div>
  )
}

function Step({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-semibold">{term}</h2>
      <p className="mt-1 text-muted-foreground">{children}</p>
    </div>
  )
}
