'use client'

import { Edit, Lock, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { ActionTooltip } from '@/components/feature/action-tooltip'
import { ChannelIcon } from '@/components/icons'
import { useCurrentRole } from '@/hooks/misc'
import { useModal } from '@/hooks/zuztand/use-modal-store'
import { cn } from '@/lib/utils'
import { ELockedChannelName, EModalType } from '@/types/enums'
import { IServerChannelProps } from '@/types/misc'

const ServerChannel = ({ channel, server, role }: IServerChannelProps) => {
  const { onOpen } = useModal()
  const params = useParams()
  const router = useRouter()
  const { isGuest } = useCurrentRole(role)

  const isCurrentChannel = params?.channelId === channel.id
  const isChannelLocked = channel.name === ELockedChannelName.general

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }

  const onActionClick = (e: React.MouseEvent, action: EModalType) => {
    e.stopPropagation()
    onOpen(action, { server, channel })
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'tw-group tw-p-2 tw-rounded-md tw-flex tw-items-center tw-w-full hover:tw-bg-zinc-700/20 dark:hover:tw-bg-zinc-700/70 tw-transition tw-mb-1 tw-gap-x-2',
        isCurrentChannel && 'tw-bg-zinc-700/20 dark:tw-bg-zinc-700'
      )}
    >
      <ChannelIcon channelType={channel.type} className="tw-flex-shrink-0 tw-text-zinc-500 dark:tw-text-zinc-400" />

      <p
        className={cn(
          'tw-line-clamp-1 tw-text-left tw-font-semibold tw-text-sm tw-text-zinc-500 dark:tw-text-zinc-400 group-hover:tw-text-zinc-600 dark:group-hover:tw-text-zinc-300 tw-transition',
          isCurrentChannel && 'tw-text-primary dark:tw-text-zinc-200 dark:group-hover:tw-text-white'
        )}
      >
        {channel.name}
      </p>

      {isChannelLocked && (
        <Lock className="tw-w-4 tw-h-4 tw-text-zinc-500 dark:tw-text-zinc-400 hover:tw-text-zinc-600 dark:hover:tw-text-zinc-300 tw-transition tw-ml-auto" />
      )}

      {!isChannelLocked && !isGuest && (
        <div className="tw-flex tw-items-center tw-gap-x-2 tw-ml-auto">
          <ActionTooltip label="Edit" side="top">
            <Edit
              className="tw-hidden group-hover:tw-block tw-w-4 tw-h-4 tw-text-zinc-500 dark:tw-text-zinc-400 hover:tw-text-zinc-600 dark:hover:tw-text-zinc-300 tw-transition"
              onClick={(e) => onActionClick(e, EModalType.EditChannel)}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete" side="top">
            <Trash
              className="tw-hidden group-hover:tw-block tw-w-4 tw-h-4 tw-text-rose-500 dark:tw-text-rose-400 hover:tw-text-rose-600 dark:hover:tw-text-rose-300 tw-transition"
              onClick={(e) => onActionClick(e, EModalType.DeleteChannel)}
            />
          </ActionTooltip>
        </div>
      )}
    </button>
  )
}

export default ServerChannel
