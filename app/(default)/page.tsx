'use client'
import { UserButton } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div>
      <div className="tw-bg-indigo-500">intializing: discord clone practice</div>
      <Button onClick={() => alert('hehe')}>test</Button>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
