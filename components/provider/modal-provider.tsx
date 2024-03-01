'use client'

import { Fragment, useEffect, useState } from 'react'

import {
  CreateChannelModal,
  CreateServerModal,
  EditServerModal,
  InviteModal,
  ManageMemberModal,
} from '@/components/modals'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Fragment>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <ManageMemberModal />
      <CreateChannelModal />
    </Fragment>
  )
}
