import { ChannelType } from '@prisma/client'
import { Hash, Mic, Video } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ChannelIconProps {
  channelType: ChannelType
  className?: string
}

export default function ChannelIcon({ channelType, className }: ChannelIconProps) {
  const finalClassName = cn('tw-w-4 tw-h-4', className)

  switch (channelType) {
    case ChannelType.TEXT:
      return <Hash className={finalClassName} />
    case ChannelType.AUDIO:
      return <Mic className={finalClassName} />
    case ChannelType.VIDEO:
      return <Video className={finalClassName} />
  }
}
