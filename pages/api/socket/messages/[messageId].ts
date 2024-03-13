import { MemberRole } from '@prisma/client'
import { NextApiRequest } from 'next'

import { currentProfilePagesRouter } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { NextApiResponseServerIo } from '@/types/misc'

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('lala-- req-- api/socket/messages/[messageId]', req)

  try {
    const profile = await currentProfilePagesRouter(req)

    // check <ChatInput />'s values and query
    const { messageId, serverId, channelId } = req.query
    const { content } = req.body

    if (!profile) {
      res.status(401).json({ error: 'Unauthorized' })
    }

    if (!serverId) {
      res.status(400).json({ error: 'Server ID missing' })
    }

    if (!channelId) {
      res.status(400).json({ error: 'Channel ID missing' })
    }

    if (!content) {
      res.status(400).json({ error: 'Content missing' })
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
      res.status(404).json({ error: 'Server not found' })
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })

    if (!channel) {
      res.status(404).json({ error: 'Channel not found' })
    }

    // ourselves
    const member = server.members.find((member) => member.profileId === profile.id)

    if (!member) {
      res.status(404).json({ error: 'Member not found' })
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!message || message.deleted) {
      res.status(404).json({ error: 'Message not found' })
    }

    const isMessageOwner = message.memberId === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModedator = member.role === MemberRole.MODERATOR
    const allowEdit = isMessageOwner || isAdmin || isModedator

    if (!allowEdit) {
      res.status(401).json({ error: 'Unauthorized to take action' })
    }

    if (req.method === 'DELETE') {
      message = await db.message.update({
        where: {
          id: messageId as string,
          channelId: channelId as string,
        },
        data: {
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        res.status(401).json({ error: 'Unauthorized to take action' })
      }

      message = await db.message.update({
        where: {
          id: messageId as string,
          channelId: channelId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }

    const updateKey = `chat:${channelId}:messages:update`
    res?.socket?.server?.io?.emit(updateKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('[message_[id]_patch/delete]', error)
    return res.status(500).json({ error: 'Internal error' })
  }
}
