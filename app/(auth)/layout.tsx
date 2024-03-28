'use client'

import { useEffect, useState } from 'react'

import { ModeToggle } from '@/components/feature/mode-toggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="tw-min-h-svh tw-bg-gradient-primary tw-flex tw-flex-col">
      <div className="tw-ml-auto tw-pr-4 tw-py-2">
        <ModeToggle auth />
      </div>

      <div className="tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center">
        {children}
        <div className="tw-border tw-rounded-lg tw-border-orange-700 dark:tw-border-orange-400 tw-max-w-[400px] tw-p-4 tw-my-4 tw-mx-2">
          <p>Dear Valued User,</p>
          <br />
          <span>
            Feel free to login using your account. You&apos;re encouraged to ask Sergio any questions you may have,
            including the option to{' '}
            <span className="tw-font-semibold tw-text-rose-700 dark:tw-text-rose-500">delete</span> your account should
            you feel uneasy about maintaining an active presence on this app.
          </span>
        </div>
      </div>
    </div>
  )
}
