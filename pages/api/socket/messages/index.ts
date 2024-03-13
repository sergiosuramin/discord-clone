import { NextApiRequest } from 'next'

import { currentProfilePagesRouter } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/types/misc'

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('lala-- req-- api/socket/messages', req)

  try {
    const profile = await currentProfilePagesRouter(req)

    // check <ChatInput />'s values and query
    const { content, fileUrl } = req.body
    const { serverId, channelId } = req.query

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!serverId) {
      return res.status(400).json({ error: 'Server ID missing' })
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID missing' })
    }

    if (!content) {
      return res.status(400).json({ error: 'Content missing' })
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id, // confirming the message sender is a server's member
          },
        },
      },
      include: {
        members: true,
      },
    })

    if (!server) {
      return res.status(404).json({ error: 'Message server not found' })
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' })
    }

    // ourselves
    const member = server.members.find((member) => member.profileId === profile.id)

    if (!member) {
      return res.status(404).json({ error: 'Member not found' })
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    // emit socket.io to all active connection
    // this key is to watch for new messages
    const channelKey = `chat:${channelId}:messages`
    res?.socket?.server?.io?.emit(channelKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('[message_post]', error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
