'use client'

import { Plus } from 'lucide-react'

import { ActionTooltip } from '@/components/action-tooltip'

export const NavigationAction = () => {
  return (
    <div>
      <ActionTooltip label="Create a server" side="right" align="center">
        <button className="tw-group">
          <div className="tw-flex tw-justify-center tw-items-center tw-mx-3 tw-w-[40px] tw-h-[40px] tw-rounded-[20px] group-hover:tw-rounded-[12px] tw-transition-all tw-overflow-hidden tw-bg-background dark:tw-bg-neutral-700 group-hover:tw-bg-emerald-500">
            <Plus className="group-hover:tw-text-white tw-transition tw-text-emerald-500" size={24} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
