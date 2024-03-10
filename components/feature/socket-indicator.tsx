'use client'

import { useSocket } from '@/components/provider/socket-provider'
import { Badge } from '@/components/ui/badge'

const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge variant="outline" className="tw-bg-yellow-600 tw-text-white tw-border-none tw-truncate tw-ml-2">
        Polling connection...
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="tw-bg-emerald-600 tw-text-white tw-border-none tw-truncate tw-ml-2">
      Server Online
    </Badge>
  )
}

export default SocketIndicator
