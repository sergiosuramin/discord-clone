import { Hash } from 'lucide-react'

import MobileToggle from '@/components/mobile-toggle'
import { EChatHeaderType } from '@/types/enums'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: EChatHeaderType
  imageUrl?: string
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  console.log('lala--', imageUrl)
  return (
    <div className="tw-font-semibold tw-flex tw-items-center tw-px-3 tw-h-12 tw-border-neutral-200 dark:tw-border-neutral-800 tw-border-b-2">
      <MobileToggle serverId={serverId} />

      {type === EChatHeaderType.Channel && (
        <Hash className="tw-w-5 tw-h-5 tw-text-zinc-500 dark:tw-text-zinc-400 tw-mr-1" />
      )}

      <p className="tw-font-semibold tw-text-foreground">{name}</p>
    </div>
  )
}

export default ChatHeader
