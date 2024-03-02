'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SystemMode } from '@/types/enums'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="transparent" size="icon">
          <Sun className="tw-h-[1.2rem] tw-w-[1.2rem] tw-rotate-0 tw-scale-100 tw-transition-all dark:tw--rotate-90 dark:tw-scale-0" />
          <Moon className="tw-absolute tw-h-[1.2rem] w-[1.2rem] tw-rotate-90 tw-scale-0 tw-transition-all dark:tw-rotate-0 dark:tw-scale-100" />
          <span className="tw-sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuItem onClick={() => setTheme(SystemMode.Light)}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(SystemMode.Dark)}>Dark</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
