'use client'
import { UserButton } from '@clerk/nextjs'

import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <div>
      <div className="dark:tw-bg-indigo-500 tw-text-indigo-300 dark:tw-text-3xl dark:tw-text-yellow-300">
        intializing: discord clone practice
      </div>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  )
}
