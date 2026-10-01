export function AppFooter({ count }: { count: number }) {
  return (
    <footer className="mt-20 border-t py-8 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:justify-between sm:px-6">
        <p className="max-w-[60ch]">
          {count > 0 && `${count} public series from the World Bank, Our World in Data, USGS, Open-Meteo and the ECB, refreshed weekly. `}
          Correlation does not imply causation.
        </p>
        <p className="flex gap-4">
          <a href="https://victorsaly.com" target="_blank" rel="noopener noreferrer" className="underline">Made by Victor Saly</a>
          <a href="https://github.com/victorsaly/correlateAI" target="_blank" rel="noopener noreferrer" className="underline">Source on GitHub</a>
        </p>
      </div>
    </footer>
  )
}
