import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { ThemePref } from '@/hooks/useTheme'

export function ThemeToggle({ pref, isDark, onChange }: { pref: ThemePref; isDark: boolean; onChange: (t: ThemePref) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Theme">
          {isDark ? <Moon /> : <Sun />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={pref} onValueChange={(v) => onChange(v as ThemePref)}>
          <DropdownMenuRadioItem value="light"><Sun /> Graph paper</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark"><Moon /> Blueprint</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system"><Monitor /> Match system</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
