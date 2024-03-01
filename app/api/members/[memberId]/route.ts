import { NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

type ManageMemberPatchParamsProps = {
  params: {
    memberId: string
  }
}

export async function PATCH(req: Request, { params }: ManageMemberPatchParamsProps) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const { newRole } = await req.json()
    console.log('lala-- role--', newRole)

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
                not: profile.id, // preventing admin from updating themselves
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
    console.log('[manage_member_patch]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}