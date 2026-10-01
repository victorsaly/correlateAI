import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MAILTO =
  'mailto:info@victorsaly.com?subject=' +
  encodeURIComponent('CorrelateAI Pro waitlist') +
  '&body=' +
  encodeURIComponent('I’d like early access to CorrelateAI Pro. I mostly want it for: ')

/** Pro is not built yet: this only collects interest by email. */
export function WaitlistNote() {
  return (
    <section aria-labelledby="pro" className="flex flex-col gap-4 rounded-md border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="max-w-[60ch]">
        <h2 id="pro" className="text-xl font-semibold tracking-[-0.02em]">CorrelateAI Pro is in the works</h2>
        <p className="mt-1 text-muted-foreground">
          Upload your own series, embed live charts in articles and lessons, and pull results through an API. Tell us what
          you’d use it for and we’ll let you know when it opens.
        </p>
      </div>
      <Button asChild size="lg" className="shrink-0">
        <a href={MAILTO}>
          <Mail /> Join the waitlist
        </a>
      </Button>
    </section>
  )
}
