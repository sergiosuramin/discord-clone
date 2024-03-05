'use client'

import { Plus, Settings } from 'lucide-react'

import { ActionTooltip } from '@/components/action-tooltip'
import { useCurrentRole } from '@/hooks/misc'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { EModalType, EServerExplorerType } from '@/types/enums'
import { IServerSectionProps } from '@/types/misc'

const ServerSection = ({ label, sectionType, channelType, role, server }: IServerSectionProps) => {
  const { onOpen } = useModal()
  const { isAdmin, isGuest } = useCurrentRole(role)

  return (
    <div className="tw-flex tw-justify-between tw-items-center tw-py-2">
      <p className="tw-text-xs tw-uppercase tw-font-semibold tw-text-zinc-500 dark:tw-text-zinc-400">{label}</p>

      {!isGuest && sectionType === EServerExplorerType.Channel && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen(EModalType.CreateChannel, { channelType })}
            className="tw-text-zinc-500 hover:tw-text-zinc-600 dark:tw-text-zinc-500 dark:hover:tw-text-zinc-300 tw-transition"
          >
            <Plus className="tw-w-4 tw-h-4" />
          </button>
        </ActionTooltip>
      )}

      {isAdmin && sectionType === EServerExplorerType.Member && (
        <ActionTooltip label="Manage Member" side="top">
          <button
            onClick={() => onOpen(EModalType.ManageMembers, { server })}
            className="tw-text-zinc-500 hover:tw-text-zinc-600 dark:tw-text-zinc-500 dark:hover:tw-text-zinc-300 tw-transition"
          >
            <Settings className="tw-w-4 tw-h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}

export default ServerSection
