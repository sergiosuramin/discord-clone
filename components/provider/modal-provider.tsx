'use client'

import { Fragment, useEffect, useState } from 'react'

import {
  CreateChannelModal,
  CreateServerModal,
  DeleteChannelModal,
  DeleteMessageModal,
  DeleteServerModal,
  EditChannelModal,
  EditServerModal,
  InviteModal,
  LeaveServerModal,
  ManageMemberModal,
  MessageFileModal,
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
      <MessageFileModal />
      <DeleteMessageModal />
    </Fragment>
  )
}
