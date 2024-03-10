/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'

import { socketPath } from '@/lib/constant'
import { NextApiResponseServerIo } from '@/types/misc'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = socketPath
    const httpServer: NetServer = res.socket.server as any
    const io: ServerIO = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    })
    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler
