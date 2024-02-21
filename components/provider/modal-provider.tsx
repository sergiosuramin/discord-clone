'use client'

import { Fragment, useEffect, useState } from 'react'

import { CreateServerModal } from '@/components/modals/create-server-modal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Fragment>
      <CreateServerModal />
    </Fragment>
  )
}
