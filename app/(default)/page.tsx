'use client'
import { UserButton } from '@clerk/nextjs'

import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div>
      <div className="dark:tw-bg-indigo-500 tw-text-indigo-300 dark:tw-text-3xl dark:tw-text-yellow-300">
        intializing: discord clone practice
      </div>
      <Button onClick={() => alert('hehe')}>test</Button>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  )
}
