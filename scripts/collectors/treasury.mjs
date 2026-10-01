/**
 * U.S. Treasury Fiscal Data — Historical Debt Outstanding, no key required.
 * https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_outstanding
 * One record per fiscal year (since 1790): { record_fiscal_year, debt_outstanding_amt }.
 */
import { annualize, fetchJson } from '../lib/collectorUtils.mjs'

const URL =
  'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_outstanding' +
  '?fields=record_fiscal_year,debt_outstanding_amt&sort=record_fiscal_year&page%5Bsize%5D=1000'

export async function collect() {
  try {
    const json = await fetchJson(URL)
    // The 1976 fiscal-year change produced two records for one year; keep the later.
    const points = annualize(
      (json?.data || []).map((r) => ({ year: r.record_fiscal_year, value: r.debt_outstanding_amt })),
      { agg: 'last' }
    )
    return [
      {
        id: 'treasury-federal-debt',
        meta: {
          name: 'US Federal Debt Outstanding',
          unit: 'USD',
          category: 'economics',
          source: 'U.S. Treasury',
          sourceUrl: 'https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/',
          description: 'Total US federal debt outstanding at the end of each fiscal year (U.S. Treasury Fiscal Data).',
        },
        points,
      },
    ]
  } catch (err) {
    console.warn(`  ⚠ Treasury failed: ${err.message}`)
    return []
  }
}
