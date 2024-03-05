'use client'

import { Fragment, useEffect, useState } from 'react'

import {
  CreateChannelModal,
  CreateServerModal,
  DeleteChannelModal,
  DeleteServerModal,
  EditChannelModal,
  EditServerModal,
  InviteModal,
  LeaveServerModal,
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
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
    </Fragment>
  )
}
