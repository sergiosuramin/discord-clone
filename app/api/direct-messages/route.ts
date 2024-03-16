import { DirectMessage } from '@prisma/client'
import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

// for testing, lets use smaller limit
const DEFAULT_LIMIT = 10

export async function GET(req: Request) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor') // for the infinite load
    const conversationId = searchParams.get('conversationId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!conversationId) {
      return new NextResponse('Conversation ID Missing', { status: 400 })
    }

    let messages: DirectMessage[] = []

    // cursor is built-in in prisma
    if (cursor) {
      messages = await db.directMessage.findMany({
        take: DEFAULT_LIMIT,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      messages = await db.directMessage.findMany({
        take: DEFAULT_LIMIT,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    let nextCursor = null

    // if messages.length lower than default_limit, it means we are in the last page
    if (messages.length === DEFAULT_LIMIT) {
      nextCursor = messages[DEFAULT_LIMIT - 1].id
    }

    console.log('lala-- messages--', messages)

    return NextResponse.json({
      items: messages,
      nextCursor,
    })
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
