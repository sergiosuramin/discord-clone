import { Hash } from 'lucide-react'

import MobileToggle from '@/components/feature/mobile-toggle'
import SocketIndicator from '@/components/feature/socket-indicator'
import UserAvatar from '@/components/feature/user-avatar'
import { EChatHeaderType } from '@/types/enums'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: EChatHeaderType
  imageUrl?: string
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="tw-font-semibold tw-flex tw-items-center tw-px-3 tw-h-12 tw-border-neutral-200 dark:tw-border-neutral-800 tw-border-b-2">
      <MobileToggle serverId={serverId} />

      {/* Channel conversation */}
      {type === EChatHeaderType.Channel && (
        <Hash className="tw-w-5 tw-h-5 tw-text-zinc-500 dark:tw-text-zinc-400 tw-mr-2" />
      )}

      {/* DM conversation*/}
      {type === EChatHeaderType.DirectMessage && (
        <UserAvatar src={imageUrl} fallback={name} className="tw-w-8 tw-h-8 md:tw-w-8 md:tw-h-8 tw-mr-2" />
      )}

      <p className="tw-font-semibold tw-text-foreground tw-truncate">{name}</p>

      <div className="tw-ml-auto tw-flex tw-items-center">
        <SocketIndicator />
      </div>
    </div>
  )
}

export default ChatHeader
