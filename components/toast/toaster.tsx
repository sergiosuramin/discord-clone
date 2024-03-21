'use client'

import React, { useEffect } from 'react'
import toast, { Toaster, useToasterStore } from 'react-hot-toast'

export default function CustomToaster() {
  const { toasts } = useToasterStore()
  const limit = 4 // can custom define when needed

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((t, i) => i >= limit && t.duration !== Infinity)
      .forEach((t) => toast.dismiss(t.id))
  }, [toasts, limit])

  return (
    <Toaster
      position="top-center" // modify when needed
      toastOptions={{
        duration: 5000, // default duration
      }}
      // containerStyle={
      //   {
      //     top: 'var(--toaster-container-inset-y)',
      //     left: 'var(--toaster-container-inset-x)',
      //     right: 'var(--toaster-container-inset-x)',
      //     bottom:
      //       'calc(env(safe-area-inset-bottom) + var(--toaster-container-inset-y))',
      //   } as React.CSSProperties
      // }
    />
  )
}
