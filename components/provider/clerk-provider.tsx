'use client'

import { ClerkProvider as CP } from '@clerk/nextjs'
import { dark as clerkDark } from '@clerk/themes'
import { useTheme } from 'next-themes'
import { ReactNode } from 'react'

import { SystemMode } from '@/types/enums'

export function ClerkProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const baseTheme = theme === SystemMode.Dark ? clerkDark : null

  return <CP appearance={{ baseTheme }}>{children}</CP>
}
