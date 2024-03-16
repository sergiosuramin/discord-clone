'use client'

import { Plus } from 'lucide-react'

import { ActionTooltip } from '@/components/feature/action-tooltip'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { EModalType } from '@/types/enums'

export const NavigationAction = () => {
  const { onOpen } = useModal()

  const onOpenCreateServer = () => {
    onOpen(EModalType.CreateServer)
  }
  return (
    <div>
      <ActionTooltip label="Create a server" side="right" align="center">
        <button className="tw-group" onClick={() => onOpenCreateServer()}>
          <div className="tw-flex tw-justify-center tw-items-center tw-mx-4 tw-w-[40px] tw-h-[40px] tw-rounded-[20px] group-hover:tw-rounded-[12px] tw-transition-all tw-overflow-hidden tw-bg-background dark:tw-bg-neutral-700 group-hover:tw-bg-emerald-500">
            <Plus className="group-hover:tw-text-white tw-transition tw-text-emerald-500" size={24} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
