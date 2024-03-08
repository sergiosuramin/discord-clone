'use client'

import { useSocket } from '@/components/provider/socket-provider'
import { Badge } from '@/components/ui/badge'

const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge variant="outline" className="tw-bg-yellow-600 tw-text-white tw-border-none">
        Server Offline
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="tw-bg-emerald-600 tw-text-white tw-border-none">
      Server Online
    </Badge>
  )
}

export default SocketIndicator
