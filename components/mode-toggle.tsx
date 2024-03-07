'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { SystemMode } from '@/types/enums'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const onSetMode = () => {
    setTheme(theme === SystemMode.Dark ? SystemMode.Light : SystemMode.Dark)
  }

  return (
    <Button variant="transparent" size="icon" onClick={() => onSetMode()}>
      <Sun className="tw-h-[1.2rem] tw-w-[1.2rem] tw-rotate-0 tw-scale-100 tw-transition-all dark:tw--rotate-90 dark:tw-scale-0" />
      <Moon className="tw-absolute tw-h-[1.2rem] w-[1.2rem] tw-rotate-90 tw-scale-0 tw-transition-all dark:tw-rotate-0 dark:tw-scale-100" />
      <span className="tw-sr-only">Toggle theme</span>
    </Button>
  )
}
