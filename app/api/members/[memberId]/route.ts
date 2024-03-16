import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

type ManageMemberPatchParamsProps = {
  params: {
    memberId: string
  }
}

export async function DELETE(req: Request, { params }: ManageMemberPatchParamsProps) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID is missing', { status: 400 })
    }

    if (!params.memberId) {
      return new NextResponse('Member ID is missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // make sure only admin can do this
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id, // prevent user from kicking themselves by using API
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: ManageMemberPatchParamsProps) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const { newRole } = await req.json()

    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!serverId) {
      return new NextResponse('Server ID is missing', { status: 400 })
    }

    if (!params.memberId) {
      return new NextResponse('Member ID is missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id, // make sure only admin can do this
        // no need to check the role, because we already validate the UI
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id, // preventing user from updating themselves by using API
              },
            },
            data: {
              role: newRole,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
