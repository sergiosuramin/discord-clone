import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

type LeavePatchParamsProps = {
  params: {
    serverId: string
  }
}

export async function PATCH(req: Request, { params }: LeavePatchParamsProps) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.serverId) {
      return new NextResponse('Server ID is missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id, // ensure admin(creator) cannot leave the server
        },
        members: {
          some: {
            profileId: profile.id, // check if profile.id is part of the server
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id, // remove profile.id from server's member
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[server_id_leave]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
