import { ChannelType } from '@prisma/client'
import { Hash, Mic, Video } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ChannelIconProps {
  channelType: ChannelType
  className?: string
}

export default function ChannelIcon({ channelType, className }: ChannelIconProps) {
  const iconProps = { className: cn('tw-w-4 tw-h-4', className) }

  const icons = {
    [ChannelType.TEXT]: <Hash {...iconProps} />,
    [ChannelType.AUDIO]: <Mic {...iconProps} />,
    [ChannelType.VIDEO]: <Video {...iconProps} />,
  }

  return icons[channelType] || null
}
